
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPageWithNav />} />
        <Route path="/signin" element={<SignInWithNav />} />
        <Route path="/signup" element={<SignUpWithNav />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

// Wrappers to allow navigation after sign in/up
function LandingPageWithNav() {
  const navigate = useNavigate();
  return <LandingPage onSignIn={() => navigate('/signin')} onSignUp={() => navigate('/signup')} />;
}
function SignInWithNav() {
  const navigate = useNavigate();
  return <SignIn onSignInSuccess={() => navigate('/dashboard')} />;
}
function SignUpWithNav() {
  const navigate = useNavigate();
  return <SignUp onSignUpSuccess={() => navigate('/dashboard')} />;
}

export default App;
