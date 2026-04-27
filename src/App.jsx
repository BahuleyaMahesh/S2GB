import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CitizenReporter from './pages/CitizenReporter';
import ResponderDashboard from './pages/ResponderDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitizenReporter />} />
        <Route path="/responder" element={<ResponderDashboard />} />
        <Route path="/incidents" element={<ResponderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
