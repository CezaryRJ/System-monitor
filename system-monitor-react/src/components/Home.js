import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000' + '/')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching root API:', error));
  }, []);

  return (
    <div>
      <h1>System Monitor</h1>
      <pre>{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
    </div>
  );
}

export default Home;
