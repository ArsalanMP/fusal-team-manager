import React from 'react';

const Logo = ({ size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
      
      {/* Ball Pattern */}
      <path
        d="M50 15
           A35 35 0 1 1 50 85
           A35 35 0 1 1 50 15
           M50 25
           A25 25 0 1 0 50 75
           A25 25 0 1 0 50 25
           Z"
        fill="#2c3e50"
        opacity="0.9"
      />
      
      {/* Pentagon Pattern */}
      <path
        d="M50 25
           L65 40
           L60 60
           L40 60
           L35 40
           Z"
        fill="#3498db"
        opacity="0.9"
      />
      
      {/* Ball Segments */}
      <path
        d="M35 40 L50 25 L65 40 M40 60 L50 75 L60 60"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#3498db" />
          <stop offset="100%" stopColor="#2ecc71" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo; 