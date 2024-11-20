import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CpuUtilization from './components/CpuUtilization';
import MemoryUtilization from './components/MemoryUtilization';
import DiskUtilization from './components/DiskUtilization';
import DiskActivity from './components/DiskActivity';
import NetworkUtilization from './components/NetworkUtilization';
import './App.css';



function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cpu-utilization" element={<CpuUtilization />} />
          <Route path="/memory-utilization" element={<MemoryUtilization />} />
          <Route path="/disk-utilization" element={<DiskUtilization />} />
          <Route path="/disk-activity" element={<DiskActivity />} />
          <Route path="/network-utilization" element={<NetworkUtilization />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
