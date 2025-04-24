import React from 'react';
import './button.css';

function Button({ text, onClick, type = 'button', variant = 'primary' }) {
  return (
    <button className={`custom-btn ${variant}`} onClick={onClick} type={type}>
      {text}
    </button>
  );
}

export default Button;
