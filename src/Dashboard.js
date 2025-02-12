import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from './firebaseConfig';
import { Line } from 'react-chartjs-2';  // Import Line chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css'; // Import the CSS file
// Register the chart components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  
  const [temp, setTempData] = useState(0);
  const [soilm, setSoilMoisture] = useState(0);
  const [water, setWaterTemp] = useState(0);
  const [hum, setHumData] = useState(0);
  const [data, setData] = useState({
    temp: [],
    soil: [],
    water: [],
    hum: []
  });
  const [timeFrame, setTimeFrame] = useState('seconds'); // default timeframe

  useEffect(() => {
    const tempRef = ref(database, 'sensors/temp');
    const soilRef = ref(database, 'sensors/soilm');
    const waterRef = ref(database, 'sensors/water');
    const humRef = ref(database, 'sensors/hum');

    onValue(tempRef, (snapshot) => {
      const tempData = snapshot.val();
      setTempData(tempData);
      updateRealTimeData('temp', tempData);
    });

    onValue(soilRef, (snapshot) => {
      const soilData = snapshot.val();
      setSoilMoisture(soilData);
      updateRealTimeData('soil', soilData);
    });

    onValue(waterRef, (snapshot) => {
      const waterData = snapshot.val();
      setWaterTemp(waterData);
      updateRealTimeData('water', waterData);
    });

    onValue(humRef, (snapshot) => {
      const humData = snapshot.val();
      setHumData(humData);
      updateRealTimeData('hum', humData);
    });

    // Clear data at specific intervals to maintain performance
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 1000); // 1-second interval for real-time data

    return () => clearInterval(interval); // Cleanup the interval on component unmount

  }, []);

  const updateRealTimeData = (sensorType, value) => {
    setData(prevData => {
      const updatedData = { ...prevData };
      const currentTime = new Date().toLocaleTimeString();
      
      if (sensorType) {
        updatedData[sensorType].push({ time: currentTime, value });
        
        // Limit data size based on selected time frame
        if (updatedData[sensorType].length > 60) {
          updatedData[sensorType].shift(); // Remove oldest data point
        }
      }
      return updatedData;
    });
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // Create chart data for the line graph
  const chartData = {
    labels: data.temp.map((_, index) => data.temp[index].time), // Use time as X-axis
    datasets: [
      {
        label: 'Temperature',
        data: data.temp.map(item => item.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1,
      },
      {
        label: 'Soil Moisture',
        data: data.soil.map(item => item.value),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
        tension: 0.1,
      },
      {
        label: 'Soil Temperature',
        data: data.water.map(item => item.value),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: true,
        tension: 0.1,
      },
      {
        label: 'Humidity',
        data: data.hum.map(item => item.value),
        borderColor: 'rgb(205, 159, 64)',
        backgroundColor: 'rgba(205, 159, 64, 0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  // Chart options to set for different timeframes
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: `Time (${timeFrame})`,
        },
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Sensor Data',
        },
      },
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  return (
    <div className="farm-container">
      <h1>Farm Irrigation Dashboard</h1>

      

      {/* Circular Progress Bars for Sensors */}
      <div className="progress-container">
        <div className="progress-item">
          <div className="progress-icon">🌡️</div>
          <p>Temperature</p>
          <CircularProgressbar value={temp} maxValue={100} text={`${temp}%`} />
        </div>
        <div className="progress-item">
          <div className="progress-icon">🌡️</div>
          <p>Humidity</p>
          <CircularProgressbar value={hum} maxValue={100} text={`${hum}%`} />
        </div>
        <div className="progress-item">
          <div className="progress-icon">💧</div>
          <p>Soil Moisture</p>
          <CircularProgressbar value={soilm} maxValue={100} text={`${soilm}%`} />
        </div>
        <div className="progress-item">
          <div className="progress-icon">🌡️</div>
          <p>Soil Temperature</p>
          <CircularProgressbar value={water} maxValue={100} text={`${water}%`} />
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="timeframe-selector">
        <button onClick={() => setTimeFrame('seconds')}>Seconds</button>
        <button onClick={() => setTimeFrame('minutes')}>Minutes</button>
        <button onClick={() => setTimeFrame('hours')}>Hours</button>
        <button onClick={() => setTimeFrame('days')}>Days</button>
        <button onClick={() => setTimeFrame('weeks')}>Weeks</button>
        <button onClick={() => setTimeFrame('months')}>Months</button>
        <button onClick={() => setTimeFrame('years')}>Years</button>
      </div>

      {/* Line Chart for Real-time Data */}
      <div className="line-chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>

      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
