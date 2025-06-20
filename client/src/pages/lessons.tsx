import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import LessonInterface from '@/components/lesson-interface';
import { Card } from '@/components/ui/card';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { showSuccessAlert } from '@/lib/sweetalert';
import type { Dialect, Lesson, UserProgress } from '@shared/schema';

export default function Lessons() {
  const [match, params] = useRoute('/lessons/:dialectId?');
  const [, setLocation] = useLocation();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const dialectId = params?.dialectId ? parseInt(params.dialectId) : null;

  const { data: dialect } = useQuery<Dialect>({
    queryKey: [`/api/dialects/${dialectId}`],
    enabled: !!dialectId,
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: [`/api/dialects/${dialectId}/lessons`],
    enabled: !!dialectId,
  });

  const { data: progress } = useQuery<UserProgress>({
    queryKey: [`/api/user/progress/${dialectId}`],
    enabled: !!dialectId,
  });

  const completeLessonMutation = useMutation({
    mutationFn: (lessonId: number) => 
      apiRequest('POST', `/api/lessons/${lessonId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/progress'] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/progress/${dialectId}`] });
      showSuccessAlert('Lesson Complete!', 'Great job! Moving to the next lesson.');
      handleNext();
    },
  });

  if (!dialectId) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="glass-effect p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select a Dialect</h2>
          <p className="text-gray-600 mb-6">Choose a dialect from the dashboard to start learning.</p>
          <button 
            onClick={() => setLocation('/dashboard')}
            className="bg-filipino-blue text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all"
          >
            Go to Dashboard
          </button>
        </Card>
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="glass-effect p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Lessons Available</h2>
          <p className="text-gray-600 mb-6">Lessons for this dialect are coming soon!</p>
          <button 
            onClick={() => setLocation('/dashboard')}
            className="bg-filipino-blue text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
        </Card>
      </div>
    );
  }

  const currentLesson = lessons[currentLessonIndex];
  const lessonProgress = ((currentLessonIndex + 1) / lessons.length) * 100;

  const handleBack = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else {
      setLocation('/dashboard');
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      setLocation('/dashboard');
    }
  };

  const handleComplete = () => {
    if (currentLesson) {
      completeLessonMutation.mutate(currentLesson.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <LessonInterface
        lesson={currentLesson}
        onBack={handleBack}
        onNext={handleNext}
        onComplete={handleComplete}
        progress={lessonProgress}
      />
    </motion.div>
  );
}
