import React, { useState } from 'react';
import TaskList from './components/Tasklist';
import './styles/app.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    console.log("Theme toggled", isDarkMode ? 'Light Mode' : 'Dark Mode');
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? 'dark-theme App' : 'light-theme App'}>
      <header>
        <button onClick={toggleTheme} className="theme-toggle-button">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <TaskList /> {/* Composant TaskList */}
    </div>
  );
}

export default App;