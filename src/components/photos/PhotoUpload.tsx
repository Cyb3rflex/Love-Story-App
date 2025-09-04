import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  onUploadSuccess: () => void;
}

const PhotoUpload = ({ onUploadSuccess }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // Save photo metadata to database
      const { error: dbError } = await supabase
        .from('daily_photos')
        .insert({
          user_id: user.id,
          title: title || 'Daily Photo',
          description,
          image_url: publicUrl
        });

      if (dbError) throw dbError;

      toast({
        title: "Photo uploaded!",
        description: "Your photo has been shared successfully."
      });

      // Reset form
      setTitle('');
      setDescription('');
      clearSelection();
      onUploadSuccess();
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-primary" />
          <span>Share a Photo</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo-title">Title (optional)</Label>
            <Input
              id="photo-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your photo a title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo-description">Description (optional)</Label>
            <Textarea
              id="photo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the story behind this photo..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            {!selectedFile ? (
              <div 
                className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to select a photo
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl!}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={clearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Share Photo 📸'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;