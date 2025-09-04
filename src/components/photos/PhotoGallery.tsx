import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface Photo {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  upload_date: string;
  created_at: string;
  profiles: {
    name: string;
  } | null;
}

interface PhotoGalleryProps {
  refreshTrigger: number;
}

const PhotoGallery = ({ refreshTrigger }: PhotoGalleryProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_photos')
        .select(`
          id,
          title,
          description,
          image_url,
          upload_date,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get user profiles separately
      const userIds = [...new Set((data || []).map(photo => photo.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      const photosWithProfiles = (data || []).map(photo => ({
        ...photo,
        profiles: profiles?.find(p => p.user_id === photo.user_id) || null
      }));

      setPhotos(photosWithProfiles);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPhotos();
    }
  }, [user, refreshTrigger]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-lg font-semibold mb-2">No photos yet</h3>
        <p className="text-muted-foreground">
          Start sharing your daily adventures! Upload your first photo to begin building your reunion story.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square overflow-hidden">
            <img
              src={photo.image_url}
              alt={photo.title || 'Daily photo'}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm line-clamp-1">
                {photo.title || 'Daily Photo'}
              </h4>
              <Badge variant="secondary" className="text-xs">
                {photo.profiles?.name || 'Unknown'}
              </Badge>
            </div>
            {photo.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {photo.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(photo.created_at), { addSuffix: true })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PhotoGallery;