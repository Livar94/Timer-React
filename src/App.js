import React, {useState} from 'react';
import DisplayComponent from './Components/DisplayComponent';
import BtnComponent from './Components/BtnComponent';
import './App.css';
import { v4 as uuidv4 } from 'uuid';


function App() {
  const [time, setTime] = useState({ms:0, s:0, m:0, h:0});
  const [interv, setInterv] = useState();
  const [status, setStatus] = useState(0);
  const [savedTimes, setSavedTimes] = useState([]);






  const start = () => {
    run();
    setStatus(1);
    setInterv(setInterval(run, 10));
  };

  var updatedMs = time.ms, updatedS = time.s, updatedM = time.m, updatedH = time.h;

 

  const run = () => {

    if(updatedM === 60){

      updatedH++;

      updatedM = 0;

    }

    if(updatedS === 60){

      updatedM++;

      updatedS = 0;

    }

    if(updatedMs === 100){

      updatedS++;

      updatedMs = 0;

    }

    updatedMs++;

    return setTime({ms:updatedMs, s:updatedS, m:updatedM, h:updatedH});

  };

  const stop = () => {
    clearInterval(interv);
    setStatus(2);
  };

  const reset = () => {
    clearInterval(interv);
    setStatus(0);
    setTime({ms:0, s:0, m:0, h:0})
  };

  const resume = () => start();

  

  const getSavedTimes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/timer/get', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSavedTimes(data);
    } catch (error) {
      alert('Failed to fetch saved times');
    }
  };

  const saveTime = async () => {
    try {
      const timerId = uuidv4(); 
      const timeString = timeToString(time);
      const requestBody = {
        time: timeString,
        timerId: timerId, 
      };

      const response = await fetch('http://localhost:8080/api/timer/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      alert('Time saved successfully');
    } catch (error) {
      alert('Failed to save time');
    }
  };


const timeToString = (time) => {
  return `${time.h.toString().padStart(2, '0')}:${time.m.toString().padStart(2, '0')}:${time.s.toString().padStart(2, '0')}:${time.ms.toString().padStart(2, '0')}`;
}


return (
  <div className="main-section">
    <div className="clock-holder">
      <div className="stopwatch">
        <DisplayComponent time={time} />
        <BtnComponent status={status} resume={resume} reset={reset} stop={stop} start={start} />
        <button onClick={getSavedTimes} className='get-saved-btn'>Get Times</button>
        <button onClick={saveTime} className='save-btn'>Save Time</button>
      </div>
      <div className="right-side">
        <h2 className='h1-time'>Saved Times</h2>
        <ul>
          {savedTimes.map((time, index) => (
            <li key={index}>{time}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
}

export default App;