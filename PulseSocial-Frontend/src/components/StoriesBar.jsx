import React, { useEffect, useState } from "react";
import { getAllStories, createStory, deleteStory } from "../services/storyService";
import { uploadPostImage } from "../services/postService";
import { useNavigate } from "react-router-dom";

function StoriesBar({ currentUser }) {
    const [stories, setStories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [storyFile, setStoryFile] = useState(null);
    const [caption, setCaption] = useState("");
    const [uploading, setUploading] = useState(false);

    // Active Story Viewer State
    const [activeStoryIndex, setActiveStoryIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        try {
            const res = await getAllStories();
            const rawStories = res.data || [];
            const now = Date.now();
            const validStories = rawStories.filter(story => {
                if (!story.createdAt) return true;
                const createdTime = new Date(story.createdAt).getTime();
                return (now - createdTime) < (24 * 60 * 60 * 1000);
            });
            setStories(validStories);
        } catch (err) {
            console.error("Error loading stories:", err);
        }
    };

    const handleCreateStory = async (e) => {
        e.preventDefault();
        if (!storyFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", storyFile);
            const uploadRes = await uploadPostImage(formData);
            const imageUrl = uploadRes.data;

            await createStory({
                imageUrl,
                caption
            });

            setShowAddModal(false);
            setStoryFile(null);
            setCaption("");
            loadStories();
        } catch (err) {
            console.error("Failed to add story:", err);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCurrentStory = async (storyId) => {
        if (window.confirm("Are you sure you want to delete this story?")) {
            try {
                await deleteStory(storyId);
                setActiveStoryIndex(null);
                loadStories();
            } catch (err) {
                console.error("Failed to delete story:", err);
            }
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        return `http://localhost:8080${url}`;
    };

    const getTimeRemaining = (createdAt) => {
        if (!createdAt) return "";
        const created = new Date(createdAt).getTime();
        const expires = created + (24 * 60 * 60 * 1000);
        const now = Date.now();
        const diffMs = expires - now;

        if (diffMs <= 0) return "Expired";
        const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
        const minsLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (hoursLeft > 0) return `${hoursLeft}h left`;
        return `${minsLeft}m left`;
    };

    const currentStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

    return (
        <div className="stories-bar-container">
            <div className="stories-scroll">
                {/* Add Story Circle */}
                <div className="story-circle-wrapper" onClick={() => setShowAddModal(true)}>
                    <div className="story-ring add-story-ring">
                        {currentUser?.profileImage ? (
                            <img
                                src={getImageUrl(currentUser.profileImage)}
                                alt="Your Avatar"
                                className="story-avatar"
                            />
                        ) : (
                            <div className="story-avatar-placeholder">
                                {(currentUser?.fullName || currentUser?.username || "U")[0].toUpperCase()}
                            </div>
                        )}
                        <span className="add-story-plus">+</span>
                    </div>
                    <span className="story-username">Your Story</span>
                </div>

                {/* Other Active Stories */}
                {stories.map((story, index) => (
                    <div
                        key={story.id}
                        className="story-circle-wrapper"
                        onClick={() => setActiveStoryIndex(index)}
                    >
                        <div className="story-ring active-story-ring">
                            {story.profileImage ? (
                                <img
                                    src={getImageUrl(story.profileImage)}
                                    alt={story.fullName}
                                    className="story-avatar"
                                />
                            ) : (
                                <div className="story-avatar-placeholder">
                                    {(story.fullName || story.username || "U")[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="story-username">@{story.username || "user"}</span>
                    </div>
                ))}
            </div>

            {/* Add Story Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3>📸 Add to Your Story</h3>
                            <button className="nav-btn" onClick={() => setShowAddModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleCreateStory}>
                            <div className="form-group">
                                <label>Choose Story Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setStoryFile(e.target.files[0])}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Caption (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Add a caption..."
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                />
                            </div>

                            <div className="modal-buttons">
                                <button type="button" className="nav-btn" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={uploading || !storyFile}>
                                    {uploading ? "Sharing Story..." : "Share Story"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Story Viewer Modal */}
            {currentStory && (
                <div className="modal-overlay story-viewer-overlay">
                    <div className="story-viewer-content">
                        <div className="story-viewer-header">
                            <div
                                style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                                onClick={() => {
                                    setActiveStoryIndex(null);
                                    navigate(`/profile/${currentStory.userId}`);
                                }}
                            >
                                {currentStory.profileImage ? (
                                    <img
                                        src={getImageUrl(currentStory.profileImage)}
                                        alt={currentStory.fullName}
                                        style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div className="profile-avatar-placeholder" style={{ width: "36px", height: "36px", fontSize: "1rem" }}>
                                        {(currentStory.fullName || currentStory.username || "U")[0].toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>{currentStory.fullName}</span>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "6px" }}>@{currentStory.username}</span>
                                    {currentStory.createdAt && (
                                        <span className="story-expiry-badge" style={{ marginLeft: "8px", fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc", padding: "2px 6px", borderRadius: "10px" }}>
                                            ⏱️ {getTimeRemaining(currentStory.createdAt)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                {currentUser && currentUser.username === currentStory.username && (
                                    <button
                                        onClick={() => handleDeleteCurrentStory(currentStory.id)}
                                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1.1rem" }}
                                        title="Delete Story"
                                    >
                                        🗑️
                                    </button>
                                )}
                                <button className="nav-btn" onClick={() => setActiveStoryIndex(null)}>✕</button>
                            </div>
                        </div>

                        <div className="story-viewer-image-wrapper">
                            <img
                                src={getImageUrl(currentStory.imageUrl)}
                                alt="Story"
                                className="story-viewer-image"
                            />
                            {currentStory.caption && (
                                <div className="story-viewer-caption">
                                    <p>{currentStory.caption}</p>
                                </div>
                            )}
                        </div>

                        <div className="story-viewer-controls">
                            <button
                                className="nav-btn"
                                disabled={activeStoryIndex === 0}
                                onClick={() => setActiveStoryIndex(activeStoryIndex - 1)}
                            >
                                ◀ Previous
                            </button>

                            <button
                                className="nav-btn"
                                disabled={activeStoryIndex === stories.length - 1}
                                onClick={() => setActiveStoryIndex(activeStoryIndex + 1)}
                            >
                                Next ▶
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StoriesBar;

