
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <nav style={{
      width: '100%',
      background: 'var(--panel-border)',
      padding: '0.7em 0',
      display: 'flex',
      justifyContent: 'center',
      boxShadow: '0 2px 8px #bfa76f33',
      marginBottom: '1.5em',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <Link to="/" style={navBtnStyle}>Home</Link>
      {path !== '/signin' && <Link to="/signin" style={navBtnStyle}>Sign In</Link>}
      {path !== '/signup' && <Link to="/signup" style={navBtnStyle}>Sign Up</Link>}
      {path === '/dashboard' && <Link to="/" style={navBtnStyle}>Log Out</Link>}
    </nav>
  );
};

const navBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#7c5e2a',
  fontSize: '1.1em',
  fontWeight: 700,
  margin: '0 1.5em',
  cursor: 'pointer',
  letterSpacing: '0.04em',
  padding: '0.2em 0.5em',
  borderBottom: '2px solid transparent',
  transition: 'border 0.2s',
  textDecoration: 'none',
};

export default NavBar;
