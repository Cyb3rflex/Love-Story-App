import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface NoteFormProps {
  onNoteCreated: () => void;
}

const NoteForm = ({ onNoteCreated }: NoteFormProps) => {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setCreating(true);
    try {
      const { error } = await supabase
        .from('daily_notes')
        .insert({
          user_id: user.id,
          title: title.trim() || null,
          content: content.trim()
        });

      if (error) throw error;

      toast({
        title: "Note saved!",
        description: "Your daily note has been shared."
      });

      // Reset form
      setTitle('');
      setContent('');
      onNoteCreated();
      
    } catch (error: any) {
      toast({
        title: "Failed to save note",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <span>Write a Note</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Title (optional)</Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind today?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-content">Your note</Label>
            <Textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, feelings, or what happened today..."
              rows={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!content.trim() || creating}
          >
            {creating ? 'Saving...' : 'Share Note 💌'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NoteForm;