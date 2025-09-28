import React from 'react';
import { NavLink } from 'react-router-dom';

import logoCostwise from '../assets/logo_costwise_white.png';
import logoMcm from '../assets/logo_mcm_white.png';
import iconDashboard from '../assets/dashboard-panel.png';
import iconRegistros from '../assets/table-layout.png';
import iconCalculadora from '../assets/calculator-money.png';

const Sidebar = () => {
  return (
    <aside className="sidebar">
        <div className="sidebar-content">
            <div className="sidebar-header">
                <NavLink to="/dashboard" className="logo-link">
                    <img src={logoCostwise} alt="CostWise Logo" className="logo-img-main" />
                </NavLink>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                            <img src={iconDashboard} alt="Dashboard Icon" className="nav-icon-img" />
                            <span className="nav-text">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/registros" className={({ isActive }) => isActive ? "active" : ""}>
                            <img src={iconRegistros} alt="Registros Icon" className="nav-icon-img" />
                            <span className="nav-text">Registros</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/calculadora" className={({ isActive }) => isActive ? "active" : ""}>
                            <img src={iconCalculadora} alt="Calculadora Icon" className="nav-icon-img" />
                            <span className="nav-text">Calculadora</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
        <div className="sidebar-footer">
            <img src={logoMcm} alt="MCM Bobinas Logo" className="footer-logo-img" />
            <p className="footer-by">
                <span className="nav-text">by</span>
                <span className="nav-text">Grupo WINX</span>
            </p>
        </div>
    </aside>
  );
};

export default Sidebar;