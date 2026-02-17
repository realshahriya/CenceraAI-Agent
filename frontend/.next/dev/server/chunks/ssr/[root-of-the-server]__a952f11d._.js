module.exports = [
    "[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

        const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

        module.exports = mod;
    }),
    "[project]/frontend/app/components/Chat.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
        "use strict";

        __turbopack_context__.s([
            "default",
            () => Chat
        ]);
        var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
        var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
        var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
        'use client';
        ;
        ;
        ;
        function Chat({ agentId, walletAddress, onSendMessage }) {
            const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
            const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
            const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
            const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
            const scrollToBottom = () => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: 'smooth'
                });
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(() => {
                scrollToBottom();
            }, [
                messages
            ]);
            const handleSubmit = async (e) => {
                e.preventDefault();
                if (!input.trim() || !agentId || !walletAddress) return;
                const userMessage = input;
                setInput('');
                setLoading(true);
                // Add user message to UI immediately
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'user',
                        content: userMessage
                    }
                ]);
                try {
                    const response = await onSendMessage(userMessage);
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: 'agent',
                            content: response
                        }
                    ]);
                } catch (error) {
                    console.error("Chat error:", error);
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: 'system',
                            content: "Error: Failed to get response."
                        }
                    ]);
                } finally {
                    setLoading(false);
                }
            };
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-6f561a0353df2600" + " " + "chat-container",
                children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-6f561a0353df2600" + " " + "messages-area",
                    children: [
                        messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6f561a0353df2600" + " " + "empty-state",
                            children: "Start a conversation with your immutable agent."
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/Chat.js",
                            lineNumber: 44,
                            columnNumber: 21
                        }, this),
                        messages.map((msg, idx) =>/*#__PURE__*/(0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6f561a0353df2600" + " " + `message ${msg.role}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-6f561a0353df2600" + " " + "message-content",
                                children: msg.content
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/Chat.js",
                                lineNumber: 50,
                                columnNumber: 25
                            }, this)
                        }, idx, false, {
                            fileName: "[project]/frontend/app/components/Chat.js",
                            lineNumber: 49,
                            columnNumber: 21
                        }, this)),
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6f561a0353df2600" + " " + "message agent loading",
                            children: "Thinking..."
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/Chat.js",
                            lineNumber: 53,
                            columnNumber: 29
                        }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: messagesEndRef,
                            className: "jsx-6f561a0353df2600"
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/Chat.js",
                            lineNumber: 54,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/components/Chat.js",
                    lineNumber: 42,
                    columnNumber: 13
                }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "jsx-6f561a0353df2600" + " " + "input-area",
                    children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: input,
                        onChange: (e) => setInput(e.target.value),
                        placeholder: walletAddress ? "Type a message..." : "Connect wallet to chat",
                        disabled: !walletAddress || loading,
                        className: "jsx-6f561a0353df2600"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/Chat.js",
                        lineNumber: 58,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: !walletAddress || loading,
                        className: "jsx-6f561a0353df2600",
                        children: "Send"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/Chat.js",
                        lineNumber: 65,
                        columnNumber: 17
                    }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/components/Chat.js",
                    lineNumber: 57,
                    columnNumber: 13
                }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    id: "6f561a0353df2600",
                    children: ".chat-container.jsx-6f561a0353df2600{background:#111;border:1px solid #333;border-radius:8px;flex-direction:column;height:100%;display:flex;overflow:hidden}.messages-area.jsx-6f561a0353df2600{flex-direction:column;flex:1;gap:15px;padding:20px;display:flex;overflow-y:auto}.message.jsx-6f561a0353df2600{border-radius:12px;max-width:80%;padding:10px 15px;line-height:1.4}.message.user.jsx-6f561a0353df2600{color:#fff;background:#0070f3;align-self:flex-end}.message.agent.jsx-6f561a0353df2600{color:#eee;background:#333;align-self:flex-start}.message.system.jsx-6f561a0353df2600{color:#f44;background:0 0;align-self:center;font-size:.9em}.input-area.jsx-6f561a0353df2600{background:#1a1a1a;border-top:1px solid #333;padding:15px;display:flex}input.jsx-6f561a0353df2600{color:#fff;background:#000;border:1px solid #333;border-radius:4px;flex:1;margin-right:10px;padding:10px}button.jsx-6f561a0353df2600{color:#fff;cursor:pointer;background:#0070f3;border:none;border-radius:4px;padding:10px 20px}button.jsx-6f561a0353df2600:disabled{cursor:not-allowed;background:#444}.empty-state.jsx-6f561a0353df2600{text-align:center;color:#666;margin-top:50px}"
                }, void 0, false, void 0, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/Chat.js",
                lineNumber: 41,
                columnNumber: 9
            }, this);
        }
    }),
    "[project]/frontend/app/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
        "use strict";

        __turbopack_context__.s([
            "default",
            () => Home
        ]);
        var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
        var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
        var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
        (() => {
            const e = new Error("Cannot find module 'ethers'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        })();
        (() => {
            const e = new Error("Cannot find module 'axios'");
            e.code = 'MODULE_NOT_FOUND';
            throw e;
        })();
        var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$Chat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/Chat.js [app-ssr] (ecmascript)");
        'use client';
        ;
        ;
        ;
        ;
        ;
        ;
        function Home() {
            const [walletAddress, setWalletAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
            const [agent, setAgent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
            const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
            // Constants
            const BACKEND_URL = 'http://localhost:3001';
            // Mock Agent Data for Prototype if not on-chain yet
            const MOCK_AGENT = {
                id: 1,
                innovationScore: 5,
                memoryCount: 12
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(() => {
                checkConnection();
            }, []);
            const checkConnection = async () => {
                if (typeof window.ethereum !== 'undefined') {
                    try {
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        const accounts = await provider.listAccounts();
                        if (accounts.length > 0) {
                            setWalletAddress(accounts[0].address);
                            fetchAgentData(1); // Default to Agent 1 for prototype
                        }
                    } catch (error) {
                        console.error("Connection check failed", error);
                    }
                }
            };
            const connectWallet = async () => {
                if (typeof window.ethereum !== 'undefined') {
                    try {
                        const provider = new ethers.BrowserProvider(window.ethereum);
                        await provider.send("eth_requestAccounts", []);
                        const signer = await provider.getSigner();
                        setWalletAddress(await signer.getAddress());
                        fetchAgentData(1);
                    } catch (error) {
                        console.error("Connection failed", error);
                        alert("Failed to connect wallet.");
                    }
                } else {
                    alert("Please install MetaMask!");
                }
            };
            const fetchAgentData = async (agentId) => {
                setLoading(true);
                // In a real app, fetch from smart contract or backend
                // For prototype, we simulate fetching
                setTimeout(() => {
                    setAgent(MOCK_AGENT);
                    setLoading(false);
                }, 1000);
            };
            const handleSendMessage = async (message) => {
                try {
                    const response = await axios.post(`${BACKEND_URL}/chat`, {
                        message,
                        agentId: agent.id,
                        walletAddress
                    });
                    return response.data.reply;
                } catch (error) {
                    console.error("API Error:", error);
                    throw error;
                }
            };
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "jsx-25e25340984a6e51" + " " + "main-container",
                children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "jsx-25e25340984a6e51" + " " + "header",
                    children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "jsx-25e25340984a6e51" + " " + "logo",
                        children: "CenceraAI"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/page.js",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-25e25340984a6e51" + " " + "wallet-section",
                        children: walletAddress ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "jsx-25e25340984a6e51" + " " + "address",
                            children: [
                                walletAddress.slice(0, 6),
                                "...",
                                walletAddress.slice(-4)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/page.js",
                            lineNumber: 87,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: connectWallet,
                            className: "jsx-25e25340984a6e51" + " " + "connect-btn",
                            children: "Connect Wallet"
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.js",
                            lineNumber: 91,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/page.js",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/page.js",
                    lineNumber: 83,
                    columnNumber: 7
                }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-25e25340984a6e51" + " " + "content",
                    children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-25e25340984a6e51" + " " + "agent-card",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "jsx-25e25340984a6e51",
                            children: "Your Agent"
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.js",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-25e25340984a6e51",
                                children: "Loading agent data..."
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/page.js",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this) : agent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-25e25340984a6e51" + " " + "stats",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-25e25340984a6e51" + " " + "stat",
                                    children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-25e25340984a6e51" + " " + "label",
                                        children: "ID"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 106,
                                        columnNumber: 17
                                    }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-25e25340984a6e51" + " " + "value",
                                        children: [
                                            "#",
                                            agent.id
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 107,
                                        columnNumber: 17
                                    }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/page.js",
                                    lineNumber: 105,
                                    columnNumber: 15
                                }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-25e25340984a6e51" + " " + "stat",
                                    children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-25e25340984a6e51" + " " + "label",
                                        children: "Innovation Score"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 110,
                                        columnNumber: 17
                                    }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-25e25340984a6e51" + " " + "value",
                                        children: agent.innovationScore
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 111,
                                        columnNumber: 17
                                    }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/page.js",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-25e25340984a6e51" + " " + "stat",
                                    children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-25e25340984a6e51" + " " + "label",
                                        children: "Memories"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-25e25340984a6e51" + " " + "value",
                                        children: agent.memoryCount
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/page.js",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/page.js",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-25e25340984a6e51",
                                children: "Connect wallet to view agent."
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/page.js",
                                lineNumber: 119,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/page.js",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-25e25340984a6e51" + " " + "chat-section",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$Chat$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            agentId: agent?.id,
                            walletAddress: walletAddress,
                            onSendMessage: handleSendMessage
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.js",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/page.js",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/page.js",
                    lineNumber: 98,
                    columnNumber: 7
                }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    id: "95aeaa01c770cc1e",
                    children: "body{color:#fff;background:#000;margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}"
                }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    id: "13e520bfff86440c",
                    children: ".main-container.jsx-25e25340984a6e51{flex-direction:column;max-width:1200px;height:100vh;margin:0 auto;padding:20px;display:flex}.header.jsx-25e25340984a6e51{border-bottom:1px solid #333;justify-content:space-between;align-items:center;padding-bottom:20px;display:flex}.logo.jsx-25e25340984a6e51{-webkit-text-fill-color:transparent;background:linear-gradient(45deg,#0070f3,#0f8);-webkit-background-clip:text;font-size:1.5rem;font-weight:700}.connect-btn.jsx-25e25340984a6e51{color:#000;cursor:pointer;background:#fff;border:none;border-radius:20px;padding:10px 20px;font-weight:700;transition:transform .2s}.connect-btn.jsx-25e25340984a6e51:hover{transform:scale(1.05)}.address.jsx-25e25340984a6e51{background:#222;border-radius:12px;padding:8px 12px;font-family:monospace}.content.jsx-25e25340984a6e51{flex:1;gap:20px;margin-top:20px;display:flex;overflow:hidden}.agent-card.jsx-25e25340984a6e51{background:#111;border:1px solid #333;border-radius:12px;flex:1;max-width:300px;padding:20px}.stats.jsx-25e25340984a6e51{flex-direction:column;gap:15px;margin-top:20px;display:flex}.stat.jsx-25e25340984a6e51{background:#222;border-radius:8px;justify-content:space-between;padding:10px;display:flex}.label.jsx-25e25340984a6e51{color:#888}.value.jsx-25e25340984a6e51{color:#0f8;font-weight:700}.chat-section.jsx-25e25340984a6e51{flex-direction:column;flex:2;display:flex}"
                }, void 0, false, void 0, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/page.js",
                lineNumber: 82,
                columnNumber: 5
            }, this);
        }
    }),
    "[project]/frontend/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
        "use strict";

        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        else {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            else {
                if ("TURBOPACK compile-time truthy", 1) {
                    if ("TURBOPACK compile-time truthy", 1) {
                        module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
                    } else //TURBOPACK unreachable
                        ;
                } else //TURBOPACK unreachable
                    ;
            }
        } //# sourceMappingURL=module.compiled.js.map
    }),
    "[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
        "use strict";

        module.exports = __turbopack_context__.r("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
    }),
    "[project]/frontend/node_modules/next/dist/compiled/client-only/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

    }),
    "[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
        "use strict";

        module.exports = __turbopack_context__.r("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
    }),
    "[project]/frontend/node_modules/styled-jsx/dist/index/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

        __turbopack_context__.r("[project]/frontend/node_modules/next/dist/compiled/client-only/index.js [app-ssr] (ecmascript)");
        var React = __turbopack_context__.r("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
        function _interopDefaultLegacy(e) {
            return e && typeof e === 'object' && 'default' in e ? e : {
                'default': e
            };
        }
        var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);
