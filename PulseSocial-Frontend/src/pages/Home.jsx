import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import StoriesBar from "../components/StoriesBar";
import { getAllPosts, createPost, uploadPostImage } from "../services/postService";
import { getCurrentUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Home() {
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        loadUser();
        loadPosts();
    }, [navigate]);

    const loadUser = async () => {
        try {
            const response = await getCurrentUser();
            setCurrentUser(response.data);
        } catch (err) {
            console.error("Failed to load user profile:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("token");
                navigate("/");
            }
        }
    };

    const loadPosts = async () => {
        try {
            const response = await getAllPosts();
            setPosts(response.data || []);
        } catch (err) {
            console.error("Failed to load posts:", err);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!content.trim() && !file) return;

        setPosting(true);
        setError("");

        try {
            let imageUrl = "";
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const uploadRes = await uploadPostImage(formData);
                imageUrl = uploadRes.data;
            }

            await createPost({
                content,
                imageUrl,
                userId: currentUser?.id
            });

            setContent("");
            setFile(null);
            loadPosts();
        } catch (err) {
            console.error("Post creation error:", err);
            setError("Failed to create post. Please try again.");
        } finally {
            setPosting(false);
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
                    {/* Top Profile Card Banner */}
                    <div className="top-profile-card" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
                        {currentUser?.profileImage ? (
                            <img
                                src={getImageUrl(currentUser.profileImage)}
                                alt={currentUser.fullName || "User"}
                                className="home-top-avatar"
                            />
                        ) : (
                            <div className="home-top-avatar-placeholder">
                                {(currentUser?.fullName || currentUser?.username || "U")[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h3 className="top-user-name">
                                Welcome back, {currentUser?.fullName || currentUser?.username || "User"}!
                            </h3>
                            <p className="top-user-username">@{currentUser?.username || "username"}</p>
                        </div>
                    </div>

                    {/* Stories Bar */}
                    <StoriesBar currentUser={currentUser} />

                    <div className="create-post-card">
                        <h3>What's on your mind?</h3>
                        {error && <div className="auth-error">{error}</div>}
                        <form onSubmit={handleCreatePost}>
                            <div className="form-group">
                                <textarea
                                    rows="3"
                                    placeholder="Share an update with Blitzor..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={posting || (!content.trim() && !file)}
                                className="btn-primary"
                            >
                                {posting ? "Posting..." : "Share Post"}
                            </button>
                        </form>
                    </div>

                    <h2>Blitzor Feed</h2>

                    {posts.length === 0 ? (
                        <p style={{ marginTop: "20px", color: "var(--text-muted)", textAlign: "center" }}>
                            No posts yet. Be the first to share something!
                        </p>
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post.id} post={post} currentUser={currentUser} />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default Home;