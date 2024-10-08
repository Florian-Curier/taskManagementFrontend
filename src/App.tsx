import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TaskList from './components/Tasklist';
import { Signin } from './pages/signin';
import './styles/app.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className={isDarkMode ? 'dark-theme App' : 'light-theme App'}>
        <header>
          <button onClick={toggleTheme} className="theme-toggle-button">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <nav>
            <Link to="/tasks">Tasks</Link>
            <Link to="/signin">Sign In</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="*" element={<TaskList />} />  {/* Route par défaut si URL non trouvée */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;