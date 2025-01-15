import React, { useState } from 'react';
import './SettingsPage.css';
import Navbar from '../components/Navbar';
function SettingsPage() {
   const [theme, setTheme] = useState('light');

   const handleThemeChange = (e) => {
     setTheme(e.target.value);
   };

    return (
      <>
          <Navbar />
        <div className="settings-page">
            <h2>Settings</h2>
             <div className="theme-section">
                <h3>Theme Settings</h3>
                <label htmlFor="theme">Select a theme</label>
               <select id="theme" value={theme} onChange={handleThemeChange}>
                    <option value='light'>Light</option>
                    <option value='dark'>Dark</option>
                </select>
             </div>
      </div>
      </>
  );
}

export default SettingsPage;