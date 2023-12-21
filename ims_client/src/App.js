import { SpeedInsights } from "@vercel/speed-insights/react"
import { inject } from '@vercel/analytics';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main/Main';
import Dashboard from './components/Dashboard/Dashboard';
import MainContent from './components/Main/MainContent';

function App() {
  const [backendData, setBackendData] = useState([{}]);
  
  useEffect(()=>{
    fetch(`https://localhost:5600/data`).then(
//    fetch(`https://localhost:${process.env.MSPORT}/data`).then(
      response=>response.json()
    ).then(
      data=>setBackendData(data)
    )
  },[])
  console.log(backendData.results);

  return (
    <Router>
      <Main>
        <Routes>
          <Route path="/dashboard" element={<Dashboard data={backendData} />} />
          <Route path="/" element={<MainContent data={backendData} />} />
        </Routes>
      </Main>
    </Router>
  )
}
inject();
SpeedInsights();
export default App