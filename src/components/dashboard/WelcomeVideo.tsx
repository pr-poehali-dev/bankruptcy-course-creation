import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WelcomeVideoProps {
  files: any[];
}

export default function WelcomeVideo({ files }: WelcomeVideoProps) {
  const welcomeVideos = files.filter(f => f.isWelcomeVideo);

  if (welcomeVideos.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-0 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
            <Icon name="Play" size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Добро пожаловать!</h3>
            <p className="text-muted-foreground">Начните с приветственного видео</p>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        {welcomeVideos.map((file) => (
          <div key={file.id} className="space-y-4">
            <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden shadow-xl">
              <video 
                controls 
                className="w-full h-full"
              >
                <source src={file.fileUrl} type={file.fileType} />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            {file.description && (
              <p className="text-muted-foreground">{file.description}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
