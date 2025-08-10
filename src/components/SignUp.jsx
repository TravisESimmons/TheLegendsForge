import React, { useState } from 'react';

const SignUp = ({ onSignUpSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: always succeed
    onSignUpSuccess();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: 'var(--parchment)' }}>
      <div className="logo-portrait" style={{ marginTop: '3em' }}>
        <img
          src="/TLF-Logo.png"
          alt="The Legends Forge Logo"
          style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '50%' }}
        />
      </div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1em', minWidth: 280 }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ padding: '0.7em', borderRadius: 6, border: '1px solid #bfa76f', fontSize: '1em' }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ padding: '0.7em', borderRadius: 6, border: '1px solid #bfa76f', fontSize: '1em' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '0.7em', borderRadius: 6, border: '1px solid #bfa76f', fontSize: '1em' }}
          required
        />
        <button type="submit" style={{ fontSize: '1.1em', padding: '0.7em 2em', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px #7c5e2a44' }}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
