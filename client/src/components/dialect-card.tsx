import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ProgressRing from './progress-ring';
import type { Dialect, UserProgress } from '@shared/schema';

interface DialectCardProps {
  dialect: Dialect;
  progress?: UserProgress;
  onClick: () => void;
}

export default function DialectCard({ dialect, progress, onClick }: DialectCardProps) {
  const progressPercentage = progress?.progress || 0;
  const lessonsCompleted = progress?.lessonsCompleted || 0;
  
  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case 'filipino-blue': return '#2563EB';
      case 'filipino-red': return '#DC2626';
      case 'filipino-yellow': return '#F59E0B';
      case 'green-500': return '#10B981';
      default: return '#2563EB';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className="lesson-card glass-effect p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">{dialect.name}</h3>
          <ProgressRing 
            progress={progressPercentage} 
            color={getColorValue(dialect.color)}
          />
        </div>
        <p className="text-muted-foreground mb-4">{dialect.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {lessonsCompleted}/{dialect.totalLessons} lessons
          </span>
          <ArrowRight className={`text-lg transition-colors`} style={{ color: getColorValue(dialect.color) }} />
        </div>
      </Card>
    </motion.div>
  );
}
