import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

interface UserHeaderProps {
  user: any;
  onLogout: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, onLogout }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div className="user-header">
      <div className="user-header-content">
        <Link to="/" className="logo-link">
          <h1>You To Link</h1>
        </Link>
        
        <div className="user-info">
          <span className="user-email">{user?.email}</span>
          <div className="user-menu">
            <Link to="/dashboard" className="nav-btn">Dashboard</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
