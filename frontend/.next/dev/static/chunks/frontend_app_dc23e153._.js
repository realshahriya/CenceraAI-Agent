(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/frontend/app/components/Chat.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Chat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Chat({ agentId, walletAddress, onSendMessage }) {
    _s();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollToBottom = ()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    };
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Chat.useEffect": ()=>{
            setMounted(true);
            scrollToBottom();
        }
    }["Chat.useEffect"], [
        messages,
        loading
    ]);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!input.trim() || !agentId || !walletAddress) return;
        const userMessage = input;
        setInput('');
        setLoading(true);
        // Add user message to UI immediately
        setMessages((prev)=>[
                ...prev,
                {
                    role: 'user',
                    content: userMessage
                }
            ]);
        try {
            const response = await onSendMessage(userMessage);
            setMessages((prev_1)=>[
                    ...prev_1,
                    {
                        role: 'agent',
                        content: response
                    }
                ]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev_0)=>[
                    ...prev_0,
                    {
                        role: 'system',
                        content: "Error: Neural Link Fragmented. Failed to get response."
                    }
                ]);
        } finally{
            setLoading(false);
        }
    };
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-6ea9efc591bda3e9" + " " + "chat-interface",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-6ea9efc591bda3e9" + " " + "messages-area",
                children: [
                    messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-6ea9efc591bda3e9" + " " + "empty-state",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-6ea9efc591bda3e9" + " " + "icon",
                                children: "🧠"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/Chat.js",
                                lineNumber: 55,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "jsx-6ea9efc591bda3e9",
                                children: "CENCERA SYSTEM STANDBY"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/Chat.js",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-6ea9efc591bda3e9",
                                children: "Initiate cognitive synchronization sequence."
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/components/Chat.js",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/components/Chat.js",
                        lineNumber: 54,
                        columnNumber: 34
                    }, this) : messages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6ea9efc591bda3e9" + " " + `message-row ${msg.role}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-6ea9efc591bda3e9" + " " + "bubble",
                                children: [
                                    msg.role === 'agent' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-6ea9efc591bda3e9" + " " + "sender-label",
                                        children: "CENCERA AI"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/components/Chat.js",
                                        lineNumber: 60,
                                        columnNumber: 42
                                    }, this),
                                    msg.content
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/components/Chat.js",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this)
                        }, idx, false, {
                            fileName: "[project]/frontend/app/components/Chat.js",
                            lineNumber: 58,
                            columnNumber: 47
                        }, this)),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-6ea9efc591bda3e9" + " " + "message-row agent",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-6ea9efc591bda3e9" + " " + "bubble loading-bubble",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-6ea9efc591bda3e9" + " " + "dot"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/Chat.js",
                                    lineNumber: 67,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-6ea9efc591bda3e9" + " " + "dot"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/Chat.js",
                                    lineNumber: 68,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-6ea9efc591bda3e9" + " " + "dot"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/components/Chat.js",
                                    lineNumber: 69,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/components/Chat.js",
                            lineNumber: 66,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/Chat.js",
                        lineNumber: 65,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef,
                        className: "jsx-6ea9efc591bda3e9"
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/components/Chat.js",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/components/Chat.js",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-6ea9efc591bda3e9" + " " + "input-wrapper",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "jsx-6ea9efc591bda3e9" + " " + "input-box",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: input,
                            onChange: (e_0)=>setInput(e_0.target.value),
                            placeholder: walletAddress ? "Enter command protocol..." : "Neural link required",
                            disabled: !walletAddress || loading,
                            className: "jsx-6ea9efc591bda3e9"
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/Chat.js",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: !walletAddress || loading || !input.trim(),
                            className: "jsx-6ea9efc591bda3e9",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                className: "jsx-6ea9efc591bda3e9",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "22",
                                        y1: "2",
                                        x2: "11",
                                        y2: "13",
                                        className: "jsx-6ea9efc591bda3e9"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/components/Chat.js",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                        points: "22 2 15 22 11 13 2 9 22 2",
                                        className: "jsx-6ea9efc591bda3e9"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/components/Chat.js",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/components/Chat.js",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/components/Chat.js",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/frontend/app/components/Chat.js",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/frontend/app/components/Chat.js",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "6ea9efc591bda3e9",
                children: ".chat-interface.jsx-6ea9efc591bda3e9{flex-direction:column;height:100%;display:flex;position:relative}.messages-area.jsx-6ea9efc591bda3e9{flex-direction:column;flex:1;gap:18px;padding:24px;display:flex;overflow-y:auto}.message-row.jsx-6ea9efc591bda3e9{width:100%;display:flex}.message-row.user.jsx-6ea9efc591bda3e9{justify-content:flex-end}.message-row.agent.jsx-6ea9efc591bda3e9{justify-content:flex-start}.sender-label.jsx-6ea9efc591bda3e9{color:var(--neon-cyan);letter-spacing:1px;margin-bottom:4px;font-size:.6rem;font-weight:700;display:block}.bubble.jsx-6ea9efc591bda3e9{word-wrap:break-word;max-width:80%;font-size:.95rem;line-height:1.5;font-family:var(--font-mono);border-radius:12px;padding:14px 20px;position:relative}.message-row.user.jsx-6ea9efc591bda3e9 .bubble.jsx-6ea9efc591bda3e9{color:var(--neon-cyan);background:#00f3ff1a;border:1px solid #00f3ff4d;border-bottom-right-radius:2px;box-shadow:0 0 15px #00f3ff0d}.message-row.agent.jsx-6ea9efc591bda3e9 .bubble.jsx-6ea9efc591bda3e9{color:#fff;background:#0009;border:1px solid #ffffff1a;border-bottom-left-radius:2px}.message-row.system.jsx-6ea9efc591bda3e9 .bubble.jsx-6ea9efc591bda3e9{color:#f44;background:#ff00001a;border:1px solid #f003;font-size:.85rem}.empty-state.jsx-6ea9efc591bda3e9{color:#555;text-align:center;flex-direction:column;justify-content:center;align-items:center;height:100%;display:flex}.empty-state.jsx-6ea9efc591bda3e9 .icon.jsx-6ea9efc591bda3e9{opacity:.3;filter:grayscale();margin-bottom:15px;font-size:3rem}.empty-state.jsx-6ea9efc591bda3e9 h3.jsx-6ea9efc591bda3e9{color:#666;text-transform:uppercase;letter-spacing:2px;font-size:.9rem;font-family:var(--font-mono);margin:0 0 5px}.input-wrapper.jsx-6ea9efc591bda3e9{background:#0006;border-top:1px solid #ffffff14;padding:20px}.input-box.jsx-6ea9efc591bda3e9{background:#0009;border:1px solid #ffffff1a;border-radius:4px;padding:5px;transition:all .2s;display:flex}.input-box.jsx-6ea9efc591bda3e9:focus-within{border-color:var(--neon-cyan);box-shadow:0 0 15px #00f3ff1a}input.jsx-6ea9efc591bda3e9{color:#fff;font-size:1rem;font-family:var(--font-mono);background:0 0;border:none;outline:none;flex:1;padding:12px 20px}input.jsx-6ea9efc591bda3e9::placeholder{color:#444;font-style:italic}button.jsx-6ea9efc591bda3e9{cursor:pointer;width:45px;height:45px;color:var(--neon-cyan);background:#00f3ff1a;border:1px solid #00f3ff33;border-radius:2px;justify-content:center;align-items:center;transition:all .2s;display:flex}button.jsx-6ea9efc591bda3e9:hover:not(:disabled){background:#00f3ff33;box-shadow:0 0 10px #00f3ff33}button.jsx-6ea9efc591bda3e9:disabled{color:#444;cursor:not-allowed;background:0 0;border-color:#333}button.jsx-6ea9efc591bda3e9 svg.jsx-6ea9efc591bda3e9{width:20px;height:20px}.loading-bubble.jsx-6ea9efc591bda3e9{gap:6px;padding:15px 20px;display:flex}.dot.jsx-6ea9efc591bda3e9{background:var(--neon-cyan);border-radius:50%;width:4px;height:4px;animation:1s ease-in-out infinite alternate pulse}.dot.jsx-6ea9efc591bda3e9:first-child{animation-delay:0s}.dot.jsx-6ea9efc591bda3e9:nth-child(2){animation-delay:.2s}.dot.jsx-6ea9efc591bda3e9:nth-child(3){animation-delay:.4s}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/components/Chat.js",
        lineNumber: 52,
        columnNumber: 10
    }, this);
}
_s(Chat, "tp+qg3R9Ol8xRGXK262OYGeZzE8=");
_c = Chat;
var _c;
__turbopack_context__.k.register(_c, "Chat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/frontend/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__ = __turbopack_context__.i("[project]/frontend/node_modules/ethers/lib.esm/ethers.js [app-client] (ecmascript) <export * as ethers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$Chat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/components/Chat.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function Home() {
    _s();
    const [walletAddress, setWalletAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [agent, setAgent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Constants
    const BACKEND_URL = 'http://localhost:3001';
    // Mock Agent Data for Prototype
    const MOCK_AGENT = {
        id: 1,
        innovationScore: 42,
        memoryCount: 1337,
        name: "Cencera Prime"
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            checkConnection();
        }
    }["Home.useEffect"], []);
    const checkConnection = async ()=>{
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0].address);
                    fetchAgentData(1);
                }
            } catch (error) {
                console.error("Connection check failed", error);
            }
        }
    };
    const connectWallet = async ()=>{
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider_0 = new __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$ethers$2f$lib$2e$esm$2f$ethers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ethers$3e$__["ethers"].BrowserProvider(window.ethereum);
                await provider_0.send("eth_requestAccounts", []);
                const signer = await provider_0.getSigner();
                setWalletAddress(await signer.getAddress());
                fetchAgentData(1);
            } catch (error_0) {
                console.error("Connection failed", error_0);
                alert("Failed to connect wallet.");
            }
        } else {
            alert("Please install MetaMask!");
        }
    };
    const disconnectWallet = ()=>{
        setWalletAddress('');
        setAgent(null);
    };
    const fetchAgentData = async (agentId)=>{
        setLoading(true);
        // Simulating blockchain fetch
        setTimeout(()=>{
            setAgent(MOCK_AGENT);
            setLoading(false);
        }, 800);
    };
    const handleSendMessage = async (message)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${BACKEND_URL}/chat`, {
                message,
                agentId: agent.id,
                walletAddress
            });
            return response.data.reply;
        } catch (error_1) {
            console.error("API Error:", error_1);
            throw error_1;
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "jsx-4c1c3350fd63bf81" + " " + "main-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-4c1c3350fd63bf81" + " " + "navbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-4c1c3350fd63bf81" + " " + "logo-container glow-text",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/logo.png",
                                alt: "Cencera",
                                width: 32,
                                height: 32,
                                className: "logo-img"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/page.js",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "jsx-4c1c3350fd63bf81" + " " + "logo-text",
                                children: "CENCERA"
                            }, void 0, false, {
                                fileName: "[project]/frontend/app/page.js",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/page.js",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-4c1c3350fd63bf81" + " " + "wallet-container",
                        children: walletAddress ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-4c1c3350fd63bf81" + " " + "wallet-connected",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-4c1c3350fd63bf81" + " " + "wallet-badge",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-4c1c3350fd63bf81" + " " + "dot"
                                        }, void 0, false, {
                                            fileName: "[project]/frontend/app/page.js",
                                            lineNumber: 92,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-4c1c3350fd63bf81" + " " + "address",
                                            children: [
                                                walletAddress.slice(0, 6),
                                                "...",
                                                walletAddress.slice(-4)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/page.js",
                                            lineNumber: 93,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/frontend/app/page.js",
                                    lineNumber: 91,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: disconnectWallet,
                                    title: "Disconnect Wallet",
                                    className: "jsx-4c1c3350fd63bf81" + " " + "disconnect-btn",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        className: "jsx-4c1c3350fd63bf81",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M18.36 6.64a9 9 0 1 1-12.73 0",
                                                className: "jsx-4c1c3350fd63bf81"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 99,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "12",
                                                y1: "2",
                                                x2: "12",
                                                y2: "12",
                                                className: "jsx-4c1c3350fd63bf81"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 100,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 98,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.js",
                                    lineNumber: 97,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/page.js",
                            lineNumber: 90,
                            columnNumber: 28
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: connectWallet,
                            className: "jsx-4c1c3350fd63bf81" + " " + "connect-btn",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-4c1c3350fd63bf81",
                                    children: "INITIALIZE LINK"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.js",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-4c1c3350fd63bf81" + " " + "btn-glow"
                                }, void 0, false, {
                                    fileName: "[project]/frontend/app/page.js",
                                    lineNumber: 105,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/frontend/app/page.js",
                            lineNumber: 103,
                            columnNumber: 22
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/page.js",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/page.js",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-4c1c3350fd63bf81" + " " + "content-wrapper",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-4c1c3350fd63bf81" + " " + "glass-card agent-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-4c1c3350fd63bf81" + " " + "panel-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-4c1c3350fd63bf81",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-4c1c3350fd63bf81" + " " + "icon",
                                                children: "◈"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 116,
                                                columnNumber: 17
                                            }, this),
                                            " Identity Matrix"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 116,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-4c1c3350fd63bf81" + " " + `status-indicator ${agent ? 'active' : ''}`,
                                        children: agent ? 'ONLINE' : 'OFFLINE'
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 117,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/page.js",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-4c1c3350fd63bf81" + " " + "loading-state",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-4c1c3350fd63bf81" + " " + "spinner"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 123,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-4c1c3350fd63bf81",
                                        children: "Establishing Neural Handshake..."
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/page.js",
                                lineNumber: 122,
                                columnNumber: 22
                            }, this) : agent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-4c1c3350fd63bf81" + " " + "agent-stats",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-4c1c3350fd63bf81" + " " + "agent-avatar",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-4c1c3350fd63bf81" + " " + "avatar-ring"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-4c1c3350fd63bf81" + " " + "avatar-text",
                                                children: "AI"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-4c1c3350fd63bf81" + " " + "stat-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-4c1c3350fd63bf81" + " " + "stat-item large",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-4c1c3350fd63bf81" + " " + "stat-label",
                                                        children: "Designation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/page.js",
                                                        lineNumber: 133,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-4c1c3350fd63bf81" + " " + "stat-value highlight glow-text",
                                                        children: agent.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/page.js",
                                                        lineNumber: 134,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-4c1c3350fd63bf81" + " " + "stat-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-4c1c3350fd63bf81" + " " + "stat-label",
                                                        children: "Token ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/page.js",
                                                        lineNumber: 138,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-4c1c3350fd63bf81" + " " + "stat-value",
                                                        children: [
                                                            "#",
                                                            agent.id
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/frontend/app/page.js",
                                                        lineNumber: 139,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-4c1c3350fd63bf81" + " " + "stat-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-4c1c3350fd63bf81" + " " + "stat-label",
                                                        children: "Innovation"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/page.js",
                                                        lineNumber: 143,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-4c1c3350fd63bf81" + " " + "stat-value score",
                                                        children: agent.innovationScore
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/page.js",
                                                        lineNumber: 144,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 142,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-4c1c3350fd63bf81" + " " + "stat-item",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-4c1c3350fd63bf81" + " " + "stat-label",
                                                        children: "Memory Blocks"
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/page.js",
                                                        lineNumber: 148,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-4c1c3350fd63bf81" + " " + "stat-value",
                                                        children: agent.memoryCount
                                                    }, void 0, false, {
                                                        fileName: "[project]/frontend/app/page.js",
                                                        lineNumber: 149,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 147,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-4c1c3350fd63bf81" + " " + "contract-info",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-4c1c3350fd63bf81" + " " + "chain-badge",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-4c1c3350fd63bf81" + " " + "bnb-icon",
                                                    children: "❖"
                                                }, void 0, false, {
                                                    fileName: "[project]/frontend/app/page.js",
                                                    lineNumber: 155,
                                                    columnNumber: 19
                                                }, this),
                                                " BNB Testnet"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/frontend/app/page.js",
                                            lineNumber: 154,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/page.js",
                                lineNumber: 125,
                                columnNumber: 30
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-4c1c3350fd63bf81" + " " + "empty-state",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-4c1c3350fd63bf81" + " " + "lock-icon",
                                        children: "🔒"
                                    }, void 0, false, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-4c1c3350fd63bf81",
                                        children: [
                                            "Connect wallet to access your",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                className: "jsx-4c1c3350fd63bf81"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 160,
                                                columnNumber: 47
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "jsx-4c1c3350fd63bf81",
                                                children: "Immortal Agent"
                                            }, void 0, false, {
                                                fileName: "[project]/frontend/app/page.js",
                                                lineNumber: 160,
                                                columnNumber: 53
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/frontend/app/page.js",
                                        lineNumber: 160,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/frontend/app/page.js",
                                lineNumber: 158,
                                columnNumber: 22
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/frontend/app/page.js",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-4c1c3350fd63bf81" + " " + "glass-card chat-panel",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$components$2f$Chat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            agentId: agent?.id,
                            walletAddress: walletAddress,
                            onSendMessage: handleSendMessage
                        }, void 0, false, {
                            fileName: "[project]/frontend/app/page.js",
                            lineNumber: 166,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/frontend/app/page.js",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/frontend/app/page.js",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "4c1c3350fd63bf81",
                children: '.main-container.jsx-4c1c3350fd63bf81{flex-direction:column;max-width:1600px;height:100vh;margin:0 auto;padding:0 40px;display:flex}.navbar.jsx-4c1c3350fd63bf81{justify-content:space-between;align-items:center;height:100px;padding:0;display:flex}.logo-container.jsx-4c1c3350fd63bf81{cursor:default;align-items:center;gap:15px;display:flex}.logo-text.jsx-4c1c3350fd63bf81{font-family:var(--font-mono);letter-spacing:4px;color:#fff;margin:0;font-size:1.8rem;font-weight:700}.wallet-connected.jsx-4c1c3350fd63bf81{align-items:center;gap:12px;display:flex}.wallet-badge.jsx-4c1c3350fd63bf81{border:1px solid var(--neon-cyan);font-family:var(--font-mono);background:#0006;border-radius:4px;align-items:center;gap:12px;padding:10px 20px;display:flex;box-shadow:0 0 10px #00f3ff1a}.dot.jsx-4c1c3350fd63bf81{background:var(--neon-cyan);width:8px;height:8px;box-shadow:0 0 8px var(--neon-cyan);border-radius:50%;animation:2s infinite pulse}.address.jsx-4c1c3350fd63bf81{color:var(--neon-cyan);letter-spacing:1px;font-weight:600}.disconnect-btn.jsx-4c1c3350fd63bf81{cursor:pointer;color:#f44;background:#ff32321a;border:1px solid #ff32324d;border-radius:4px;justify-content:center;align-items:center;width:42px;height:42px;transition:all .2s;display:flex}.disconnect-btn.jsx-4c1c3350fd63bf81:hover{background:#ff323233;border-color:#f44;box-shadow:0 0 10px #ff323233}.disconnect-btn.jsx-4c1c3350fd63bf81 svg.jsx-4c1c3350fd63bf81{width:20px;height:20px}.connect-btn.jsx-4c1c3350fd63bf81{color:var(--neon-cyan);border:1px solid var(--neon-cyan);font-family:var(--font-mono);letter-spacing:2px;cursor:pointer;text-transform:uppercase;background:0 0;padding:12px 32px;font-weight:700;transition:all .3s;position:relative;overflow:hidden}.connect-btn.jsx-4c1c3350fd63bf81:hover{text-shadow:0 0 8px var(--neon-cyan);background:#00f3ff1a;box-shadow:0 0 20px #00f3ff33}.content-wrapper.jsx-4c1c3350fd63bf81{flex:1;gap:40px;margin-top:20px;margin-bottom:60px;display:flex}.glass-card.jsx-4c1c3350fd63bf81{background:var(--glass-bg);border:var(--glass-border);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);box-shadow:var(--card-shadow);border-radius:12px;flex-direction:column;padding:40px;display:flex}.agent-panel.jsx-4c1c3350fd63bf81{flex:1;min-width:350px;max-width:450px}.panel-header.jsx-4c1c3350fd63bf81{border-bottom:1px solid #ffffff1a;justify-content:space-between;align-items:center;margin-bottom:40px;padding-bottom:20px;display:flex}.panel-header.jsx-4c1c3350fd63bf81 h2.jsx-4c1c3350fd63bf81{color:#888;text-transform:uppercase;letter-spacing:2px;align-items:center;gap:10px;margin:0;font-size:1.2rem;display:flex}.panel-header.jsx-4c1c3350fd63bf81 .icon.jsx-4c1c3350fd63bf81{color:var(--neon-purple)}.status-indicator.jsx-4c1c3350fd63bf81{color:#666;font-size:.8rem;font-family:var(--font-mono);background:#282828cc;border:1px solid #ffffff0d;border-radius:2px;padding:6px 12px}.status-indicator.active.jsx-4c1c3350fd63bf81{color:var(--neon-green);background:#0aff681a;border-color:#0aff684d;box-shadow:0 0 10px #0aff681a}.agent-stats.jsx-4c1c3350fd63bf81{flex-direction:column;gap:30px;display:flex}.agent-avatar.jsx-4c1c3350fd63bf81{border:1px solid var(--neon-purple);background:#0000004d;border-radius:50%;justify-content:center;align-self:center;align-items:center;width:120px;height:120px;display:flex;position:relative;box-shadow:0 0 30px #bc13fe33}.avatar-ring.jsx-4c1c3350fd63bf81{border:1px dashed #bc13fe4d;border-radius:50%;width:140%;height:140%;animation:20s linear infinite spin;position:absolute}.avatar-text.jsx-4c1c3350fd63bf81{color:var(--neon-purple);font-size:2rem;font-weight:800}.stat-grid.jsx-4c1c3350fd63bf81{grid-template-columns:1fr 1fr;gap:15px;display:grid}.stat-item.jsx-4c1c3350fd63bf81{background:#ffffff05;border:1px solid #ffffff0d;border-radius:8px;padding:15px}.stat-item.large.jsx-4c1c3350fd63bf81{text-align:center;border-left:2px solid var(--neon-cyan);background:linear-gradient(90deg,#00f3ff0d 0%,#0000 100%);grid-column:span 2}.stat-label.jsx-4c1c3350fd63bf81{color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-size:.75rem;display:block}.stat-value.jsx-4c1c3350fd63bf81{font-family:var(--font-mono);color:#fff;font-size:1.1rem}.stat-value.highlight.jsx-4c1c3350fd63bf81{color:var(--neon-cyan);font-size:1.4rem}.contract-info.jsx-4c1c3350fd63bf81{text-align:center;margin-top:auto;padding-top:20px}.chain-badge.jsx-4c1c3350fd63bf81{color:#f3ba2f;background:#1a1a1a;border-radius:20px;align-items:center;gap:8px;padding:8px 16px;font-size:.85rem;font-weight:600;display:inline-flex}.empty-state.jsx-4c1c3350fd63bf81{text-align:center;color:#555;flex-direction:column;flex:1;justify-content:center;align-items:center;gap:20px;display:flex}.lock-icon.jsx-4c1c3350fd63bf81{opacity:.3;font-size:3rem}.loading-state.jsx-4c1c3350fd63bf81{color:var(--neon-cyan);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:20px;display:flex}.spinner.jsx-4c1c3350fd63bf81{border:3px solid #00f3ff1a;border-top-color:var(--neon-cyan);border-radius:50%;width:40px;height:40px;animation:1s linear infinite spin}.chat-panel.jsx-4c1c3350fd63bf81{flex:2;padding:0;position:relative;overflow:hidden}.chat-panel.jsx-4c1c3350fd63bf81:before{content:"";pointer-events:none;z-index:10;border-radius:12px;position:absolute;inset:0;box-shadow:inset 0 0 50px #00000080}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%{opacity:.4}50%{opacity:1}to{opacity:.4}}@media (width<=968px){.content-wrapper.jsx-4c1c3350fd63bf81{flex-direction:column}.agent-panel.jsx-4c1c3350fd63bf81{max-width:100%}.main-container.jsx-4c1c3350fd63bf81{height:auto;padding:0 20px}.navbar.jsx-4c1c3350fd63bf81{height:80px}}'
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/frontend/app/page.js",
        lineNumber: 81,
        columnNumber: 10
    }, this);
}
_s(Home, "VeFvmZp0wwbKQ9oV/DhhSZvUf2g=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=frontend_app_dc23e153._.js.map