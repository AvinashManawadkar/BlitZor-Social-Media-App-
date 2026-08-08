import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getCurrentUser } from "../services/userService";
import { getNotifications } from "../services/notificationService";
import { useNavigate } from "react-router-dom";

function Notifications() {
    const [currentUser, setCurrentUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const userRes = await getCurrentUser();
            const user = userRes.data;
            setCurrentUser(user);

            const notifRes = await getNotifications(user.id);
            setNotifications(notifRes.data || []);
        } catch (err) {
            console.error("Notifications load error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChat = (notif) => {
        if (notif.actorId) {
            navigate("/messages", {
                state: {
                    targetUser: {
                        id: notif.actorId,
                        fullName: notif.senderName || notif.senderUsername || "User",
                        username: notif.senderUsername || "user"
                    }
                }
            });
        } else {
            navigate("/messages");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="app-layout">
            <Sidebar currentUser={currentUser} />

            <main className="main-content-area">
                <div className="feed-container">
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                        <button className="back-btn" onClick={() => navigate(-1)} title="Go Back">
                            ← Back
                        </button>
                        <div>
                            <h2 style={{ margin: 0 }}>🔔 Activity Notifications</h2>
                            <p style={{ color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                                Recent interactions, message alerts, and updates.
                            </p>
                        </div>
                    </div>


                    {loading ? (
                        <p style={{ textAlign: "center" }}>Loading notifications...</p>
                    ) : notifications.length === 0 ? (
                        <div className="create-post-card" style={{ textAlign: "center" }}>
                            <p style={{ color: "var(--text-muted)" }}>No notifications yet.</p>
                        </div>
                    ) : (
                        notifications.map((notif) => {
                            const isMessageNotif = notif.message && notif.message.toLowerCase().includes("message");
                            const getImageUrl = (url) => {
                                if (!url) return null;
                                if (url.startsWith("http://") || url.startsWith("https://")) return url;
                                return `http://localhost:8080${url}`;
                            };

                            return (
                                <div key={notif.id} className="notification-card">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, paddingRight: "12px" }}>
                                            {notif.senderAvatar ? (
                                                <img
                                                    src={getImageUrl(notif.senderAvatar)}
                                                    alt={notif.senderName || "Sender"}
                                                    style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div className="profile-avatar-placeholder" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>
                                                    {(notif.senderName || notif.senderUsername || "N")[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ color: "#f8fafc", fontSize: "0.95rem" }}>{notif.message}</div>
                                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                                    {formatDate(notif.createdAt)}
                                                </div>
                                            </div>
                                        </div>

                                        {isMessageNotif && (
                                            <button
                                                className="btn-primary"
                                                style={{ width: "auto", padding: "6px 14px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                                                onClick={() => handleOpenChat(notif)}
                                            >
                                                Chat Now 💬
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })

                    )}
                </div>
            </main>
        </div>
    );
}

export default Notifications;

