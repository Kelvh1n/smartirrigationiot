import React, { useState } from "react";
import { signUpUser } from "./firebaseAuth"; // Import auth functions
import { useHistory } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signUpUser(email, password);
      history.push("/dashboard"); // Redirect to the main app
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign Up</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignupPage;
