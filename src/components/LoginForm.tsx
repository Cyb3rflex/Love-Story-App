import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onLogin: (name: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && password) {
      // For demo purposes - in real app, this would authenticate with Supabase
      onLogin(selectedUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="text-4xl animate-pulse-heart mb-2">💝</div>
          <CardTitle className="text-2xl font-bold text-gradient-romantic">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your love story
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">Who are you?</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={selectedUser === 'David' ? 'default' : 'outline'}
                  onClick={() => setSelectedUser('David')}
                  className="h-12"
                >
                  💙 David
                </Button>
                <Button
                  type="button"
                  variant={selectedUser === 'Shalom' ? 'default' : 'outline'}
                  onClick={() => setSelectedUser('Shalom')}
                  className="h-12"
                >
                  🌸 Shalom
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-romantic hover:opacity-90 animate-glow-romantic"
              disabled={!selectedUser || !password}
            >
              Enter Our World 💕
            </Button>
          </form>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg text-center text-sm text-muted-foreground">
            <p className="mb-2">🔒 <strong>Ready for the real deal?</strong></p>
            <p>Connect to Supabase to enable secure authentication, photo sharing, and surprise message storage!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;