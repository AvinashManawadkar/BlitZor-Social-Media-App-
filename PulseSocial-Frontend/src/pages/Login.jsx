import { useState, useEffect } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && token.split(".").length === 3) {
            navigate("/home");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        localStorage.removeItem("token");

        try {
            const response = await loginUser(user);
            let rawToken = "";

            if (typeof response.data === 'string') {
                rawToken = response.data.trim();
            } else if (response.data && typeof response.data === 'object') {
                rawToken = (response.data.token || response.data.jwt || response.data.accessToken || "").trim();
            }

            if (rawToken && !rawToken.includes(" ") && rawToken.split(".").length === 3) {
                localStorage.setItem("token", rawToken);
                navigate("/home");
            } else {
                setError("Login failed: " + (rawToken || "Invalid token received from server"));
            }
        } catch (err) {
            console.error("Login error details:", err);
            const serverErr = err.response?.data;
            const msg = typeof serverErr === 'string'
                ? serverErr
                : (serverErr?.message || serverErr?.error || err.message || "Invalid credentials. Check your email/username and password.");
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
                    <h2>Blitzor Login</h2>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={submitLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
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
                            placeholder="Enter your password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Logging in..." : "Login to Blitzor"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;