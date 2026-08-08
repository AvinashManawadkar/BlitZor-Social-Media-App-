import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getCurrentUser, updateUser, uploadProfileImage, changePassword } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Settings() {
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");

    // Profile Settings Form
    const [profileData, setProfileData] = useState({
        fullName: "",
        bio: "",
        profileImage: "",
        coverImage: ""
    });
    const [imageFile, setImageFile] = useState(null);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState("");
    const [profileErr, setProfileErr] = useState("");

    // Change Password Form
    const [passData, setPassData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passSaving, setPassSaving] = useState(false);
    const [passMsg, setPassMsg] = useState("");
    const [passErr, setPassErr] = useState("");

    // App Preferences Form
    const [prefs, setPrefs] = useState({
        privateProfile: false,
        emailNotifications: true,
        darkMode: true
    });
    const [prefMsg, setPrefMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const res = await getCurrentUser();
            const user = res.data;
            setCurrentUser(user);
            setProfileData({
                fullName: user.fullName || "",
                bio: user.bio || "",
                profileImage: user.profileImage || "",
                coverImage: user.coverImage || ""
            });
        } catch (err) {
            console.error("Failed to load user settings:", err);
            navigate("/");
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        setProfileMsg("");
        setProfileErr("");

        try {
            let avatarUrl = profileData.profileImage;

            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadRes = await uploadProfileImage(formData);
                avatarUrl = uploadRes.data;
            }

            await updateUser({
                fullName: profileData.fullName,
                bio: profileData.bio,
                profileImage: avatarUrl,
                coverImage: profileData.coverImage
            });

            setProfileMsg("Profile updated successfully!");
            setImageFile(null);
            loadUser();
        } catch (err) {
            console.error("Failed to update profile:", err);
            setProfileErr("Error updating profile.");
        } finally {
            setProfileSaving(false);
        }
    };

    const handleChangePass = async (e) => {
        e.preventDefault();
        setPassSaving(true);
        setPassMsg("");
        setPassErr("");

        if (passData.newPassword !== passData.confirmPassword) {
            setPassErr("New passwords do not match.");
            setPassSaving(false);
            return;
        }

        try {
            await changePassword({
                oldPassword: passData.oldPassword,
                newPassword: passData.newPassword
            });
            setPassMsg("Password changed successfully!");
            setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error("Failed to change password:", err);
            setPassErr(err.response?.data || "Failed to change password.");
        } finally {
            setPassSaving(false);
        }
    };

    const handleSavePrefs = (e) => {
        e.preventDefault();
        setPrefMsg("Preferences saved successfully!");
        setTimeout(() => setPrefMsg(""), 3000);
    };

    return (
        <div className="app-layout">
            <Sidebar currentUser={currentUser} />

            <main className="main-content-area">
                <div className="feed-container">
                    <h2>⚙️ Profile Settings</h2>

                    {/* Tabs */}
                    <div style={{ display: "flex", gap: "10px", marginTop: "16px", marginBottom: "24px" }}>
                        <button
                            className={`nav-btn ${activeTab === "profile" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("profile")}
                        >
                            👤 Edit Profile
                        </button>
                        <button
                            className={`nav-btn ${activeTab === "password" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("password")}
                        >
                            🔒 Security & Password
                        </button>
                        <button
                            className={`nav-btn ${activeTab === "preferences" ? "active-tab" : ""}`}
                            onClick={() => setActiveTab("preferences")}
                        >
                            ⚙️ Preferences
                        </button>
                    </div>


                {/* Profile Settings Tab */}
                {activeTab === "profile" && (
                    <div className="create-post-card">
                        <h3>Edit Profile Information</h3>

                        {profileMsg && <div className="auth-success">{profileMsg}</div>}
                        {profileErr && <div className="auth-error">{profileErr}</div>}

                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.fullName}
                                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Bio</label>
                                <textarea
                                    rows="3"
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    placeholder="Tell the community about yourself..."
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
                                    value={profileData.coverImage}
                                    onChange={(e) => setProfileData({ ...profileData, coverImage: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn-primary" disabled={profileSaving}>
                                {profileSaving ? "Saving Changes..." : "Save Profile Settings"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Security & Password Tab */}
                {activeTab === "password" && (
                    <div className="create-post-card">
                        <h3>Change Password</h3>

                        {passMsg && <div className="auth-success">{passMsg}</div>}
                        {passErr && <div className="auth-error">{passErr}</div>}

                        <form onSubmit={handleChangePass}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passData.oldPassword}
                                    onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passData.newPassword}
                                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passData.confirmPassword}
                                    onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary" disabled={passSaving}>
                                {passSaving ? "Updating Password..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                    <div className="create-post-card">
                        <h3>Account & Privacy Preferences</h3>

                        {prefMsg && <div className="auth-success">{prefMsg}</div>}

                        <form onSubmit={handleSavePrefs}>
                            <div className="form-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>Private Account</strong>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Only approved followers can see your posts.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={prefs.privateProfile}
                                    onChange={(e) => setPrefs({ ...prefs, privateProfile: e.target.checked })}
                                    style={{ width: "20px", height: "20px" }}
                                />
                            </div>

                            <div className="form-group" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <strong>Email Notifications</strong>
                                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Receive email alerts for likes and comments.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={prefs.emailNotifications}
                                    onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })}
                                    style={{ width: "20px", height: "20px" }}
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: "12px" }}>
                                Save Preferences
                            </button>
                        </form>
                    </div>
                )}
            </div>
            </main>
        </div>
    );
}

export default Settings;

