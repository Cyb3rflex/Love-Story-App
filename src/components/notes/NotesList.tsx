import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow, format } from 'date-fns';

interface Note {
  id: string;
  title: string | null;
  content: string;
  note_date: string;
  created_at: string;
  profiles: {
    name: string;
  } | null;
}

interface NotesListProps {
  refreshTrigger: number;
}

const NotesList = ({ refreshTrigger }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_notes')
        .select(`
          id,
          title,
          content,
          note_date,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get user profiles separately
      const userIds = [...new Set((data || []).map(note => note.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      const notesWithProfiles = (data || []).map(note => ({
        ...note,
        profiles: profiles?.find(p => p.user_id === note.user_id) || null
      }));

      setNotes(notesWithProfiles);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-6xl mb-4">💌</div>
        <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
        <p className="text-muted-foreground">
          Start sharing your daily thoughts and feelings. Write your first note to stay connected!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">
                {note.title || format(new Date(note.note_date), 'EEEE, MMMM d')}
              </CardTitle>
              <Badge variant="secondary">
                {note.profiles?.name || 'Unknown'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap mb-3">
              {note.content}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {format(new Date(note.note_date), 'MMM d, yyyy')}
              </span>
              <span>
                {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotesList;