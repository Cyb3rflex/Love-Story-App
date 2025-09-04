import FloatingHearts from '@/components/FloatingHearts';
import AuthForm from '@/components/auth/AuthForm';
import Dashboard from '@/components/Dashboard';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-pulse-heart mb-4">💝</div>
          <p className="text-muted-foreground">Loading your love story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <FloatingHearts />
      
      <div className="relative z-10">
        {user ? (
          <Dashboard />
        ) : (
          <AuthForm />
        )}
      </div>
    </div>
  );
};

export default Index;
