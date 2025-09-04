import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from './CountdownTimer';
import PhotoUpload from './photos/PhotoUpload';
import PhotoGallery from './photos/PhotoGallery';
import NoteForm from './notes/NoteForm';
import NotesList from './notes/NotesList';
import SurpriseForm from './surprises/SurpriseForm';
import SurprisesList from './surprises/SurprisesList';
import { useAuth } from '@/hooks/useAuth';
import { Camera, MessageCircle, Gift, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [photoRefresh, setPhotoRefresh] = useState(0);
  const [noteRefresh, setNoteRefresh] = useState(0);
  const [surpriseRefresh, setSurpriseRefresh] = useState(0);

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-2xl animate-pulse-heart">💝</div>
          <h2 className="text-xl font-semibold">
            Welcome back, <span className="text-gradient-romantic">{user.user_metadata?.name || 'Love'}</span>!
          </h2>
        </div>
        <Button variant="outline" onClick={signOut} size="sm">
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
            </TabsTrigger>
          </TabsList>

          <TabsContent value="memories" className="space-y-6">
            <PhotoUpload onUploadSuccess={() => setPhotoRefresh(prev => prev + 1)} />
            <div>
              <h3 className="text-lg font-semibold mb-4">Shared Photos</h3>
              <PhotoGallery refreshTrigger={photoRefresh} />
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <NoteForm onNoteCreated={() => setNoteRefresh(prev => prev + 1)} />
            <div>
              <h3 className="text-lg font-semibold mb-4">Daily Notes</h3>
              <NotesList refreshTrigger={noteRefresh} />
            </div>
          </TabsContent>

          <TabsContent value="surprises" className="space-y-6">
            <SurpriseForm onSurpriseCreated={() => setSurpriseRefresh(prev => prev + 1)} />
            <div>
              <h3 className="text-lg font-semibold mb-4">Surprise Vault</h3>
              <SurprisesList refreshTrigger={surpriseRefresh} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;