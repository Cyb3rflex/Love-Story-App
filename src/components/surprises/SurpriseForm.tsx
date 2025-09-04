import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SurpriseFormProps {
  onSurpriseCreated: () => void;
}

const SurpriseForm = ({ onSurpriseCreated }: SurpriseFormProps) => {
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'text' | 'image' | 'video' | 'audio'>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Calculate unlock date (50 days from now)
  const unlockDate = new Date();
  unlockDate.setDate(unlockDate.getDate() + 50);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    if (mediaType !== 'text' && !selectedFile && !content.trim()) return;

    setCreating(true);
    try {
      let mediaUrl = null;

      // Upload file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}/surprises/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('surprises')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('surprises')
          .getPublicUrl(fileName);
        
        mediaUrl = publicUrl;
      }

      // Save surprise to database
      const { error } = await supabase
        .from('surprise_messages')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim() || null,
          media_url: mediaUrl,
          media_type: mediaType,
          unlock_date: unlockDate.toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Surprise created!",
        description: `Your surprise will unlock on day 50 (${unlockDate.toDateString()}).`
      });

      // Reset form
      setTitle('');
      setContent('');
      setMediaType('text');
      clearFile();
      onSurpriseCreated();
      
    } catch (error: any) {
      toast({
        title: "Failed to create surprise",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const acceptedFileTypes = {
    image: 'image/*',
    video: 'video/*',
    audio: 'audio/*'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-primary" />
          <span>Create a Day 50 Surprise</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="surprise-title">Title</Label>
            <Input
              id="surprise-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your surprise a special title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="media-type">Surprise Type</Label>
            <Select value={mediaType} onValueChange={(value: any) => setMediaType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Message</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="surprise-content">Message</Label>
            <Textarea
              id="surprise-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a heartfelt message that will be revealed on day 50..."
              rows={4}
              required={mediaType === 'text'}
            />
          </div>

          {mediaType !== 'text' && (
            <div className="space-y-2">
              <Label>Media File</Label>
              {!selectedFile ? (
                <div 
                  className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to select a {mediaType} file
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max file size: 10MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {previewUrl && mediaType === 'image' && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                  )}
                  {previewUrl && mediaType === 'video' && (
                    <video
                      src={previewUrl}
                      className="w-full max-h-64 rounded-lg"
                      controls
                    />
                  )}
                  {mediaType === 'audio' && (
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm">Audio file: {selectedFile.name}</p>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={clearFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFileTypes[mediaType as keyof typeof acceptedFileTypes]}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              🔒 This surprise will automatically unlock on <strong>{unlockDate.toDateString()}</strong> (Day 50) and be revealed to both of you!
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!title.trim() || creating || (mediaType !== 'text' && !selectedFile && !content.trim())}
          >
            {creating ? 'Creating...' : 'Create Surprise 🎁'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SurpriseForm;