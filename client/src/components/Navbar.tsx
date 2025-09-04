import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <header className="header">
      <Link to="/" className="logo">U2L</Link>
      
      <div className="nav-menu">
        <div className="nav-links">
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/privacy" className="nav-link">Privacy</Link>
          <Link to="/terms" className="nav-link">Terms</Link>
        </div>
        
        <div className="help-icon">?</div>
        
        {user ? (
          <>
            <Link to="/dashboard" className="nav-link">My URLs</Link>
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <button onClick={onLogout} className="logout-btn">Logout</button>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/auth" className="btn-signup">Sign Up</Link>
            <Link to="/auth" className="btn-signin">Sign In</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
