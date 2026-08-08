import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { getCurrentUser, getUserById, updateUser, uploadProfileImage } from "../services/userService";
import { getFollowersCount, getFollowingCount, followUser, getFollowers, getFollowing } from "../services/followService";
import { getAllPosts } from "../services/postService";
import { getImageUrl } from "../utils/imageUrl";


function Profile() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

    // Edit Profile state
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName: "",
        bio: "",
        profileImage: "",
        coverImage: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Followers & Following Modals state
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followersList, setFollowersList] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [loadingModal, setLoadingModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        loadData();
    }, [userId, navigate]);

    const loadData = async () => {
        try {
            const meRes = await getCurrentUser();
            const me = meRes.data;
            setCurrentUser(me);

            const targetId = userId ? userId : me.id;
            const isOwnProfile = String(targetId) === String(me.id);

            let profileData;
            if (isOwnProfile) {
                profileData = me;
            } else {
                const userRes = await getUserById(targetId);
                profileData = userRes.data;
            }

            if (!profileData) {
                console.error("No profile user returned");
                return;
            }

            setProfileUser(profileData);
            setEditData({
                fullName: profileData.fullName || "",
                bio: profileData.bio || "",
                profileImage: profileData.profileImage || "",
                coverImage: profileData.coverImage || ""
            });

            // Load counts safely
            try {
                const followersRes = await getFollowersCount(targetId);
                setFollowersCount(followersRes.data || 0);
            } catch (e) {
                console.error("Error loading followers count:", e);
            }

            try {
                const followingRes = await getFollowingCount(targetId);
                setFollowingCount(followingRes.data || 0);
            } catch (e) {
                console.error("Error loading following count:", e);
            }

            // Check if current user is following target user safely
            if (!isOwnProfile) {
                try {
                    const myFollowing = await getFollowing(me.id);
                    const isFound = (myFollowing.data || []).some(
                        u => String(u.id) === String(targetId)
                    );
                    setIsFollowing(isFound);
                } catch (e) {
                    console.error("Error checking following status:", e);
                }
            }

            // Load User Posts safely
            try {
                const postsRes = await getAllPosts();
                const allPosts = postsRes.data || [];
                const userPosts = allPosts.filter(
                    p => String(p.userId) === String(targetId) || String(p.username) === String(profileData.username)
                );
                setPosts(userPosts);
            } catch (e) {
                console.error("Error loading user posts:", e);
            }

        } catch (err) {
            console.error("Error loading profile data:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("token");
                navigate("/");
            }
        }
    };


    const handleFollowToggle = async () => {
        if (!profileUser) return;
        try {
            await followUser(profileUser.id);
            setIsFollowing(!isFollowing);
            setFollowersCount(prev => (isFollowing ? prev - 1 : prev + 1));
        } catch (err) {
            console.error("Follow error:", err);
        }
    };

    const openFollowersModal = async () => {
        if (!profileUser) return;
        setLoadingModal(true);
        setShowFollowersModal(true);
        try {
            const res = await getFollowers(profileUser.id);
            setFollowersList(res.data || []);
        } catch (err) {
            console.error("Failed to load followers list:", err);
        } finally {
            setLoadingModal(false);
        }
    };

    const openFollowingModal = async () => {
        if (!profileUser) return;
        setLoadingModal(true);
        setShowFollowingModal(true);
        try {
            const res = await getFollowing(profileUser.id);
            setFollowingList(res.data || []);
        } catch (err) {
            console.error("Failed to load following list:", err);
        } finally {
            setLoadingModal(false);
        }
    };

    const handleFollowInModal = async (targetUserId) => {
        try {
            await followUser(targetUserId);
            // Refresh modal lists
            if (showFollowersModal) openFollowersModal();
            if (showFollowingModal) openFollowingModal();
            loadData();
        } catch (err) {
            console.error("Follow error in modal:", err);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            let updatedProfileImage = editData.profileImage;

            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadRes = await uploadProfileImage(formData);
                updatedProfileImage = uploadRes.data;
            }

            await updateUser({
                fullName: editData.fullName,
                bio: editData.bio,
                profileImage: updatedProfileImage,
                coverImage: editData.coverImage
            });

            setMessage("Profile updated successfully!");
            setIsEditing(false);
            setImageFile(null);
            loadData();
        } catch (err) {
            console.error("Save profile error:", err);
            setMessage("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };



    const navigateToUser = (uId) => {
        setShowFollowersModal(false);
        setShowFollowingModal(false);
        navigate(`/profile/${uId}`);
    };

    if (!profileUser) {
        return (
            <div className="app-layout">
                <Sidebar currentUser={currentUser} />
                <main className="main-content-area">
                    <div className="feed-container">
                        <p style={{ textAlign: "center", marginTop: "40px" }}>Loading profile...</p>
                    </div>
                </main>
            </div>
        );
    }


    const isOwn = currentUser && String(currentUser.id) === String(profileUser.id);

    return (
        <div className="app-layout">
            <Sidebar currentUser={currentUser} />

            <main className="main-content-area">
                <div className="profile-container">

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <button className="back-btn" onClick={() => navigate(-1)} title="Go Back">
                            ← Back
                        </button>
                        <h3 style={{ margin: 0 }}>{profileUser.fullName}'s Profile</h3>
                    </div>

                {/* Cover Banner */}

                <div
                    className="profile-cover"
                    style={{
                        backgroundImage: profileUser.coverImage
                            ? `url(${getImageUrl(profileUser.coverImage)})`
                            : "linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)"
                    }}
                />

                <div className="profile-header-card">
                    <div className="profile-avatar-wrapper">
                        {profileUser.profileImage ? (
                            <img
                                src={getImageUrl(profileUser.profileImage)}
                                alt={profileUser.fullName}
                                className="profile-avatar"
                            />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                {(profileUser.fullName || profileUser.username || "U")[0].toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="profile-main-info">
                        <h2>{profileUser.fullName}</h2>
                        <p className="profile-username">@{profileUser.username}</p>
                        {profileUser.bio && <p className="profile-bio">{profileUser.bio}</p>}

                        <div className="profile-stats">
                            <span className="stat-item">
                                <strong>{posts.length}</strong> Posts
                            </span>
                            <span className="stat-item clickable-stat" onClick={openFollowersModal}>
                                <strong>{followersCount}</strong> Followers
                            </span>
                            <span className="stat-item clickable-stat" onClick={openFollowingModal}>
                                <strong>{followingCount}</strong> Following
                            </span>
                        </div>
                    </div>

                    <div className="profile-actions">
                        {isOwn ? (
                            <button className="btn-primary" onClick={() => setIsEditing(true)}>
                                ✏️ Edit Profile
                            </button>
                        ) : (
                            <button
                                className={`btn-primary ${isFollowing ? "btn-outline" : ""}`}
                                onClick={handleFollowToggle}
                            >
                                {isFollowing ? "✓ Following" : "+ Follow"}
                            </button>
                        )}
                    </div>
                </div>

                {message && <div className="auth-success" style={{ maxWidth: "680px", margin: "16px auto" }}>{message}</div>}

                {/* Edit Profile Modal */}
                {isEditing && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Edit Profile</h3>
                            <form onSubmit={handleSaveProfile}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={editData.fullName}
                                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Bio</label>
                                    <textarea
                                        rows="3"
                                        value={editData.bio}
                                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                        placeholder="Tell the world about yourself..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Profile Picture</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Cover Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={editData.coverImage}
                                        onChange={(e) => setEditData({ ...editData, coverImage: e.target.value })}
                                    />
                                </div>

                                <div className="modal-buttons">
                                    <button type="button" className="nav-btn" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Followers Modal */}
                {showFollowersModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <h3>Followers ({followersCount})</h3>
                                <button className="nav-btn" onClick={() => setShowFollowersModal(false)}>✕</button>
                            </div>

                            {loadingModal ? (
                                <p style={{ textAlign: "center" }}>Loading followers...</p>
                            ) : followersList.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No followers yet.</p>
                            ) : (
                                <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                                    {followersList.map((u) => (
                                        <div key={u.id} className="user-result-card" style={{ marginBottom: "10px" }}>
                                            <div
                                                style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
                                                onClick={() => navigateToUser(u.id)}
                                            >
                                                {u.profileImage ? (
                                                    <img
                                                        src={getImageUrl(u.profileImage)}
                                                        alt={u.fullName}
                                                        style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    <div className="profile-avatar-placeholder" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>
                                                        {(u.fullName || u.username || "U")[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{u.fullName}</div>
                                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>@{u.username}</div>
                                                </div>
                                            </div>

                                            {currentUser && String(currentUser.id) !== String(u.id) && (
                                                <button
                                                    className="nav-btn"
                                                    style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                                                    onClick={() => handleFollowInModal(u.id)}
                                                >
                                                    Follow / Unfollow
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Following Modal */}
                {showFollowingModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                <h3>Following ({followingCount})</h3>
                                <button className="nav-btn" onClick={() => setShowFollowingModal(false)}>✕</button>
                            </div>

                            {loadingModal ? (
                                <p style={{ textAlign: "center" }}>Loading following users...</p>
                            ) : followingList.length === 0 ? (
                                <p style={{ color: "var(--text-muted)", textAlign: "center" }}>Not following anyone yet.</p>
                            ) : (
                                <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                                    {followingList.map((u) => (
                                        <div key={u.id} className="user-result-card" style={{ marginBottom: "10px" }}>
                                            <div
                                                style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
                                                onClick={() => navigateToUser(u.id)}
                                            >
                                                {u.profileImage ? (
                                                    <img
                                                        src={getImageUrl(u.profileImage)}
                                                        alt={u.fullName}
                                                        style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    <div className="profile-avatar-placeholder" style={{ width: "42px", height: "42px", fontSize: "1.1rem" }}>
                                                        {(u.fullName || u.username || "U")[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{u.fullName}</div>
                                                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>@{u.username}</div>
                                                </div>
                                            </div>

                                            {currentUser && String(currentUser.id) !== String(u.id) && (
                                                <button
                                                    className="nav-btn"
                                                    style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                                                    onClick={() => handleFollowInModal(u.id)}
                                                >
                                                    Follow / Unfollow
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* User's Posts Feed */}
                <div className="feed-container">
                    <h3>{isOwn ? "Your Posts" : `${profileUser.fullName}'s Posts`}</h3>
                    {posts.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", marginTop: "20px" }}>
                            No posts published yet.
                        </p>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post.id} post={post} currentUser={currentUser} onPostDeleted={loadData} />
                        ))
                    )}
                </div>
            </div>
            </main>
        </div>
    );
}

export default Profile;

