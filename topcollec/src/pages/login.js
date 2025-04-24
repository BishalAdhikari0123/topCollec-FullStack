import React from 'react';
import './login.css';
import Button from '../components/button';

function Login() {
  return (
    <div className="login-container">
      <h2>Login to TopCollec</h2>
      <form className="login-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <Button text="Login" onClick={(e) => {
          e.preventDefault();
          console.log("Login button clicked");
        }} />
      </form>
    </div>
  );
}

export default Login;
