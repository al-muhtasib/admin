import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminMessages from './pages/AdminMessages'
import './styles/custom.scss';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');

  return (
    <Router>
      <div className="container mt-5 pt-5">
        <Routes>
          <Route path="/" element={<AdminMessages/>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/messages" element={<AdminMessages />} />
        </Routes>
      </div>
      
    </Router>
  );
}

export default App;
