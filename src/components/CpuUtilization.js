import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GaugeComponent from 'react-gauge-component';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CpuUtilization() {
  const [coreUsage, setCoreUsage] = useState([]); // State for per-core usage
  const [overallLoad, setOverallLoad] = useState(null); // State for overall CPU load
  const [error, setError] = useState(null);
  const [loadHistory, setLoadHistory] = useState([]); // State to track load history over time
  const [coreHistory, setCoreHistory] = useState([]); // Track per-core history over time

  // Predefined list of 64 colors for the cores
  const coreColors = [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8A2BE2', '#A52A2A',
    '#D2691E', '#FF4500', '#DA70D6', '#32CD32', '#FF1493', '#00FFFF', '#8B0000', '#FFD700',
    '#ADFF2F', '#F0E68C', '#B22222', '#B8860B', '#FF6347', '#40E0D0', '#D8BFD8', '#E6E6FA',
    '#F08080', '#F4A460', '#2E8B57', '#98FB98', '#FF69B4', '#CD5C5C', '#BDB76B', '#A9A9A9',
    '#808000', '#FFFFF0', '#C71585', '#000080', '#008080', '#B0E0E6', '#20B2AA', '#FF6347',
    '#D3D3D3', '#7FFF00', '#FF8C00', '#6A5ACD', '#00FA9A', '#F5FFFA', '#98B5B1', '#FFE4B5',
    '#D8BFD8', '#B0C4DE', '#F0E68C', '#90EE90', '#B0C4DE', '#8A2BE2', '#D2691E', '#C71585',
    '#FFE4C4', '#FF1493', '#FFD700', '#2E8B57', '#3CB371', '#B8860B', '#D3D3D3'
  ];

  useEffect(() => {
    // Function to fetch CPU utilization
    const fetchCpuUsage = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cpu-utilization`);
        const utilization = response.data.utilization;

        // Parse and update data
        const newOverallLoad = parseFloat(utilization.overallLoad.replace('%', ''));
        const newCoreUsage = utilization.perCoreLoad.map(core => ({
          core: core.core,
          load: parseFloat(core.load.replace('%', ''))
        }));

        setCoreUsage(newCoreUsage);
        setOverallLoad(newOverallLoad);
        setError(null);

        // Update the load history (store the new overall load)
        setLoadHistory(prevHistory => {
          const newHistory = [...prevHistory, newOverallLoad];
          if (newHistory.length > 60) { // Limit history to 60 data points (60 seconds)
            newHistory.shift();
          }
          return newHistory;
        });

        // Update per-core load history
        setCoreHistory(prevHistory => {
          const updatedHistory = [...prevHistory];
          newCoreUsage.forEach(core => {
            if (!updatedHistory[core.core]) {
              updatedHistory[core.core] = [];
            }
            const newCoreHistory = [...updatedHistory[core.core], core.load];
            if (newCoreHistory.length > 60) {
              newCoreHistory.shift();
            }
            updatedHistory[core.core] = newCoreHistory;
          });
          return updatedHistory;
        });
      } catch (err) {
        setError('Error fetching CPU utilization');
        console.error(err);
      }
    };

    // Fetch data initially and then every second
    fetchCpuUsage(); // Initial fetch
    const intervalId = setInterval(fetchCpuUsage, 1000); // Fetch every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to calculate dynamic color based on load percentage
  const getBarColor = load => {
    const green = Math.floor((100 - load) * 2.55); // Green decreases as load increases
    const red = Math.floor(load * 2.55); // Red increases as load increases
    return `rgb(${red}, ${green}, 0)`; // Dynamic RGB color
  };

  // Chart.js data for the line chart
  const chartData = {
    labels: loadHistory.map((_, index) => index + 1), // X-axis labels (time in seconds)
    datasets: [
      {
        label: 'Overall Load (%)',
        data: loadHistory, // Y-axis data (overall load history)
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
      ...coreUsage.map((core, index) => ({
        label: `Core ${core.core}`,
        data: coreHistory[core.core] || [], // Use core-specific history
        borderColor: coreColors[index % coreColors.length], // Use color from predefined list
        backgroundColor: coreColors[index % coreColors.length],
        fill: false,
        tension: 0.4,
      })),
    ],
  };

  const chartOptions = {
    color: '#E0E0E0',
    scales: {
      x: {
        min: 0,   // Set min value to 0
        max: 60,  // Set max value to 60 (since you're tracking the last 60 seconds)
        ticks: {
          stepSize: 10,
          color: '#E0E0E0' // Display ticks every 10 units
        },
      },
      y: {
        min: 0,    // Set min value to 0
        max: 100,  // Set max value to 100 (for percentage load)
        ticks: {
          stepSize: 10,
          color: '#E0E0E0' // Display ticks every 10 units
        },
      },
    },
    animation: {
      duration: 0, // Disable animation
    },
  };

  return (
    <div>
      <h1>CPU Utilization</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : coreUsage.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          {/*<h2>Overall Load: {overallLoad?.toFixed(2)}%</h2>*/}

            <div style={{ width: '43%', height: '43%', marginLeft: '-50px', color: '#E0E0E0' }}>
            <GaugeComponent
              arc={{
                subArcs: [
                  {
                    limit: 50,
                    color: '#5BE12C',
                    showTick: true
                  },
                  {
                    limit: 70,
                    color: '#F5CD19',
                    showTick: true
                  },
                  {
                    limit: 90,
                    color: '#F58B19',
                    showTick: true
                  },
                  {
                    limit: 100,
                    color: '#EA4228',
                    showTick: true
                  },
                ]
              }}
              value={overallLoad}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '37%' }}>
            {coreUsage.map(({ core, load }) => (
              <div key={core} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: '50px', textAlign: 'right', marginRight: '10px' }}>
                  Core {core}
                </span>
                <div
                  style={{
                    background: '#ddd',
                    height: '20px',
                    flex: 1,
                    position: 'relative',
                    borderRadius: '5px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      width: `${load}%`,
                      background: getBarColor(load), // Dynamic color based on load
                      height: '100%',
                      transition: 'width 0.5s ease, background-color 0.5s ease'
                    }}
                  ></div>
                </div>
                <span style={{ marginLeft: '10px', width: '50px', textAlign: 'left' }}>
                  {load.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>

          {/* Line chart for overall load */}
          <div style={{ width: '55%', marginTop: '-500px', marginLeft: '650px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
}

export default CpuUtilization;
