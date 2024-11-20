import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cpu-utilization">CPU Utilization</Link></li>
        <li><Link to="/memory-utilization">Memory Utilization</Link></li>
        <li><Link to="/disk-utilization">Disk Utilization</Link></li>
        <li><Link to="/disk-activity">Disk Activity</Link></li>
        <li><Link to="/network-utilization">Network Utilization</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
