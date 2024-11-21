import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Optional for styling

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/tasks">TASKS</Link></li>
          <li><Link to="/projects">PROJECTS</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
