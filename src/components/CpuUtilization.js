import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { GaugeComponent } from 'react-gauge-component';


function gague(data){
 return <GaugeComponent value = {data} minvalue = "0" maxvalue = "100"  style={{ width: '50%', height: '50%' }}/>
}

function CpuUtilization() {
  const [data, setData] = useState(null);

  useEffect(() => {


    const fetchData = async () => { 
      axios.get('http://localhost:3000/cpu-utilization')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching CPU utilization:', error));
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000); // Fetch data every second

    // Fetch data immediately on mount
    fetchData();

    //Component with default values
    

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {gague(Number(data["utilization"]["overallLoad"].slice(0, -1)))}
      {Number(data["utilization"]["overallLoad"].slice(0, -1))}
      
      <h1>CPU Utilization</h1>
      <pre >{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
    </div>
  );
}

export default CpuUtilization;
