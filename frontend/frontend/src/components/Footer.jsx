import React from 'react';

const Footer = () => (
  <footer style={{
    background: '#222f3e',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem',
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 100
  }}>
    &copy; {new Date().getFullYear()} Project Management App. All rights reserved.
  </footer>
);

export default Footer;
