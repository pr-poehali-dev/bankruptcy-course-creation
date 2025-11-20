import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export default function ProgressCard({ progress, completedLessons, totalLessons }: ProgressCardProps) {
  return (
    <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-primary via-primary to-accent text-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Ваш прогресс</h2>
            <p className="text-white/80">Курс "Банкротство физических лиц"</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{Math.round(progress)}%</div>
            <p className="text-white/80 text-sm">{completedLessons} из {totalLessons} уроков</p>
          </div>
        </div>
        <Progress value={progress} className="h-3 bg-white/20" />
      </CardContent>
    </Card>
  );
}
