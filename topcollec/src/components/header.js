import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './header.css';
import Button from './button.js';


function Header() {
    const navigate = useNavigate();
    
    const handleLoginClick = () => {
        navigate('/login');
    };
  return (
    <header className="header">
      <div className="logo">TopCollec</div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/popular">Popular</a>
        <a href="/categories">Categories</a>
      </nav>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="login"> 
        <Button text="login" onClick={() => {handleLoginClick()}} />
      </div>
    </header>
  );
}

export default Header;
