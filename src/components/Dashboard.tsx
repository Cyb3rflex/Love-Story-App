import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from './CountdownTimer';
import { Heart, Camera, MessageCircle, Gift, LogOut } from 'lucide-react';

interface DashboardProps {
  currentUser: string;
  onLogout: () => void;
}

const Dashboard = ({ currentUser, onLogout }: DashboardProps) => {
  const [surpriseCount] = useState(3); // Demo data

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-2xl animate-pulse-heart">💝</div>
          <h2 className="text-xl font-semibold">
            Welcome back, <span className="text-gradient-romantic">{currentUser}</span>!
          </h2>
        </div>
        <Button variant="outline" onClick={onLogout} size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Countdown Section */}
      <div className="mb-8">
        <CountdownTimer />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="memories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
            <TabsTrigger value="memories" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Our Memories</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Daily Notes</span>
            </TabsTrigger>
            <TabsTrigger value="surprises" className="flex items-center space-x-2">
              <Gift className="h-4 w-4" />
              <span>Day 50 Surprises</span>
              {surpriseCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                  {surpriseCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="memories">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5 text-primary" />
                  <span>Shared Photo Gallery</span>
                </CardTitle>
                <CardDescription>
                  Upload and share daily photos of your adventures apart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center bg-gradient-sunset">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Photo sharing will be available once you connect to Supabase!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Upload daily photos, see each other's adventures instantly, and build your reunion story together.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span>Daily Love Notes</span>
                </CardTitle>
                <CardDescription>
                  Share thoughts, feelings, and little moments with each other
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center bg-gradient-sunset">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Message sharing will be available once you connect to Supabase!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Write daily notes, share feelings, and stay connected until you're back together.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surprises">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <span>Day 50 Surprise Vault</span>
                </CardTitle>
                <CardDescription>
                  Special messages and videos that unlock on reunion day
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-romantic text-primary-foreground p-6 rounded-lg text-center">
                  <Gift className="h-16 w-16 mx-auto mb-4 animate-pulse-heart" />
                  <h3 className="text-lg font-semibold mb-2">🎁 Something Special Awaits</h3>
                  <p className="mb-4">
                    Create surprise videos and messages that will unlock automatically on day 50!
                  </p>
                  <p className="text-sm opacity-90">
                    Connect to Supabase to start creating your reunion surprises ✨
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;