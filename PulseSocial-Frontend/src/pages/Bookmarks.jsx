import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { getCurrentUser } from "../services/userService";
import { getBookmarks, getCollections } from "../services/bookmarkService";

function Bookmarks() {
    const [currentUser, setCurrentUser] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [collections, setCollections] = useState([]);
    const [activeCollection, setActiveCollection] = useState("All");
    const [loading, setLoading] = useState(true);

    const [newCollectionName, setNewCollectionName] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const userRes = await getCurrentUser();
            const user = userRes.data;
            setCurrentUser(user);

            const bmRes = await getBookmarks(user.id);
            setBookmarks(bmRes.data || []);

            const colRes = await getCollections(user.id);
            const cols = colRes.data || [];
            if (!cols.includes("Favorites")) cols.unshift("Favorites");
            setCollections(cols);
        } catch (err) {
            console.error("Bookmarks load error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCollection = (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;

        const name = newCollectionName.trim();
        if (!collections.includes(name)) {
            setCollections([...collections, name]);
        }
        setActiveCollection(name);
        setNewCollectionName("");
        setShowCreateModal(false);
    };

    const filteredBookmarks = activeCollection === "All"
        ? bookmarks
        : bookmarks.filter(b => (b.collectionName || "Favorites").toLowerCase() === activeCollection.toLowerCase());

    return (
        <div className="app-layout">
            <Sidebar currentUser={currentUser} />

            <main className="main-content-area">
                <div className="feed-container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <button className="back-btn" onClick={() => navigate(-1)} title="Go Back">
                                ← Back
                            </button>
                            <div>
                                <h2 style={{ margin: 0 }}>🔖 Saved Collections</h2>
                                <p style={{ color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                                    Organize your saved posts into custom collection folders.
                                </p>
                            </div>
                        </div>
                        <button className="btn-primary" style={{ width: "auto" }} onClick={() => setShowCreateModal(true)}>
                            + New Collection
                        </button>
                    </div>


                    {/* Collection Filter Pills */}
                    <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px" }}>
                        <button
                            className={`nav-btn ${activeCollection === "All" ? "active-tab" : ""}`}
                            onClick={() => setActiveCollection("All")}
                        >
                            📁 All Bookmarks ({bookmarks.length})
                        </button>

                        {collections.map((col) => {
                            const count = bookmarks.filter(b => (b.collectionName || "Favorites").toLowerCase() === col.toLowerCase()).length;
                            return (
                                <button
                                    key={col}
                                    className={`nav-btn ${activeCollection === col ? "active-tab" : ""}`}
                                    onClick={() => setActiveCollection(col)}
                                >
                                    📂 {col} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Create Collection Modal */}
                    {showCreateModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>📁 Create New Collection Folder</h3>
                                <form onSubmit={handleCreateCollection}>
                                    <div className="form-group">
                                        <label>Collection Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Inspiration, Tech, Travel..."
                                            value={newCollectionName}
                                            onChange={(e) => setNewCollectionName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="modal-buttons">
                                        <button type="button" className="nav-btn" onClick={() => setShowCreateModal(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            Create Collection
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <p style={{ textAlign: "center" }}>Loading saved collections...</p>
                    ) : filteredBookmarks.length === 0 ? (
                        <div className="create-post-card" style={{ textAlign: "center" }}>
                            <p style={{ color: "var(--text-muted)" }}>
                                {activeCollection === "All"
                                    ? "You haven't bookmarked any posts yet."
                                    : `No posts saved under collection "${activeCollection}".`}
                            </p>
                        </div>
                    ) : (
                        filteredBookmarks.map((post) => (
                            <PostCard key={post.id} post={post} currentUser={currentUser} onPostUpdated={loadData} />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default Bookmarks;

