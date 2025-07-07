import React from 'react';

const Test = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1a1a1a',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>🚀 CryptoBot Pro Frontend Test</h1>
      <p>If you can see this page, the React frontend is working correctly!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <div style={{ 
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#333',
        borderRadius: '5px'
      }}>
        <h3>Frontend Status: ✅ Working</h3>
        <p>This confirms that:</p>
        <ul>
          <li>Vite development server is running</li>
          <li>React is loading correctly</li>
          <li>TypeScript compilation is working</li>
          <li>Routing is functional</li>
        </ul>
      </div>
    </div>
  );
};

export default Test; 