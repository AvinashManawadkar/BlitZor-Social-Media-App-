import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { getCurrentUser } from "../services/userService";
import { getRecentConversations, getConversation, sendMessage, updateMessage, deleteMessage } from "../services/messageService";
import { searchUsers } from "../services/searchService";
import { useLocation, useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";


function Messages() {
    const [currentUser, setCurrentUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [sending, setSending] = useState(false);

    // Edit Message State
    const [editingMsgId, setEditingMsgId] = useState(null);
    const [editText, setEditText] = useState("");

    // User Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    useEffect(() => {
        loadData();
        const convInterval = setInterval(() => {
            loadRecentConvsSilently();
        }, 4000);
        return () => clearInterval(convInterval);
    }, []);

    useEffect(() => {
        if (selectedUser?.id) {
            loadConversation(selectedUser.id);
            const msgInterval = setInterval(() => {
                loadConversationSilently(selectedUser.id);
            }, 3000);
            return () => clearInterval(msgInterval);
        }
    }, [selectedUser?.id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadData = async () => {
        try {
            const userRes = await getCurrentUser();
            const user = userRes.data;
            setCurrentUser(user);

            const convRes = await getRecentConversations();
            const convs = convRes.data || [];
            setConversations(convs);

            if (location.state?.targetUser) {
                const target = location.state.targetUser;
                setSelectedUser(target);
                const existing = convs.find(c => String(c.userId) === String(target.id));
                if (!existing) {
                    setConversations([{
                        userId: target.id,
                        fullName: target.fullName,
                        username: target.username,
                        profileImage: target.profileImage,
                        lastMessage: "Start a conversation..."
                    }, ...convs]);
                }
            } else if (convs.length > 0 && !selectedUser) {
                setSelectedUser({
                    id: convs[0].userId,
                    fullName: convs[0].fullName,
                    username: convs[0].username,
                    profileImage: convs[0].profileImage
                });
            }
        } catch (err) {
            console.error("Error loading chat data:", err);
        }
    };

    const loadRecentConvsSilently = async () => {
        try {
            const convRes = await getRecentConversations();
            setConversations(convRes.data || []);
        } catch (err) {
            // silent
        }
    };

    const loadConversation = async (otherUserId) => {
        try {
            const res = await getConversation(otherUserId);
            setMessages(res.data || []);
        } catch (err) {
            console.error("Error fetching conversation:", err);
        }
    };

    const loadConversationSilently = async (otherUserId) => {
        try {
            const res = await getConversation(otherUserId);
            setMessages(res.data || []);
        } catch (err) {
            // silent
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedUser) return;

        setSending(true);
        try {
            await sendMessage({
                receiverId: selectedUser.id,
                content: messageText
            });
            setMessageText("");
            loadConversation(selectedUser.id);
            loadRecentConvsSilently();
        } catch (err) {
            console.error("Send message error:", err);
        } finally {
            setSending(false);
        }
    };

    const handleStartEdit = (msg) => {
        setEditingMsgId(msg.id);
        setEditText(msg.content);
    };

    const handleUpdateMessage = async (msgId) => {
        if (!editText.trim()) return;
        try {
            await updateMessage(msgId, editText);
            setEditingMsgId(null);
            setEditText("");
            loadConversation(selectedUser.id);
        } catch (err) {
            console.error("Edit message error:", err);
        }
    };

    const handleDeleteMessage = async (msgId) => {
        if (window.confirm("Delete this message?")) {
            try {
                await deleteMessage(msgId);
                loadConversation(selectedUser.id);
            } catch (err) {
                console.error("Delete message error:", err);
            }
        }
    };

    const handleUserSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const res = await searchUsers(query);
            const users = (res.data || []).filter(u => String(u.id) !== String(currentUser?.id));
            setSearchResults(users);
        } catch (err) {
            console.error("User search error:", err);
        }
    };

    const selectContact = (user) => {
        setSelectedUser({
            id: user.id || user.userId,
            fullName: user.fullName,
            username: user.username,
            profileImage: user.profileImage
        });
        setSearchQuery("");
        setSearchResults([]);

        const existing = conversations.find(c => String(c.userId) === String(user.id));
        if (!existing) {
            setConversations([{
                userId: user.id,
                fullName: user.fullName,
                username: user.username,
                profileImage: user.profileImage,
                lastMessage: "Start a conversation..."
            }, ...conversations]);
        }
    };



    return (
        <div className="app-layout">
            <Sidebar currentUser={currentUser} />

            <main className="main-content-area">
                <div className="feed-container" style={{ maxWidth: "980px" }}>
                    <div className="chat-layout">

                    {/* Conversations Sidebar */}
                    <div className="chat-sidebar">
                        <h3 style={{ marginBottom: "16px" }}>💬 Messages</h3>

                        {/* Search Contact Input */}
                        <div className="form-group" style={{ marginBottom: "16px" }}>
                            <input
                                type="text"
                                placeholder="Search people to chat..."
                                value={searchQuery}
                                onChange={handleUserSearch}
                                style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="search-dropdown">
                                {searchResults.map(u => (
                                    <div
                                        key={u.id}
                                        className="chat-contact-item"
                                        onClick={() => selectContact(u)}
                                    >
                                        {u.profileImage ? (
                                            <img src={getImageUrl(u.profileImage)} alt={u.fullName} className="contact-avatar" />
                                        ) : (
                                            <div className="contact-avatar-placeholder">{(u.fullName || "U")[0].toUpperCase()}</div>
                                        )}
                                        <div>
                                            <div className="contact-name">{u.fullName}</div>
                                            <div className="contact-username">@{u.username}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Recent Conversations List */}
                        <div className="conversations-list">
                            {conversations.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginTop: "20px" }}>
                                    No recent messages. Start a conversation!
                                </p>
                            ) : (
                                conversations.map(u => (
                                    <div
                                        key={u.id}
                                        className={`chat-contact-item ${selectedUser?.id === u.id ? "active-contact" : ""}`}
                                        onClick={() => selectContact(u)}
                                    >
                                        {u.profileImage ? (
                                            <img src={getImageUrl(u.profileImage)} alt={u.fullName} className="contact-avatar" />
                                        ) : (
                                            <div className="contact-avatar-placeholder">{(u.fullName || "U")[0].toUpperCase()}</div>
                                        )}
                                        <div>
                                            <div className="contact-name">{u.fullName}</div>
                                            <div className="contact-username">@{u.username}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Main Window */}
                    <div className="chat-window">
                        {selectedUser ? (
                            <>
                                {/* Header */}
                                <div className="chat-header">
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigate(`/profile/${selectedUser.id}`)}>
                                        {selectedUser.profileImage ? (
                                            <img src={getImageUrl(selectedUser.profileImage)} alt={selectedUser.fullName} className="contact-avatar" />
                                        ) : (
                                            <div className="contact-avatar-placeholder">{(selectedUser.fullName || "U")[0].toUpperCase()}</div>
                                        )}
                                        <div>
                                            <h4 style={{ margin: 0 }}>{selectedUser.fullName}</h4>
                                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>@{selectedUser.username}</span>
                                        </div>
                                    </div>
                                    <button className="nav-btn" onClick={() => navigate(`/profile/${selectedUser.id}`)}>
                                        View Profile 👤
                                    </button>
                                </div>

                                {/* Messages History */}
                                <div className="messages-history">
                                    {messages.length === 0 ? (
                                        <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "40px" }}>
                                            Say hello to {selectedUser.fullName}! 👋
                                        </p>
                                    ) : (
                                        messages.map(msg => {
                                            const isMe = String(msg.senderId) === String(currentUser?.id);
                                            const isEditing = editingMsgId === msg.id;

                                            return (
                                                <div key={msg.id} className={`message-row ${isMe ? "sent-row" : "received-row"}`}>
                                                    <div className={`message-bubble ${isMe ? "sent-bubble" : "received-bubble"}`}>
                                                        {isEditing ? (
                                                            <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
                                                                <input
                                                                    type="text"
                                                                    value={editText}
                                                                    onChange={(e) => setEditText(e.target.value)}
                                                                    style={{ padding: "6px", fontSize: "0.9rem", borderRadius: "4px" }}
                                                                />
                                                                <div style={{ display: "flex", gap: "6px" }}>
                                                                    <button className="btn-primary" style={{ padding: "4px 8px", fontSize: "0.8rem" }} onClick={() => handleUpdateMessage(msg.id)}>Save</button>
                                                                    <button className="nav-btn" style={{ padding: "4px 8px", fontSize: "0.8rem" }} onClick={() => setEditingMsgId(null)}>Cancel</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className="message-text">{msg.content}</p>
                                                                {msg.edited && <span style={{ fontSize: "0.7rem", fontStyle: "italic", opacity: 0.8 }}> (edited)</span>}
                                                            </>
                                                        )}

                                                        {/* Shared Post Card Attachment */}
                                                        {msg.sharedPost && (
                                                            <div className="shared-post-preview" onClick={() => navigate(`/home`)}>
                                                                <div className="shared-post-author">
                                                                    📌 Shared Post by <strong>@{msg.sharedPost.username}</strong>
                                                                </div>
                                                                <p className="shared-post-content">{msg.sharedPost.content}</p>
                                                                {msg.sharedPost.imageUrl && (
                                                                    <img
                                                                        src={getImageUrl(msg.sharedPost.imageUrl)}
                                                                        alt="Shared post media"
                                                                        className="shared-post-image"
                                                                    />
                                                                )}
                                                            </div>
                                                        )}

                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                                                            <span className="message-time">
                                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                            </span>

                                                            <div style={{ display: "flex", gap: "6px", marginLeft: "12px" }}>
                                                                {isMe && !isEditing && (
                                                                    <span
                                                                        style={{ cursor: "pointer", fontSize: "0.75rem", opacity: 0.8 }}
                                                                        onClick={() => handleStartEdit(msg)}
                                                                        title="Edit Message"
                                                                    >
                                                                        ✏️
                                                                    </span>
                                                                )}
                                                                <span
                                                                    style={{ cursor: "pointer", fontSize: "0.75rem", opacity: 0.8 }}
                                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                                    title="Delete Message"
                                                                >
                                                                    🗑️
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Send Input Form */}
                                <form onSubmit={handleSend} className="chat-input-form">

                                    <input
                                        type="text"
                                        placeholder={`Message ${selectedUser.fullName}...`}
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    />
                                    <button type="submit" disabled={sending || !messageText.trim()} className="btn-primary" style={{ width: "auto" }}>
                                        Send ✈️
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="empty-chat-state">
                                <h3>💬 Direct Messages</h3>
                                <p style={{ color: "var(--text-muted)" }}>Select a contact from the left or search for someone to start chatting.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </main>
        </div>
    );
}

export default Messages;

