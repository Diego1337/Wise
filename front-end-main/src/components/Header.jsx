import React from 'react';
import { FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="mobile-header">
      <button onClick={toggleSidebar} className="hamburger-btn">
        <FaBars />
      </button>
    </header>
  );
};

export default Header;