/*
Based on Glamor's sheet
https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
*/ function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps) _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            return Constructor;
        }
        var isProd = typeof process !== "undefined" && process.env && ("TURBOPACK compile-time value", "development") === "production";
        var isString = function (o) {
            return Object.prototype.toString.call(o) === "[object String]";
        };
        var StyleSheet = /*#__PURE__*/ function () {
            function StyleSheet(param) {
                var ref = param === void 0 ? {} : param, _name = ref.name, name = _name === void 0 ? "stylesheet" : _name, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? isProd : _optimizeForSpeed;
                invariant$1(isString(name), "`name` must be a string");
                this._name = name;
                this._deletedRulePlaceholder = "#" + name + "-deleted-rule____{}";
                invariant$1(typeof optimizeForSpeed === "boolean", "`optimizeForSpeed` must be a boolean");
                this._optimizeForSpeed = optimizeForSpeed;
                this._serverSheet = undefined;
                this._tags = [];
                this._injected = false;
                this._rulesCount = 0;
                var node = ("TURBOPACK compile-time value", "undefined") !== "undefined" && document.querySelector('meta[property="csp-nonce"]');
                this._nonce = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
            }
            var _proto = StyleSheet.prototype;
            _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
                invariant$1(typeof bool === "boolean", "`setOptimizeForSpeed` accepts a boolean");
                invariant$1(this._rulesCount === 0, "optimizeForSpeed cannot be when rules have already been inserted");
                this.flush();
                this._optimizeForSpeed = bool;
                this.inject();
            };
            _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
                return this._optimizeForSpeed;
            };
            _proto.inject = function inject() {
                var _this = this;
                invariant$1(!this._injected, "sheet already injected");
                this._injected = true;
                if (("TURBOPACK compile-time value", "undefined") !== "undefined" && this._optimizeForSpeed) //TURBOPACK unreachable
                    ;
                this._serverSheet = {
                    cssRules: [],
                    insertRule: function (rule, index) {
                        if (typeof index === "number") {
                            _this._serverSheet.cssRules[index] = {
                                cssText: rule
                            };
                        } else {
                            _this._serverSheet.cssRules.push({
                                cssText: rule
                            });
                        }
                        return index;
                    },
                    deleteRule: function (index) {
                        _this._serverSheet.cssRules[index] = null;
                    }
                };
            };
            _proto.getSheetForTag = function getSheetForTag(tag) {
                if (tag.sheet) {
                    return tag.sheet;
                }
                // this weirdness brought to you by firefox
                for (var i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].ownerNode === tag) {
                        return document.styleSheets[i];
                    }
                }
            };
            _proto.getSheet = function getSheet() {
                return this.getSheetForTag(this._tags[this._tags.length - 1]);
            };
            _proto.insertRule = function insertRule(rule, index) {
                invariant$1(isString(rule), "`insertRule` accepts only strings");
                if ("TURBOPACK compile-time truthy", 1) {
                    if (typeof index !== "number") {
                        index = this._serverSheet.cssRules.length;
                    }
                    this._serverSheet.insertRule(rule, index);
                    return this._rulesCount++;
                }
                //TURBOPACK unreachable
                ;
                var sheet;
                var insertionPoint;
            };
            _proto.replaceRule = function replaceRule(index, rule) {
                if (this._optimizeForSpeed || ("TURBOPACK compile-time value", "undefined") === "undefined") {
                    var sheet = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : this._serverSheet;
                    if (!rule.trim()) {
                        rule = this._deletedRulePlaceholder;
                    }
                    if (!sheet.cssRules[index]) {
                        // @TBD Should we throw an error?
                        return index;
                    }
                    sheet.deleteRule(index);
                    try {
                        sheet.insertRule(rule, index);
                    } catch (error) {
                        if ("TURBOPACK compile-time truthy", 1) {
                            console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
                        }
                        // In order to preserve the indices we insert a deleteRulePlaceholder
                        sheet.insertRule(this._deletedRulePlaceholder, index);
                    }
                } else //TURBOPACK unreachable
                {
                    var tag;
                }
                return index;
            };
            _proto.deleteRule = function deleteRule(index) {
                if ("TURBOPACK compile-time truthy", 1) {
                    this._serverSheet.deleteRule(index);
                    return;
                }
                //TURBOPACK unreachable
                ;
                var tag;
            };
            _proto.flush = function flush() {
                this._injected = false;
                this._rulesCount = 0;
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                else {
                    // simpler on server
                    this._serverSheet.cssRules = [];
                }
            };
            _proto.cssRules = function cssRules() {
                var _this = this;
                if ("TURBOPACK compile-time truthy", 1) {
                    return this._serverSheet.cssRules;
                }
                //TURBOPACK unreachable
                ;
            };
            _proto.makeStyleTag = function makeStyleTag(name, cssString, relativeToTag) {
                if (cssString) {
                    invariant$1(isString(cssString), "makeStyleTag accepts only strings as second parameter");
                }
                var tag = document.createElement("style");
                if (this._nonce) tag.setAttribute("nonce", this._nonce);
                tag.type = "text/css";
                tag.setAttribute("data-" + name, "");
                if (cssString) {
                    tag.appendChild(document.createTextNode(cssString));
                }
                var head = document.head || document.getElementsByTagName("head")[0];
                if (relativeToTag) {
                    head.insertBefore(tag, relativeToTag);
                } else {
                    head.appendChild(tag);
                }
                return tag;
            };
            _createClass(StyleSheet, [
                {
                    key: "length",
                    get: function get() {
                        return this._rulesCount;
                    }
                }
            ]);
            return StyleSheet;
        }();
        function invariant$1(condition, message) {
            if (!condition) {
                throw new Error("StyleSheet: " + message + ".");
            }
        }
        function hash(str) {
            var _$hash = 5381, i = str.length;
            while (i) {
                _$hash = _$hash * 33 ^ str.charCodeAt(--i);
            }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */ return _$hash >>> 0;
        }
        var stringHash = hash;
        var sanitize = function (rule) {
            return rule.replace(/\/style/gi, "\\/style");
        };
        var cache = {};
