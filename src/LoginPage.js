import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file

const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulating login/signup logic (you can integrate Firebase or backend here)
    if (email && password) {
      onLogin({ email });
      navigate('/dashboard');
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="login-container">
      <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p onClick={() => setIsSignUp(!isSignUp)} className="switch-link">
        {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
      </p>
    </div>
  );
};

export default LoginPage;
