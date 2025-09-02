import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import './signup.css';

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [success, setSuccess]=useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
                displayName: name, // adding input name to currentUser manually -- currentUser does not save name, only uid and email and other meta data.
            });
            const user = auth.currentUser;
            console.log("User registered successfully!!");
            setSuccess("User registered successfully!!");
        } catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-div">
            <div className="signup-form">
                <form onSubmit={(e) => handleSignup(e)}>
                    <div className="each-signup-div" ><h1 style={{ color: "red" }}>SIGN UP</h1></div>

                    <div className="each-signup-div"><label htmlFor="username">Username</label> &nbsp;
                        <input type="text" id="username" placeholder="Enter name" name="username" value={name}
                            onChange={(e) => setName(e.target.value)} /><br />
                    </div>

                    <div className="each-signup-div">   <label htmlFor="email_id">Email</label> &nbsp;
                        <input type="email" id="email_id" placeholder="Enter email" name="email" value={email}
                            onChange={(e) => setEmail(e.target.value)} /><br />
                    </div>

                    <div className="each-signup-div">        <label htmlFor="pw">Password</label> &nbsp;
                        <input type="password" id="pw" placeholder="Enter password" name="password" value={password}
                            onChange={(e) => setPassword(e.target.value)} /><br />
                    </div>

                    <div className="each-signup-div">
                        {error && <p style={{ color: "red" }}>{error}</p>}
                          {success && <p style={{ color: "green" }}>{success}</p>} 
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Signing up..." : "SignUp"}
                        </button>
                        <p>Already have an account? <Link to="/login">Login here</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}