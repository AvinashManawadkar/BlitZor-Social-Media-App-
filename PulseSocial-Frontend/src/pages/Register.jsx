import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [user, setUser] = useState({
        fullName: "",
        username: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const submitRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await registerUser(user);
            setSuccess(response.data || "Registration successful!");
            setTimeout(() => {
                navigate("/");
            }, 1200);
        } catch (err) {
            console.error("Registration error:", err);
            const msg = err.response?.data?.message || err.response?.data || err.message || "Registration failed.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ textAlign: "center", marginBottom: "16px" }}>
                    <img src="/blitzor-logo.png" alt="Blitzor Logo" className="auth-brand-logo" />
                    <h2>Join Blitzor</h2>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <form onSubmit={submitRegister}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            name="fullName"
                            placeholder="e.g. John Doe"
                            value={user.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            name="username"
                            placeholder="e.g. johndoe"
                            value={user.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Registering..." : "Create Blitzor Account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;