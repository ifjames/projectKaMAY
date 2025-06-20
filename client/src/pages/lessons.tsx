import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BookOpen, Trophy, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import LessonInterface from '@/components/lesson-interface';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { showSuccessAlert, showQuizFeedback } from '@/lib/sweetalert';
import type { Dialect, Lesson, UserProgress } from '@shared/schema';

export default function Lessons() {
  const [match, params] = useRoute('/lessons/:dialectId?');
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<'list' | 'lesson' | 'quiz'>('list');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [mascotMessage, setMascotMessage] = useState("Kumusta! Ready to learn some Filipino dialects?");

  const dialectId = params?.dialectId ? parseInt(params.dialectId) : null;

  const { data: dialects, isLoading: dialectsLoading } = useQuery<Dialect[]>({
    queryKey: ['/api/dialects'],
  });

  const { data: progressData, isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ['/api/user/progress'],
  });

  const completeLessonMutation = useMutation({
    mutationFn: (lessonId: number) => 
      apiRequest('POST', `/api/lessons/${lessonId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/progress'] });
      showSuccessAlert('Lesson Complete!', 'Great job! Moving to the next lesson.');
      setCurrentView('list');
      setMascotMessage("Excellent work! You're making great progress!");
    },
  });

  // Get all lessons for all dialects
  const lessonQueries = dialects?.map(dialect => 
    useQuery<Lesson[]>({
      queryKey: [`/api/dialects/${dialect.id}/lessons`],
      enabled: !!dialect,
    })
  );

  if (dialectsLoading || progressLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-effect animate-pulse">
              <CardContent className="p-8">
                <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    );
  }

  const getProgressForDialect = (dialectId: number) => {
    return progressData?.find(p => p.dialectId === dialectId);
  };

  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lesson');
    setMascotMessage(`Let's learn about ${lesson.title}! Listen carefully and practice.`);
  };

  const handleQuizClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('quiz');
    setSelectedAnswer(null);
    setMascotMessage("Time for a quiz! Show me what you've learned!");
  };

  const handleQuizAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const isCorrect = selectedLesson?.quiz?.[0]?.correctAnswer === optionIndex;
    showQuizFeedback(isCorrect);
    
    if (isCorrect) {
      setMascotMessage("Perfect! You really understood that lesson!");
      setTimeout(() => {
        setCurrentView('list');
        setMascotMessage("Ready for more learning? Pick another lesson!");
      }, 2000);
    } else {
      setMascotMessage("Don't worry! Try reviewing the lesson again.");
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedLesson(null);
    setMascotMessage("What would you like to learn next?");
  };

  const handleCompleteLesson = () => {
    if (selectedLesson) {
      completeLessonMutation.mutate(selectedLesson.id);
    }
  };

  if (currentView === 'lesson' && selectedLesson) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <LessonInterface
          lesson={selectedLesson}
          onBack={handleBackToList}
          onNext={handleBackToList}
          onComplete={handleCompleteLesson}
          progress={75}
        />
      </motion.div>
    );
  }

  if (currentView === 'quiz' && selectedLesson) {
    const quiz = selectedLesson.quiz?.[0];
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto px-4"
      >
        <Card className="glass-effect">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                size="sm"
                className="glass-effect hover:bg-white hover:bg-opacity-20"
                onClick={handleBackToList}
              >
                <ArrowLeft className="text-gray-700" />
              </Button>
              <h2 className="text-2xl font-bold text-gray-800">Quiz: {selectedLesson.title}</h2>
              <Trophy className="text-filipino-yellow text-2xl" />
            </div>
            
            {quiz && (
              <div className="bg-white bg-opacity-50 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-gray-800 mb-6">{quiz.question}</h4>
                
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {quiz.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`glass-effect p-4 rounded-xl text-left transition-all group ${
                        selectedAnswer === index 
                          ? 'bg-filipino-blue bg-opacity-20' 
                          : 'hover:bg-filipino-blue hover:bg-opacity-20'
                      }`}
                      onClick={() => handleQuizAnswer(index)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 border-2 rounded-full transition-colors ${
                          selectedAnswer === index
                            ? 'bg-filipino-blue border-filipino-blue'
                            : 'border-gray-300 group-hover:border-filipino-blue'
                        }`} />
                        <span className="font-medium text-gray-700">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      {/* Mascot Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-effect rounded-3xl p-6 mb-8"
      >
        <div className="flex items-center space-x-6">
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-filipino-yellow via-filipino-red to-filipino-blue rounded-full flex items-center justify-center relative overflow-hidden">
              {/* Placeholder mascot - cute Filipino character */}
              <div className="text-white text-2xl">🇵🇭</div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white bg-opacity-20 rounded-full"
              />
            </div>
            <motion.div
              animate={{ scale: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-filipino-red rounded-full"
            />
          </motion.div>
          <div className="flex-1">
            <div className="glass-effect rounded-2xl p-4 relative">
              <motion.p
                key={mascotMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-gray-800 font-medium"
              >
                {mascotMessage}
              </motion.p>
              <MessageCircle className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-white drop-shadow-lg" />
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="text-filipino-red text-xl" />
          </motion.div>
        </div>
      </motion.div>

      {/* Lessons by Dialect */}
      <div className="space-y-8">
        {dialects?.map((dialect, dialectIndex) => {
          const dialectLessons = lessonQueries?.[dialectIndex]?.data || [];
          const progress = getProgressForDialect(dialect.id);
          
          return (
            <motion.div
              key={dialect.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: dialectIndex * 0.1 }}
            >
              <Card className="glass-effect">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center`}
                        style={{ backgroundColor: dialect.color === 'filipino-blue' ? '#2563EB' : 
                                                   dialect.color === 'filipino-red' ? '#DC2626' :
                                                   dialect.color === 'filipino-yellow' ? '#F59E0B' : '#10B981' }}
                      >
                        <BookOpen className="text-white text-xl" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{dialect.name}</h3>
                        <p className="text-gray-600">{dialect.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="glass-effect">
                      {progress?.lessonsCompleted || 0}/{dialect.totalLessons || 0} completed
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {dialectLessons.map((lesson, lessonIndex) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: lessonIndex * 0.05 }}
                        className="glass-effect rounded-xl p-4 hover:bg-white hover:bg-opacity-30 transition-all group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm font-bold text-gray-500 w-12">
                              #{lesson.lessonNumber}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 group-hover:text-filipino-blue transition-colors">
                                {lesson.title}
                              </h4>
                              <p className="text-sm text-gray-600">{lesson.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="glass-effect hover:bg-filipino-blue hover:text-white"
                              onClick={() => handleLessonClick(lesson)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Learn
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="glass-effect hover:bg-filipino-yellow hover:text-white"
                              onClick={() => handleQuizClick(lesson)}
                            >
                              <Trophy className="w-4 h-4 mr-2" />
                              Quiz
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
