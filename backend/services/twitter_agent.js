const axios = require('axios');
const { google } = require('googleapis');
require('dotenv').config();

// Roadmap Step 1: Keywords
const KEYWORDS = [
    "Crypto", "Blockchain", "Cryptocurrency", "RWA", "Defi", "DePin", "TGE",
    "token generation event", "mainnet launch", "testnet", "whitepaper",
    "protocol", "audit", "smart contract", "zk", "layer 1", "layer 2",
    "wallet", "dex", "swap", "token", "tokenomics", "coin", "airdrop"
];

class TwitterAgentService {
    constructor() {
        this.apiKey = process.env.TWITTERAPI_IO_KEY;
        this.baseUrl = 'https://api.twitterapi.io/twitter';
        this.sheetId = process.env.GOOGLE_SHEET_ID;
    }

    async start() {
        console.log("Starting Twitter Discovery Agent...");
        if (!this.apiKey) {
            console.error("Missing TWITTERAPI_IO_KEY in environment.");
            return;
        }

        try {
            const projects = await this.findCryptoProjects();
            if (projects.length > 0) {
                console.log(`Found ${projects.length} matching projects. Logging to Google Sheets...`);
                await this.logToGoogleSheets(projects);
            } else {
                console.log("No new projects found matching the criteria.");
            }
        } catch (error) {
            console.error("Error running Twitter Agent:", error.message);
        }
    }

    async findCryptoProjects() {
        const foundProjects = [];

        // Build a query: e.g., "Crypto" OR "Blockchain"
        // To avoid URI too long, we might just search a subset or cycle through them
        // Let's use a combined OR query for a subset of highest value keywords for this run
        const queryKeywords = KEYWORDS.slice(0, 5).join(" OR ");
        const query = `${queryKeywords} -filter:replies`;

        console.log(`Searching Twitter with query: ${query}`);

        try {
            const response = await axios.get(`${this.baseUrl}/tweet/advanced_search`, {
                headers: { 'X-API-Key': this.apiKey },
                params: {
                    query: query,
                    queryType: 'Latest'
                }
            });

            if (!response.data || !response.data.tweets) {
                console.log("No tweets returned from search.");
                return foundProjects;
            }

            const tweets = response.data.tweets;

            // Deduplicate authors
            const processedAuthors = new Set();

            for (const tweet of tweets) {
                const author = tweet.author;
                if (!author) continue;

                if (processedAuthors.has(author.id)) continue;
                processedAuthors.add(author.id);

                console.log(`Evaluating account: @${author.userName}`);

                // Step 2: Check the account is verified or not (blue or yellow tick)
                // In twitterapi.io, verified is 'isBlueVerified' or 'verifiedType'
                if (!author.isBlueVerified && !author.verifiedType) {
                    console.log(`  -> Skipped: Not verified.`);
                    continue;
                }

                // Step 3 & 4: Read the bio of the account to ensure project, not user.
                const bio = author.description ? author.description.toLowerCase() : "";
                if (!bio) {
                    console.log(`  -> Skipped: No bio.`);
                    continue;
                }

                // Heuristics for personal account: pronouns, "I am", "my opinions", etc.
                const personalKeywords = [" i ", " my ", " me ", "father", "husband", "wife", "mother", "he/him", "she/her", "personal account", "opinions are my own"];
                const isPersonal = personalKeywords.some(kw => bio.includes(kw));
                if (isPersonal) {
                    console.log(`  -> Skipped: Appears to be a personal/user account.`);
                    continue;
                }

                // Step 5: Followers should be >300 to <36000
                const followers = author.followers || 0;
                if (followers <= 300 || followers >= 36000) {
                    console.log(`  -> Skipped: Follower count ${followers} not in range (300-36000).`);
                    continue;
                }

                // Step 6: Post/retweet in past 1 week. 
                // Since this tweet was from 'Latest' search, the account by definition posted recently.
                const tweetDate = new Date(tweet.createdAt);
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                if (tweetDate < oneWeekAgo) {
                    console.log(`  -> Skipped: Latest tweet older than 1 week.`);
                    continue;
                }

                // Step 7: Ensure project is not a NFT project
                if (bio.includes("nft") || author.name.toLowerCase().includes("nft")) {
                    console.log(`  -> Skipped: Appears to be an NFT project.`);
                    continue;
                }

                // Step 8: Copy the project website link
                let website = "";
                if (author.profile_bio && author.profile_bio.entities && author.profile_bio.entities.url) {
                    const urls = author.profile_bio.entities.url.urls;
                    if (urls && urls.length > 0) {
                        website = urls[0].expanded_url || urls[0].url;
                    }
                }

                // Fallback to text embedded URL if distinct field is empty
                if (!website && author.url) {
                    website = author.url;
                }

                console.log(`  -> MATCH FOUND! @${author.userName}`);
                foundProjects.push({
                    name: author.name,
                    x_link: `https://x.com/${author.userName}`,
                    website: website || "N/A",
                    category: "Crypto Project" // Default category based on search
                });
            }

        } catch (error) {
            console.error("Error fetching from twitterapi.io:", error.message);
            if (error.response) {
                console.error(error.response.data);
            }
        }

        return foundProjects;
    }

    // Step 9: Add project details into Google sheet
    async logToGoogleSheets(projects) {
        try {
            const auth = new google.auth.GoogleAuth({
                credentials: {
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
                },
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });

            const sheets = google.sheets({ version: 'v4', auth });

            const values = projects.map(p => [
                p.name,
                p.website,
                p.x_link,
                p.category
            ]);

            const resource = {
                values,
            };

            await sheets.spreadsheets.values.append({
                spreadsheetId: this.sheetId,
                range: 'Agent X Sheet!A:D',
                valueInputOption: 'USER_ENTERED',
                resource,
            });

            console.log(`Successfully appended ${projects.length} rows to Google Sheet.`);

        } catch (error) {
            console.error("Error logging to Google Sheets:", error.message);
        }
    }
}

module.exports = { twitterAgentService: new TwitterAgentService() };
