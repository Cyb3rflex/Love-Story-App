import { useState } from 'react';
import FloatingHearts from '@/components/FloatingHearts';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const handleLogin = (name: string) => {
    setCurrentUser(name);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="relative min-h-screen">
      <FloatingHearts />
      
      <div className="relative z-10">
        {currentUser ? (
          <Dashboard currentUser={currentUser} onLogout={handleLogout} />
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
};

export default Index;
