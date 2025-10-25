import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

type AppState = 'login' | 'register' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppState>('login');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Check for saved session on app load
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setUserId(parseInt(savedUserId));
      setCurrentView('dashboard');
    }
  }, []);

  const handleLogin = (id: number) => {
    localStorage.setItem('userId', id.toString());
    setUserId(id);
    setCurrentView('dashboard');
  };

  const handleRegister = (id: number) => {
    localStorage.setItem('userId', id.toString());
    setUserId(id);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    setCurrentView('login');
  };

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setCurrentView('register')} 
        />
      )}
      {currentView === 'register' && (
        <Register 
          onRegister={handleRegister} 
          onSwitchToLogin={() => setCurrentView('login')} 
        />
      )}
      {currentView === 'dashboard' && userId && (
        <Dashboard 
          userId={userId} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;
