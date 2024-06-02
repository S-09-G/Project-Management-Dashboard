import React from 'react';
import { useTheme } from './ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div>
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />
          Dark Mode
        </label>
      </div>
    </div>
  );
};

export default Settings;
