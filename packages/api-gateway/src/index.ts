import express from 'express';
import { handleTrustQuery } from './routes/trustQuery';
import { verifyApiKey, checkRateLimit } from './middleware/auth';

const app = express();
app.use(express.json());

// Apply global auth mechanism
app.use(verifyApiKey);
app.use(checkRateLimit);

// Endpoint from Developer Reference 5.2 and Tech Paper 7.3
app.get('/v1/trust/:address/chain/:chainId', handleTrustQuery);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Cencera API Gateway listening on port ${port}`);
});
