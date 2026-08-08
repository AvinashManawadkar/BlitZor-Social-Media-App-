import React, { useState, useEffect } from "react";
import { toggleLike, getLikeCount } from "../services/likeService";
import { toggleBookmark } from "../services/bookmarkService";
import { getComments, addComment, deleteComment } from "../services/commentService";
import { deletePost } from "../services/postService";
import { sendMessage } from "../services/messageService";
import { searchUsers } from "../services/searchService";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

function PostCard({ post, currentUser, onPostDeleted, onPostUpdated }) {
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [savedCollection, setSavedCollection] = useState(post.collectionName || "Favorites");

    // Collection Modal State
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [customColName, setCustomColName] = useState("");

    // Share Modal State
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareQuery, setShareQuery] = useState("");
    const [shareUsers, setShareUsers] = useState([]);
    const [shareNote, setShareNote] = useState("");
    const [sharedFeedback, setSharedFeedback] = useState("");

    // Comments State
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commenting, setCommenting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (post?.id) {
            fetchLikeCount();
        }
    }, [post?.id]);

    const fetchLikeCount = async () => {
        try {
            const res = await getLikeCount(post.id);
            setLikes(res.data || 0);
        } catch (err) {
            console.error("Error getting likes:", err);
        }
    };

    const loadComments = async () => {
        try {
            const res = await getComments(post.id);
            setComments(res.data || []);
        } catch (err) {
            console.error("Error loading comments:", err);
        }
    };

    const toggleCommentsDrawer = () => {
        if (!showComments) {
            loadComments();
        }
        setShowComments(!showComments);
    };

    const handleLike = async () => {
        try {
            await toggleLike(post.id, currentUser?.id);
            setLiked(!liked);
            setLikes(prev => (liked ? prev - 1 : prev + 1));
        } catch (err) {
            console.error("Like toggle error:", err);
        }
    };

    const handleSaveToCollection = async (collectionName) => {
        try {
            await toggleBookmark(post.id, currentUser?.id, collectionName);
            setBookmarked(true);
            setSavedCollection(collectionName);
            setShowCollectionModal(false);
            if (onPostUpdated) onPostUpdated();
        } catch (err) {
            console.error("Bookmark toggle error:", err);
        }
    };

    const handleRemoveBookmark = async () => {
        try {
            await toggleBookmark(post.id, currentUser?.id, savedCollection);
            setBookmarked(false);
            setShowCollectionModal(false);
            if (onPostUpdated) onPostUpdated();
        } catch (err) {
            console.error("Bookmark remove error:", err);
        }
    };

    const handleShareSearch = async (e) => {
        const query = e.target.value;
        setShareQuery(query);
        if (!query.trim()) {
            setShareUsers([]);
            return;
        }
        try {
            const res = await searchUsers(query);
            setShareUsers((res.data || []).filter(u => String(u.id) !== String(currentUser?.id)));
        } catch (err) {
            console.error("Share search error:", err);
        }
    };

    const handleSendPostToUser = async (targetUser) => {
        try {
            await sendMessage({
                recipientId: targetUser.id,
                content: shareNote.trim() ? shareNote : `Shared a post by @${post.username}`,
                sharedPostId: post.id
            });
            setSharedFeedback(`Post shared with ${targetUser.fullName}!`);
            setTimeout(() => {
                setSharedFeedback("");
                setShowShareModal(false);
            }, 1200);
        } catch (err) {
            console.error("Failed to share post via DM:", err);
        }
    };

    const handleCopyPostLink = () => {
        const postUrl = `${window.location.origin}/home`;
        navigator.clipboard.writeText(postUrl);
        setSharedFeedback("Post link copied to clipboard! 📋");
        setTimeout(() => setSharedFeedback(""), 2000);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setCommenting(true);
        try {
            await addComment(post.id, newComment, currentUser?.id);
            setNewComment("");
            loadComments();
        } catch (err) {
            console.error("Failed to add comment:", err);
        } finally {
            setCommenting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            loadComments();
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    const handleDeletePost = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(post.id);
                if (onPostDeleted) onPostDeleted();
            } catch (err) {
                console.error("Failed to delete post:", err);
            }
        }
    };



    const formattedDate = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
        : "";

    const isAuthor = currentUser && currentUser.username === post.username;

    return (
        <div className="post-card">
            <div className="post-header">
                <div>
                    <span
                        className="post-author"
                        style={{ cursor: "pointer" }}
                        onClick={() => post.userId ? navigate(`/profile/${post.userId}`) : navigate('/profile')}
                    >
                        {post.fullName || post.username || "User"}
                    </span>
                    <span
                        className="post-username"
                        style={{ cursor: "pointer" }}
                        onClick={() => post.userId ? navigate(`/profile/${post.userId}`) : navigate('/profile')}
                    >
                        @{post.username || "username"}
                    </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {formattedDate && <span className="post-date">{formattedDate}</span>}
                    {isAuthor && (
                        <button
                            onClick={handleDeletePost}
                            style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                            title="Delete post"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>

            <p className="post-content">{post.content}</p>

            {post.imageUrl && (
                <img
                    src={getImageUrl(post.imageUrl)}
                    alt="Post attachment"
                    className="post-image"
                />
            )}

            <div className="post-actions">
                <button
                    className={`action-btn ${liked ? "active" : ""}`}
                    onClick={handleLike}
                >
                    {liked ? "❤️" : "🤍"} {likes} Likes
                </button>

                <button
                    className="action-btn"
                    onClick={toggleCommentsDrawer}
                >
                    💬 {comments.length} Comments
                </button>

                <button
                    className={`action-btn ${bookmarked ? "active" : ""}`}
                    onClick={() => setShowCollectionModal(true)}
                >
                    {bookmarked ? `🔖 ${savedCollection}` : "🔖 Save"}
                </button>

                <button
                    className="action-btn"
                    onClick={() => setShowShareModal(true)}
                >
                    ↗️ Share
                </button>
            </div>

            {/* Share Post Modal */}
            {showShareModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3>↗️ Share Post to Someone</h3>
                            <button className="nav-btn" onClick={() => setShowShareModal(false)}>✕</button>
                        </div>

                        {sharedFeedback && <div className="auth-success" style={{ marginBottom: "12px" }}>{sharedFeedback}</div>}

                        <button className="btn-primary" style={{ marginBottom: "16px" }} onClick={handleCopyPostLink}>
                            📋 Copy Link to Clipboard
                        </button>

                        <div className="form-group">
                            <label>Optional Note</label>
                            <input
                                type="text"
                                placeholder="Add a message with this post..."
                                value={shareNote}
                                onChange={(e) => setShareNote(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Send directly in Direct Message (DM)</label>
                            <input
                                type="text"
                                placeholder="Search user by name or username..."
                                value={shareQuery}
                                onChange={handleShareSearch}
                            />
                        </div>

                        {shareUsers.length > 0 && (
                            <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "12px" }}>
                                {shareUsers.map(u => (
                                    <div
                                        key={u.id}
                                        className="user-result-card"
                                        style={{ marginBottom: "6px" }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: "600" }}>{u.fullName}</div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>@{u.username}</div>
                                        </div>
                                        <button
                                            className="btn-primary"
                                            style={{ width: "auto", padding: "6px 12px", fontSize: "0.85rem" }}
                                            onClick={() => handleSendPostToUser(u)}
                                        >
                                            Send ✈️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Collection Selection Modal */}
            {showCollectionModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3>🔖 Save to Collection</h3>
                            <button className="nav-btn" onClick={() => setShowCollectionModal(false)}>✕</button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                            {["Favorites", "Inspiration", "Tech", "Travel"].map((folder) => (
                                <button
                                    key={folder}
                                    className="nav-btn"
                                    style={{ justifyContent: "flex-start", padding: "10px 16px" }}
                                    onClick={() => handleSaveToCollection(folder)}
                                >
                                    📂 {folder}
                                </button>
                            ))}
                        </div>

                        {/* Custom Collection Input */}
                        <div className="form-group" style={{ marginBottom: "16px" }}>
                            <label>Or create a new Collection folder:</label>
                            <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                                <input
                                    type="text"
                                    placeholder="Folder name..."
                                    value={customColName}
                                    onChange={(e) => setCustomColName(e.target.value)}
                                />
                                <button
                                    className="btn-primary"
                                    style={{ width: "auto" }}
                                    disabled={!customColName.trim()}
                                    onClick={() => handleSaveToCollection(customColName.trim())}
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                        {bookmarked && (
                            <button
                                className="nav-btn btn-logout"
                                style={{ width: "100%", marginTop: "10px" }}
                                onClick={handleRemoveBookmark}
                            >
                                ✕ Remove from Saved Collections
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Comments Drawer */}
            {showComments && (
                <div className="comments-section" style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <form onSubmit={handleAddComment} style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: "6px",
                                border: "1px solid var(--card-border)",
                                background: "rgba(15,23,42,0.6)",
                                color: "#fff",
                                fontSize: "0.9rem"
                            }}
                        />
                        <button
                            type="submit"
                            disabled={commenting || !newComment.trim()}
                            className="btn-primary"
                            style={{ width: "auto", padding: "8px 16px", fontSize: "0.85rem" }}
                        >
                            Comment
                        </button>
                    </form>

                    {comments.length === 0 ? (
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", background: "rgba(15,23,42,0.4)", padding: "8px 12px", borderRadius: "6px" }}>
                                <div>
                                    <span style={{ fontWeight: "600", fontSize: "0.85rem" }}>
                                        {comment.fullName || comment.username}
                                    </span>
                                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "6px" }}>
                                        @{comment.username}
                                    </span>
                                    <p style={{ fontSize: "0.9rem", marginTop: "2px" }}>{comment.content}</p>
                                </div>
                                {currentUser && (currentUser.username === comment.username || isAuthor) && (
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem" }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default PostCard;