import React, { useState } from 'react';
import { register } from '../services/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register({ username: name, email, password });
      setSuccess('Registration successful! You can now login.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#222f3e' }}>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
        <button type="submit" style={{
          background: '#222f3e',
          color: '#fff',
          padding: '0.75rem',
          border: 'none',
          borderRadius: '5px',
          fontSize: '1rem',
          cursor: 'pointer',
          marginTop: '0.5rem',
        }}>Register</button>
        {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
        {success && <p style={{color: 'green', textAlign: 'center'}}>{success}</p>}
      </form>
    </div>
  );
};

export default Register;
