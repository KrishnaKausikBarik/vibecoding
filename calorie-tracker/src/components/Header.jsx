import React from 'react';
import { Activity, Settings, User } from 'lucide-react';
import './Header.css';

function Header() {
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  return (
    <header className="header">
      <div className="header-left">
        <Activity className="logo-icon" size={28} />
        <div className="brand">
          <h1>CalorieTrack</h1>
          <span>Daily Nutrition Dashboard</span>
        </div>
      </div>
      <div className="header-right">
        <span className="date">{date}</span>
        <button className="icon-btn" aria-label="Settings"><Settings size={20} /></button>
        <button className="icon-btn avatar" aria-label="Profile"><User size={20} /></button>
      </div>
    </header>
  );
}

export default Header;
