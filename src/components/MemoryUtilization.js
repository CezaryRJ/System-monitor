import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CpuUtilization() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/cpu-utilization')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching CPU utilization:', error));
  }, []);

  return (
    <div>
      <h1>CPU Utilization</h1>
      <pre>{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
    </div>
  );
}

export default CpuUtilization;
