import { useState,useEffect,useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { AuthContext } from "./authcontext";
import './login.css';

export default function Login() {
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && user) {
            navigate('/', { replace: true }); 
        }
    }, [user, loading, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in!");
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-div">
            <div className="login-form">
                <form onSubmit={handleLogin}>
                    <div className="each-login-div"><h1 style={{ color: "red" }}>LOGIN</h1></div>

                    <div className="each-login-div">
                        <label htmlFor="email_id">Email</label> &nbsp;
                        <input type="email" id="email_id" placeholder="Enter email" name="email" value={email}
                            onChange={(e) => setEmail(e.target.value)} /> <br /><br />
                    </div>

                    <div className="each-login-div">
                        <label htmlFor="pw">Password</label> &nbsp;
                        <input type="password" id="pw" placeholder="Enter password" name="password" value={password}
                            onChange={(e) => setPassword(e.target.value)} /><br /><br />
                    </div>

                    <div className="each-login-div">
                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
