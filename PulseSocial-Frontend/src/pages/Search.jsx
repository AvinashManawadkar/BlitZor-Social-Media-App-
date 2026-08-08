import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { getCurrentUser } from "../services/userService";
import { searchUsers, searchPosts } from "../services/searchService";
import { followUser } from "../services/followService";
import { useNavigate } from "react-router-dom";

function Search() {
    const [currentUser, setCurrentUser] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [activeTab, setActiveTab] = useState("users");
    const [userResults, setUserResults] = useState([]);
    const [postResults, setPostResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const res = await getCurrentUser();
            setCurrentUser(res.data);
        } catch (err) {
            console.error("Auth error:", err);
        }
    };

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!keyword.trim()) return;

        setLoading(true);
        try {
            if (activeTab === "users") {
                const res = await searchUsers(keyword);
                setUserResults(res.data || []);
            } else {
                const res = await searchPosts(keyword);
                setPostResults(res.data || []);
            }
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (keyword.trim()) {
            handleSearch();
        }
    }, [activeTab]);

    const handleFollow = async (userId) => {
        try {
            await followUser(userId, currentUser?.id);
            handleSearch();
        } catch (err) {
            console.error("Follow toggle error:", err);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        return `http://localhost:8080${url}`;
    };

    return (
        <div className="app-layout">
            <Sidebar currentUser={currentUser} />

            <main className="main-content-area">
                <div className="feed-container">
                    <h2>Search Blitzor</h2>

                    <form onSubmit={handleSearch} style={{ marginTop: "16px", marginBottom: "20px" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="text"
                                placeholder="Search by keyword, name, username..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    border: "1px solid var(--card-border)",
                                    background: "rgba(15, 23, 42, 0.6)",
                                    color: "#fff"
                                }}
                            />
                            <button type="submit" className="btn-primary" style={{ width: "auto" }}>
                                🔍 Search
                            </button>
                        </div>
                    </form>

                    {/* Tabs */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                        <button
                            className={`nav-btn ${activeTab === "users" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("users")}
                        >
                            👥 Users ({userResults.length})
                        </button>
                        <button
                            className={`nav-btn ${activeTab === "posts" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("posts")}
                        >
                            📝 Posts ({postResults.length})
                        </button>
                    </div>

                    {loading && <p style={{ textAlign: "center" }}>Searching...</p>}

                    {!loading && activeTab === "users" && (
                        <div>
                            {userResults.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
                                    {keyword ? "No users found matching your query." : "Type a keyword above to search for people."}
                                </p>
                            ) : (
                                userResults.map((user) => (
                                    <div key={user.id} className="user-result-card">
                                        <div
                                            style={{ display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}
                                            onClick={() => navigate(`/profile/${user.id}`)}
                                        >
                                            {user.profileImage ? (
                                                <img
                                                    src={getImageUrl(user.profileImage)}
                                                    alt={user.fullName}
                                                    style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div className="profile-avatar-placeholder" style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                                                    {(user.fullName || user.username || "U")[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: "600" }}>{user.fullName}</div>
                                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>@{user.username}</div>
                                                {user.bio && <div style={{ fontSize: "0.85rem", marginTop: "4px" }}>{user.bio}</div>}
                                            </div>
                                        </div>

                                        <button
                                            className="nav-btn"
                                            onClick={() => navigate(`/profile/${user.id}`)}
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {!loading && activeTab === "posts" && (
                        <div>
                            {postResults.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
                                    {keyword ? "No posts found matching your query." : "Type a keyword above to search for posts."}
                                </p>
                            ) : (
                                postResults.map((post) => (
                                    <PostCard key={post.id} post={post} currentUser={currentUser} />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Search;

