import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Lock, Unlock, Play, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, differenceInDays } from 'date-fns';

interface Surprise {
  id: string;
  title: string;
  content: string | null;
  media_url: string | null;
  media_type: string;
  unlock_date: string;
  is_unlocked: boolean;
  created_at: string;
  profiles: {
    name: string;
  } | null;
}

interface SurprisesListProps {
  refreshTrigger: number;
}

const SurprisesList = ({ refreshTrigger }: SurprisesListProps) => {
  const [surprises, setSurprises] = useState<Surprise[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSurprises = async () => {
    try {
      const { data, error } = await supabase
        .from('surprise_messages')
        .select(`
          id,
          title,
          content,
          media_url,
          media_type,
          unlock_date,
          is_unlocked,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get user profiles separately
      const userIds = [...new Set((data || []).map(surprise => surprise.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      const surprisesWithProfiles = (data || []).map(surprise => ({
        ...surprise,
        profiles: profiles?.find(p => p.user_id === surprise.user_id) || null
      }));

      setSurprises(surprisesWithProfiles);
    } catch (error) {
      console.error('Error fetching surprises:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSurprises();
    }
  }, [user, refreshTrigger]);

  const isUnlocked = (surprise: Surprise) => {
    const unlockDate = new Date(surprise.unlock_date);
    const today = new Date();
    return surprise.is_unlocked || today >= unlockDate;
  };

  const getDaysUntilUnlock = (unlockDate: string) => {
    const unlock = new Date(unlockDate);
    const today = new Date();
    return Math.max(0, differenceInDays(unlock, today));
  };

  const renderMediaContent = (surprise: Surprise) => {
    if (!surprise.media_url || !isUnlocked(surprise)) return null;

    switch (surprise.media_type) {
      case 'image':
        return (
          <img
            src={surprise.media_url}
            alt={surprise.title}
            className="w-full max-h-64 object-cover rounded-lg mt-3"
          />
        );
      case 'video':
        return (
          <video
            src={surprise.media_url}
            controls
            className="w-full max-h-64 rounded-lg mt-3"
          />
        );
      case 'audio':
        return (
          <audio
            src={surprise.media_url}
            controls
            className="w-full mt-3"
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (surprises.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-6xl mb-4">🎁</div>
        <h3 className="text-lg font-semibold mb-2">No surprises yet</h3>
        <p className="text-muted-foreground">
          Create special messages and media that will unlock on day 50 for your reunion!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {surprises.map((surprise) => {
        const unlocked = isUnlocked(surprise);
        const daysLeft = getDaysUntilUnlock(surprise.unlock_date);

        return (
          <Card key={surprise.id} className={`${unlocked ? 'border-primary' : ''} hover:shadow-md transition-all`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  {unlocked ? (
                    <Unlock className="h-5 w-5 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span>{surprise.title}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {surprise.profiles?.name || 'Unknown'}
                  </Badge>
                  {unlocked ? (
                    <Badge variant="default" className="bg-primary">
                      Unlocked!
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {daysLeft} days left
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {unlocked ? (
                <>
                  {surprise.content && (
                    <p className="text-muted-foreground whitespace-pre-wrap mb-3">
                      {surprise.content}
                    </p>
                  )}
                  {renderMediaContent(surprise)}
                  {surprise.media_url && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(surprise.media_url!, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse-heart" />
                  <p className="text-muted-foreground">
                    This surprise will unlock on <strong>{format(new Date(surprise.unlock_date), 'MMMM d, yyyy')}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Only {daysLeft} more days to go!
                  </p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                Created {format(new Date(surprise.created_at), 'MMM d, yyyy')}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SurprisesList;