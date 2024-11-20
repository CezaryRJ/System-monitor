const express = require('express');
const si = require('systeminformation');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());


// Helper function to handle responses
const fetchData = async (dataFn, res) => {
  try {
    const data = await dataFn();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
};

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the System Information API',
    endpoints: [
      '/cpu',
      '/memory',
      '/os',
      '/disk',
      '/network',
      '/processes',
      '/battery',
      '/graphics',
      '/system',
	  '/cpu-utilization',
	  '/temperature',
	  '/network-utilization'
    ],
  });
});

// CPU Information
app.get('/cpu', (req, res) => fetchData(si.cpu, res));

// Memory Information
app.get('/memory', (req, res) => fetchData(si.mem, res));

// Operating System Information
app.get('/os', (req, res) => fetchData(si.osInfo, res));

// Disk Information
app.get('/disk', (req, res) => fetchData(si.diskLayout, res));

// Network Interfaces
app.get('/network', (req, res) => fetchData(si.networkInterfaces, res));

// Running Processes
app.get('/processes', (req, res) => fetchData(si.processes, res));

// Battery Information
app.get('/battery', (req, res) => fetchData(si.battery, res));

// Graphics Information
app.get('/graphics', (req, res) => fetchData(si.graphics, res));

// System Information
app.get('/system', (req, res) => fetchData(si.system, res));

// CPU Utilization
app.get('/cpu-utilization', async (req, res) => {
  try {
    const loadData = await si.currentLoad();
    res.json({
      success: true,
      utilization: {
        overallLoad: `${loadData.currentLoad.toFixed(2)}%`,
        perCoreLoad: loadData.cpus.map((cpu, index) => ({
          core: index,
          load: `${cpu.load.toFixed(2)}%`,
        })),
        idle: `${loadData.currentLoadIdle.toFixed(2)}%`,
      },
    });
  } catch (error) {
    console.error('Error fetching CPU utilization:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch CPU utilization' });
  }
});

// All Temperature Readings
app.get('/temperature', async (req, res) => {
  try {
    const cpuTemp = await si.cpuTemperature();
    const allTemps = await si.temp(); // Only supported on some platforms
    res.json({
      success: true,
      temperature: {
        cpu: {
          main: `${cpuTemp.main}°C`,
          max: `${cpuTemp.max}°C`,
        },
        sensors: allTemps?.sensors || [],
      },
    });
  } catch (error) {
    console.error('Error fetching temperature readings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch temperature readings' });
  }
});

// Network Utilization
app.get('/network-utilization', async (req, res) => {
  try {
    const stats = await si.networkStats();
    const connections = await si.networkConnections();
    res.json({
      success: true,
      network: {
        utilization: stats.map(stat => ({
          interface: stat.iface,
          rxRate: `${(stat.rx_sec / 1024).toFixed(2)} KB/s`, // Received rate
          txRate: `${(stat.tx_sec / 1024).toFixed(2)} KB/s`, // Transmitted rate
        })),
        connections: connections.map(conn => ({
          protocol: conn.protocol,
          localAddress: `${conn.localAddress}:${conn.localPort}`,
          remoteAddress: `${conn.peerAddress}:${conn.peerPort}`,
          state: conn.state,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching network utilization:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch network utilization' });
  }
});

// Disk Utilization
app.get('/disk-utilization', async (req, res) => {
  try {
    const disks = await si.fsSize();
    res.json({
      success: true,
      disks: disks.map(disk => ({
        filesystem: disk.fs,
        type: disk.type,
        size: `${(disk.size / (1024 ** 3)).toFixed(2)} GB`,
        used: `${(disk.used / (1024 ** 3)).toFixed(2)} GB`,
        available: `${(disk.available / (1024 ** 3)).toFixed(2)} GB`,
        utilization: `${disk.use.toFixed(2)}%`,
        mount: disk.mount,
      })),
    });
  } catch (error) {
    console.error('Error fetching disk utilization:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch disk utilization' });
  }
});

// Disk Active Time
app.get('/disk-activity', async (req, res) => {
  try {
    const diskIO = await si.disksIO();
    res.json({
      success: true,
      activity: {
        readBytesPerSecond: `${(diskIO.rIO_sec / 1024).toFixed(2)} KB/s`,
        writeBytesPerSecond: `${(diskIO.wIO_sec / 1024).toFixed(2)} KB/s`,
        totalRead: `${(diskIO.rIO / (1024 ** 3)).toFixed(2)} GB`,
        totalWrite: `${(diskIO.wIO / (1024 ** 3)).toFixed(2)} GB`,
      },
    });
  } catch (error) {
    console.error('Error fetching disk activity:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch disk activity' });
  }
});

app.get('/disk-overview', async (req, res) => {
  try {
    const [disks, diskIO] = await Promise.all([si.fsSize(), si.disksIO()]);
    res.json({
      success: true,
      disks: disks.map(disk => ({
        filesystem: disk.fs,
        type: disk.type,
        size: `${(disk.size / (1024 ** 3)).toFixed(2)} GB`,
        used: `${(disk.used / (1024 ** 3)).toFixed(2)} GB`,
        available: `${(disk.available / (1024 ** 3)).toFixed(2)} GB`,
        utilization: `${disk.use.toFixed(2)}%`,
        mount: disk.mount,
      })),
      activity: {
        readBytesPerSecond: `${(diskIO.rIO_sec / 1024).toFixed(2)} KB/s`,
        writeBytesPerSecond: `${(diskIO.wIO_sec / 1024).toFixed(2)} KB/s`,
        totalRead: `${(diskIO.rIO / (1024 ** 3)).toFixed(2)} GB`,
        totalWrite: `${(diskIO.wIO / (1024 ** 3)).toFixed(2)} GB`,
      },
    });
  } catch (error) {
    console.error('Error fetching disk overview:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch disk overview' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`System Information API is running at http://localhost:${port}`);
});