/**
 * computeId
 *
 * Compute and memoize a jsx id from a basedId and optionally props.
 */ function computeId(baseId, props) {
            if (!props) {
                return "jsx-" + baseId;
            }
            var propsToString = String(props);
            var key = baseId + propsToString;
            if (!cache[key]) {
                cache[key] = "jsx-" + stringHash(baseId + "-" + propsToString);
            }
            return cache[key];
        }
/**
 * computeSelector
 *
 * Compute and memoize dynamic selectors.
 */ function computeSelector(id, css) {
            var selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g;
            // Sanitize SSR-ed CSS.
            // Client side code doesn't need to be sanitized since we use
            // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
            if ("TURBOPACK compile-time truthy", 1) {
                css = sanitize(css);
            }
            var idcss = id + css;
            if (!cache[idcss]) {
                cache[idcss] = css.replace(selectoPlaceholderRegexp, id);
            }
            return cache[idcss];
        }
        function mapRulesToStyle(cssRules, options) {
            if (options === void 0) options = {};
            return cssRules.map(function (args) {
                var id = args[0];
                var css = args[1];
                return /*#__PURE__*/ React__default["default"].createElement("style", {
                    id: "__" + id,
                    // Avoid warnings upon render with a key
                    key: "__" + id,
                    nonce: options.nonce ? options.nonce : undefined,
                    dangerouslySetInnerHTML: {
                        __html: css
                    }
                });
            });
        }
        var StyleSheetRegistry = /*#__PURE__*/ function () {
            function StyleSheetRegistry(param) {
                var ref = param === void 0 ? {} : param, _styleSheet = ref.styleSheet, styleSheet = _styleSheet === void 0 ? null : _styleSheet, _optimizeForSpeed = ref.optimizeForSpeed, optimizeForSpeed = _optimizeForSpeed === void 0 ? false : _optimizeForSpeed;
                this._sheet = styleSheet || new StyleSheet({
                    name: "styled-jsx",
                    optimizeForSpeed: optimizeForSpeed
                });
                this._sheet.inject();
                if (styleSheet && typeof optimizeForSpeed === "boolean") {
                    this._sheet.setOptimizeForSpeed(optimizeForSpeed);
                    this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
                }
                this._fromServer = undefined;
                this._indices = {};
                this._instancesCounts = {};
            }
            var _proto = StyleSheetRegistry.prototype;
            _proto.add = function add(props) {
                var _this = this;
                if (undefined === this._optimizeForSpeed) {
                    this._optimizeForSpeed = Array.isArray(props.children);
                    this._sheet.setOptimizeForSpeed(this._optimizeForSpeed);
                    this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
                }
                if (("TURBOPACK compile-time value", "undefined") !== "undefined" && !this._fromServer) //TURBOPACK unreachable
                    ;
                var ref = this.getIdAndRules(props), styleId = ref.styleId, rules = ref.rules;
                // Deduping: just increase the instances count.
                if (styleId in this._instancesCounts) {
                    this._instancesCounts[styleId] += 1;
                    return;
                }
                var indices = rules.map(function (rule) {
                    return _this._sheet.insertRule(rule);
                }) // Filter out invalid rules
                    .filter(function (index) {
                        return index !== -1;
                    });
                this._indices[styleId] = indices;
                this._instancesCounts[styleId] = 1;
            };
            _proto.remove = function remove(props) {
                var _this = this;
                var styleId = this.getIdAndRules(props).styleId;
                invariant(styleId in this._instancesCounts, "styleId: `" + styleId + "` not found");
                this._instancesCounts[styleId] -= 1;
                if (this._instancesCounts[styleId] < 1) {
                    var tagFromServer = this._fromServer && this._fromServer[styleId];
                    if (tagFromServer) {
                        tagFromServer.parentNode.removeChild(tagFromServer);
                        delete this._fromServer[styleId];
                    } else {
                        this._indices[styleId].forEach(function (index) {
                            return _this._sheet.deleteRule(index);
                        });
                        delete this._indices[styleId];
                    }
                    delete this._instancesCounts[styleId];
                }
            };
            _proto.update = function update(props, nextProps) {
                this.add(nextProps);
                this.remove(props);
            };
            _proto.flush = function flush() {
                this._sheet.flush();
                this._sheet.inject();
                this._fromServer = undefined;
                this._indices = {};
                this._instancesCounts = {};
            };
            _proto.cssRules = function cssRules() {
                var _this = this;
                var fromServer = this._fromServer ? Object.keys(this._fromServer).map(function (styleId) {
                    return [
                        styleId,
                        _this._fromServer[styleId]
                    ];
                }) : [];
                var cssRules = this._sheet.cssRules();
                return fromServer.concat(Object.keys(this._indices).map(function (styleId) {
                    return [
                        styleId,
                        _this._indices[styleId].map(function (index) {
                            return cssRules[index].cssText;
                        }).join(_this._optimizeForSpeed ? "" : "\n")
                    ];
                }) // filter out empty rules
                    .filter(function (rule) {
                        return Boolean(rule[1]);
                    }));
            };
            _proto.styles = function styles(options) {
                return mapRulesToStyle(this.cssRules(), options);
            };
            _proto.getIdAndRules = function getIdAndRules(props) {
                var css = props.children, dynamic = props.dynamic, id = props.id;
                if (dynamic) {
                    var styleId = computeId(id, dynamic);
                    return {
                        styleId: styleId,
                        rules: Array.isArray(css) ? css.map(function (rule) {
                            return computeSelector(styleId, rule);
                        }) : [
                            computeSelector(styleId, css)
                        ]
                    };
                }
                return {
                    styleId: computeId(id),
                    rules: Array.isArray(css) ? css : [
                        css
                    ]
                };
            };
    /**
   * selectFromServer
   *
   * Collects style tags from the document with id __jsx-XXX
   */ _proto.selectFromServer = function selectFromServer() {
                var elements = Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]'));
                return elements.reduce(function (acc, element) {
                    var id = element.id.slice(2);
                    acc[id] = element;
                    return acc;
                }, {});
            };
            return StyleSheetRegistry;
        }();
        function invariant(condition, message) {
            if (!condition) {
                throw new Error("StyleSheetRegistry: " + message + ".");
            }
        }
        var StyleSheetContext = /*#__PURE__*/ React.createContext(null);
        StyleSheetContext.displayName = "StyleSheetContext";
        function createStyleRegistry() {
            return new StyleSheetRegistry();
        }
        function StyleRegistry(param) {
            var configuredRegistry = param.registry, children = param.children;
            var rootRegistry = React.useContext(StyleSheetContext);
            var ref = React.useState(function () {
                return rootRegistry || configuredRegistry || createStyleRegistry();
            }), registry = ref[0];
            return /*#__PURE__*/ React__default["default"].createElement(StyleSheetContext.Provider, {
                value: registry
            }, children);
        }
        function useStyleRegistry() {
            return React.useContext(StyleSheetContext);
        }
        // Opt-into the new `useInsertionEffect` API in React 18, fallback to `useLayoutEffect`.
        // https://github.com/reactwg/react-18/discussions/110
        var useInsertionEffect = React__default["default"].useInsertionEffect || React__default["default"].useLayoutEffect;
        var defaultRegistry = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined;
        function JSXStyle(props) {
            var registry = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : useStyleRegistry();
            // If `registry` does not exist, we do nothing here.
            if (!registry) {
                return null;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                registry.add(props);
                return null;
            }
            //TURBOPACK unreachable
            ;
        }
        JSXStyle.dynamic = function (info) {
            return info.map(function (tagInfo) {
                var baseId = tagInfo[0];
                var props = tagInfo[1];
                return computeId(baseId, props);
            }).join(" ");
        };
        exports.StyleRegistry = StyleRegistry;
        exports.createStyleRegistry = createStyleRegistry;
        exports.style = JSXStyle;
        exports.useStyleRegistry = useStyleRegistry;
    }),
    "[project]/frontend/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

        module.exports = __turbopack_context__.r("[project]/frontend/node_modules/styled-jsx/dist/index/index.js [app-ssr] (ecmascript)").style;
    }),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a952f11d._.js.map