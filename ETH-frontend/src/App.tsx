import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Test from "./pages/Test";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import { SignInForm } from "./components/SignInForm";
import { SignUpForm } from "./components/SignUpForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/test" element={<Test />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="*" element={
          <div style={{ 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#1a1a1a',
            color: 'white',
            minHeight: '100vh'
          }}>
            <h1>404 - Page Not Found</h1>
            <p>This page doesn't exist.</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
