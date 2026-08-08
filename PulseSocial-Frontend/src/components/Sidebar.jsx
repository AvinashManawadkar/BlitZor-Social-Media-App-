import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getNotifications } from "../services/notificationService";
import { getImageUrl } from "../utils/imageUrl";

function Sidebar({ currentUser }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!currentUser?.id) return;

        loadUnreadCount();
        const interval = setInterval(loadUnreadCount, 5000);
        return () => clearInterval(interval);
    }, [currentUser?.id]);

    const loadUnreadCount = async () => {
        try {
            if (!currentUser?.id) return;
            const res = await getNotifications(currentUser.id);
            const notifs = res.data || [];
            const unread = notifs.filter(n => !n.read).length;
            setUnreadCount(unread > 0 ? unread : notifs.length > 0 ? notifs.length : 0);
        } catch (err) {
            // silent polling error
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const isActive = (path) => {
        if (path === "/profile") {
            return location.pathname.startsWith("/profile");
        }
        return location.pathname === path;
    };


    const navItems = [
        { path: "/home", label: "Home", icon: "🏠" },
        { path: "/search", label: "Search", icon: "🔍" },
        { path: "/bookmarks", label: "Bookmarks", icon: "🔖" },
        { path: "/notifications", label: "Notifications", icon: "🔔", isNotification: true },
        { path: "/messages", label: "Messages", icon: "💬" },
        { path: "/profile", label: "Profile", icon: "👤", isProfile: true },
        { path: "/settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <aside className="sidebar-container">
            <div className="sidebar-header" onClick={() => navigate("/home")}>
                <img src="/blitzor-logo.png" alt="Blitzor Logo" className="sidebar-logo" />
                <h2 className="sidebar-title">Blitzor</h2>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    if (item.isProfile) {
                        return (
                            <button
                                key={item.path}
                                className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
                                onClick={() => navigate("/profile")}
                            >
                                <span className="sidebar-icon">
                                    {currentUser?.profileImage ? (
                                        <img
                                            src={getImageUrl(currentUser.profileImage)}
                                            alt={currentUser.fullName || "Profile"}
                                            className="sidebar-avatar"
                                        />
                                    ) : (
                                        <div className="sidebar-avatar-placeholder">
                                            {(currentUser?.fullName || currentUser?.username || "U")[0].toUpperCase()}
                                        </div>
                                    )}
                                </span>
                                <span className="sidebar-label">Profile</span>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={item.path}
                            className={`sidebar-link ${isActive(item.path) ? "active" : ""}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="sidebar-icon" style={{ position: "relative" }}>
                                {item.icon}
                                {item.isNotification && unreadCount > 0 && (
                                    <span className="notification-badge">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </span>
                            <span className="sidebar-label">
                                {item.label}
                                {item.isNotification && unreadCount > 0 && (
                                    <span className="notification-count-pill">{unreadCount}</span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                {currentUser && (
                    <div className="sidebar-user-info" onClick={() => navigate("/profile")}>
                        {currentUser?.profileImage ? (
                            <img
                                src={getImageUrl(currentUser.profileImage)}
                                alt={currentUser.fullName || "User"}
                                className="sidebar-user-avatar"
                            />
                        ) : (
                            <div className="sidebar-user-avatar-placeholder">
                                {(currentUser?.fullName || currentUser?.username || "U")[0].toUpperCase()}
                            </div>
                        )}
                        <div className="sidebar-user-details">
                            <span className="sidebar-user-name">{currentUser?.fullName || currentUser?.username}</span>
                            <span className="sidebar-user-handle">@{currentUser?.username}</span>
                        </div>
                    </div>
                )}

                <button className="sidebar-logout-btn" onClick={logout} title="Logout">
                    <span className="sidebar-icon">🚪</span>
                    <span className="sidebar-label">Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;

