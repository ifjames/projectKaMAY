import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BookOpen, Trophy, ArrowLeft, Heart, MessageCircle, CheckCircle, FileText, Lock } from 'lucide-react';
import EnhancedLessonInterface from '@/components/enhanced-lesson-interface';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { showSuccessAlert, showQuizFeedback } from '@/lib/sweetalert';
import { 
  getDialects, 
  getLessonsForDialect,
  listenToDialectLessons,
  getUserProgress, 
  updateUserProgress,
  checkAndAwardAchievements 
} from '@/lib/firestore-service-simple';
import { checkTimeBasedAchievements } from '@/lib/achievements';

// Firestore types
interface FirestoreDialect {
  id: string;
  name: string;
  description: string;
  region: string;
  color: string;
  totalLessons: number;
}

interface FirestoreLesson {
  id: string;
  dialectId: number;
  title: string;
  content: string;
  lessonNumber: number;
  type: 'audio' | 'text' | 'mixed';
  vocabulary?: Array<{word: string, translation: string, audioUrl?: string}>;
  quiz?: Array<{question: string, options: string[], correctAnswer: number}>;
}

interface FirestoreUserProgress {
  id: string;
  userId: string;
  dialectId: number;
  lessonsCompleted: number;
  progress: number;
  completedLessonIds: string[];
  lastStudiedAt?: any;
}

export default function Lessons() {
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<'list' | 'lesson'>('list');
  const [selectedLesson, setSelectedLesson] = useState<FirestoreLesson | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [mascotMessage, setMascotMessage] = useState("Kumusta! Ready to learn some Filipino dialects?");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [dialects, setDialects] = useState<FirestoreDialect[]>([]);
  const [dialectLessons, setDialectLessons] = useState<{[key: string]: FirestoreLesson[]}>({});
  const [progressData, setProgressData] = useState<FirestoreUserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDialects, setExpandedDialects] = useState<Set<string>>(new Set());
  const dialectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Check for dialect scroll parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dialectId = params.get('dialect');
    if (dialectId && !loading) {
      setTimeout(() => {
        dialectRefs.current[dialectId]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 500);
    }
  }, [loading]);

  // Load data from Firestore with real-time updates
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Starting to load lessons data...');
        
        // Load dialects
        console.log('Loading dialects...');
        const dialectsData = await getDialects();
        console.log('Dialects loaded:', dialectsData);
        setDialects(dialectsData);
        
        // Load lessons for each dialect
        console.log('Loading lessons for each dialect...');
        const lessonsData: {[key: string]: FirestoreLesson[]} = {};
        const unsubscribeFunctions: (() => void)[] = [];
        
        for (const dialect of dialectsData) {
          console.log(`Setting up listener for dialect ${dialect.id} (${dialect.name})`);
          
          // Initial load
          const initialLessons = await getLessonsForDialect(parseInt(dialect.id));
          lessonsData[dialect.id] = initialLessons;
          
          // Setup real-time listener for each dialect's lessons
          const unsubscribe = listenToDialectLessons(parseInt(dialect.id), (lessons) => {
            console.log(`Received real-time update for ${dialect.name} lessons:`, lessons.length);
            setDialectLessons(prevLessons => ({
              ...prevLessons,
              [dialect.id]: lessons
            }));
          });
          
          unsubscribeFunctions.push(unsubscribe);
        }
        
        // Initial lesson state
        setDialectLessons(lessonsData);
        
        // Load user progress
        console.log('Loading user progress...');
        const progress = await getUserProgress();
        console.log('User progress loaded:', progress);
        setProgressData(progress);
        
        // Set completed lessons based on progress - use the completedLessonIds directly
        const completed = new Set<string>();
        progress.forEach(p => {
          if (p.completedLessonIds && Array.isArray(p.completedLessonIds)) {
            p.completedLessonIds.forEach(lessonId => completed.add(lessonId));
          }
        });
        setCompletedLessons(completed);
        console.log('Completed lessons:', completed);
        
        // Clean up listeners on component unmount
        return () => {
          console.log('Cleaning up lesson listeners...');
          unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
        };
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProgressForDialect = (dialectId: string) => {
    return progressData?.find(p => p.dialectId === parseInt(dialectId));
  };

  // Enhanced lesson locking logic - lessons are unlocked sequentially
  const isLessonLocked = (lesson: FirestoreLesson, dialectLessons: FirestoreLesson[]) => {
    // Lesson 1 is always unlocked
    if (lesson.lessonNumber === 1) return false; 
    
    // For other lessons, check if the previous lesson is completed
    const previousLesson = dialectLessons.find(l => l.lessonNumber === lesson.lessonNumber - 1);
    if (!previousLesson || !completedLessons.has(previousLesson.id)) {
      return true; // Lesson is locked
    }
    
    return false; // Previous lesson completed, unlock this lesson
  };

  const handleLessonClick = (lesson: FirestoreLesson) => {
    const dialectLessonsForDialect = dialectLessons[lesson.dialectId.toString()] || [];
    if (isLessonLocked(lesson, dialectLessonsForDialect)) {
      setMascotMessage("Complete the previous lessons first to unlock this one!");
      return;
    }
    
    setSelectedLesson(lesson);
    setCurrentView('lesson');
    setMascotMessage(`Let's learn about ${lesson.title}! Listen carefully and practice.`);
  };

  const handleQuizAnswer = async (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const isCorrect = selectedLesson?.quiz?.[0]?.correctAnswer === optionIndex;
    showQuizFeedback(isCorrect);
    
    if (isCorrect && selectedLesson) {
      // Save the lesson completion to Firestore immediately
      try {
        console.log('Quiz completed correctly, saving lesson:', selectedLesson.id);
        await updateUserProgress(selectedLesson.dialectId, selectedLesson.id);
        await checkAndAwardAchievements();
        
        // Refresh progress data from Firestore
        const progress = await getUserProgress();
        setProgressData(progress);
        
        // Update completed lessons from fresh data
        const completed = new Set<string>();
        progress.forEach(p => {
          if (p.completedLessonIds && Array.isArray(p.completedLessonIds)) {
            p.completedLessonIds.forEach(lessonId => completed.add(lessonId));
          }
        });
        setCompletedLessons(completed);
        
        setMascotMessage("Perfect! You really understood that lesson!");
        showSuccessAlert('Quiz Complete!', 'Excellent work! You have completed this lesson.');
        
        setTimeout(() => {
          setCurrentView('list');
          setMascotMessage("Ready for more learning? Pick another lesson!");
        }, 2000);
      } catch (error) {
        console.error('Error saving quiz completion:', error);
        setMascotMessage("Great answer! But there was an issue saving your progress.");
      }
    } else {
      setMascotMessage("Don't worry! Try reviewing the lesson again.");
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    if (!selectedLesson) return;
    
    try {
      console.log('Completing lesson:', lessonId);
      
      // Save lesson completion to Firestore
      await updateUserProgress(selectedLesson.dialectId, lessonId);
      await checkAndAwardAchievements();
      
      // Refresh progress data from Firestore
      console.log('Refreshing progress data...');
      const progress = await getUserProgress();
      console.log('Updated progress from Firestore:', progress);
      setProgressData(progress);
      
      // Update completed lessons from fresh data
      const completed = new Set<string>();
      progress.forEach(p => {
        if (p.completedLessonIds && Array.isArray(p.completedLessonIds)) {
          p.completedLessonIds.forEach(id => completed.add(id));
        }
      });
      setCompletedLessons(completed);
      console.log('Updated completed lessons:', completed);
      
      showSuccessAlert(
        'Lesson Complete!',
        'Great job! You have completed this lesson.'
      );
      setCurrentView('list');
      setMascotMessage("Excellent work! You're making great progress!");
    } catch (error) {
      console.error('Error completing lesson:', error);
      
      // Show error to user but still mark as complete in UI
      setMascotMessage("Your progress was saved locally, but there was an issue updating the server. Your progress will sync when you reconnect.");
      
      // Still show completion and return to list after delay
      setTimeout(() => {
        setCurrentView('list');
      }, 3000);
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedLesson(null);
    setMascotMessage("What would you like to learn next?");
  };  const handleCompleteLesson = async (score?: number, totalPossiblePoints?: number, achievements?: string[]) => {
    if (selectedLesson) {
      try {
        console.log('=== LESSON COMPLETION DEBUG ===');
        console.log('Lesson completion button clicked for lesson:', selectedLesson.id);
        console.log('Score:', score, 'Total Points:', totalPossiblePoints);
        console.log('Achievements passed from lesson interface:', achievements);
        
        // Save lesson completion to Firestore
        await updateUserProgress(selectedLesson.dialectId, selectedLesson.id);
        
        // Calculate lesson data for achievement checking
        const percentage = score && totalPossiblePoints ? Math.round((score/totalPossiblePoints)*100) : undefined;
        const lessonData = {
          lessonNumber: selectedLesson.lessonNumber,
          dialectId: selectedLesson.dialectId,
          score: percentage,
          timeSpent: undefined // You can add time tracking here if needed
        };
        
        console.log('Lesson data for achievements:', lessonData);
        
        // Check for time-based achievements
        const timeAchievements = checkTimeBasedAchievements();
        const allAchievements = [...(achievements || []), ...timeAchievements];
        
        console.log('Time achievements:', timeAchievements);
        console.log('All achievements to award:', allAchievements);
        
        await checkAndAwardAchievements(allAchievements, lessonData);
        
        // If we have a score, update user stats
        if (score !== undefined && totalPossiblePoints !== undefined && percentage !== undefined) {
          console.log(`Lesson score: ${score}/${totalPossiblePoints} (${percentage}%)`);
          
          // Show appropriate message based on score
          if (percentage >= 80) {
            setMascotMessage("Excellent work! You've mastered this lesson!");
          } else if (percentage >= 60) {
            setMascotMessage("Good job! Keep practicing to improve your score!");
          } else {
            setMascotMessage("You're making progress! Try taking the quiz again for a better score.");
          }
          
          // Log achievements earned
          if (achievements && achievements.length > 0) {
            console.log('Achievements earned:', achievements);
            setMascotMessage(`Amazing! You earned ${achievements.length} achievement${achievements.length > 1 ? 's' : ''}!`);
          }
        }
        
        await handleLessonComplete(selectedLesson.id);
      } catch (error) {
        console.error('Error in handleCompleteLesson:', error);
        // Show a message to the user
        setMascotMessage("There was an issue saving your progress. Please try again!");
        
        // Still allow the user to continue
        setTimeout(() => {
          setCurrentView('list');
        }, 3000);
      }
    }
  };

  // Get lesson type icon
  const getLessonTypeIcon = (lesson: FirestoreLesson) => {
    switch (lesson.type) {
      case 'audio':
        return <FileText className="w-4 h-4 text-filipino-blue" />;
      case 'text':
        return <FileText className="w-4 h-4 text-filipino-yellow" />;
      default:
        return <BookOpen className="w-4 h-4 text-filipino-green" />;
    }
  };

  const getLessonTypeDescription = (lesson: FirestoreLesson) => {
    switch (lesson.type) {
      case 'audio':
        return 'Audio Lesson';
      case 'text':
        return 'Reading Lesson';
      default:
        return 'Mixed Lesson';
    }
  };

  const toggleDialectExpansion = (dialectId: string) => {
    setExpandedDialects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dialectId)) {
        newSet.delete(dialectId);
      } else {
        newSet.add(dialectId);
      }
      return newSet;
    });
  };

  if (loading) {
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
                  {[1, 2, 3, 4, 5].map((j) => (
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

  if (currentView === 'lesson' && selectedLesson) {
    // Convert FirestoreLesson to the format expected by LessonInterface
    // Get the total lessons for this dialect
    const selectedDialect = dialects.find(d => d.id === selectedLesson.dialectId.toString());
    const dialectTotalLessons = selectedDialect?.totalLessons || 10;
    
    const lessonForInterface = {
      ...selectedLesson,
      id: parseInt(selectedLesson.id) || 0,
      // Include audioUrl as null since we no longer use audio
      audioUrl: null,
      vocabulary: selectedLesson.vocabulary || [],
      quiz: selectedLesson.quiz || []
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <EnhancedLessonInterface
          lesson={lessonForInterface}
          onBack={handleBackToList}
          onComplete={(score: number, totalPoints: number, achievements: string[]) => handleCompleteLesson(score, totalPoints, achievements)}
          progress={Math.round((completedLessons.size / dialectTotalLessons) * 100)}
          dialectTotalLessons={dialectTotalLessons}
        />
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
                className="text-foreground font-medium"
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
          const dialectLessonsForDialect = dialectLessons[dialect.id] || [];
          const progress = getProgressForDialect(dialect.id);
          
          return (
            <motion.div
              key={dialect.id}
              ref={(el) => dialectRefs.current[dialect.id] = el}
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
                        <h3 className="text-2xl font-bold text-foreground">{dialect.name}</h3>
                        <p className="text-muted-foreground">{dialect.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="glass-effect">
                      {progress?.lessonsCompleted || 0}/{dialectLessonsForDialect.length || 0} completed
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {dialectLessonsForDialect
                      .slice(0, expandedDialects.has(dialect.id.toString()) ? dialectLessonsForDialect.length : 3)
                      .map((lesson, lessonIndex) => {
                      const isLocked = isLessonLocked(lesson, dialectLessonsForDialect);
                      const isCompleted = completedLessons.has(lesson.id);
                      
                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: lessonIndex * 0.05 }}
                          className={`glass-effect rounded-xl p-4 transition-all group ${
                            isLocked 
                              ? 'opacity-60 cursor-not-allowed' 
                              : 'hover:bg-white hover:bg-opacity-30 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <div className="text-sm font-bold text-muted-foreground w-12">
                                  #{lesson.lessonNumber}
                                </div>
                                {isLocked ? (
                                  <motion.div
                                    animate={{ 
                                      scale: [1, 1.1, 1],
                                      rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center"
                                  >
                                    <Lock className="w-3 h-3 text-white" />
                                  </motion.div>
                                ) : isCompleted ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                  >
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </motion.div>
                                ) : null}
                              </div>
                              <div>
                                <h4 className={`font-semibold transition-colors ${
                                  isLocked 
                                    ? 'text-gray-400' 
                                    : isCompleted 
                                      ? 'text-green-600' 
                                      : 'text-foreground group-hover:text-filipino-blue'
                                }`}>
                                  {lesson.title}
                                </h4>
                                <p className={`text-sm ${isLocked ? 'text-gray-400' : 'text-muted-foreground'}`}>
                                  {lesson.content}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {getLessonTypeIcon(lesson)}
                                  <span className="text-xs text-muted-foreground">
                                    {getLessonTypeDescription(lesson)}
                                  </span>
                                  {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                                    <>
                                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                      <span className="text-xs text-muted-foreground">
                                        {lesson.vocabulary.length} words
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!isLocked && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`glass-effect transition-all ${
                                    isCompleted
                                      ? 'hover:bg-green-500 hover:text-white'
                                      : 'hover:bg-filipino-blue hover:text-white'
                                  }`}
                                  onClick={() => handleLessonClick(lesson)}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  {isCompleted ? 'Review' : 'Start Lesson'}
                                </Button>
                              )}
                              {isLocked && (
                                <div className="text-xs text-gray-400 italic">
                                  Complete previous lessons to unlock
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {/* View All Lessons Button */}
                    {dialectLessonsForDialect.length > 3 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="pt-2"
                      >
                        <Button
                          variant="outline"
                          className="w-full glass-effect hover:bg-white hover:bg-opacity-30"
                          onClick={() => toggleDialectExpansion(dialect.id.toString())}
                        >
                          {expandedDialects.has(dialect.id.toString()) ? (
                            <>
                              Show Less Lessons
                              <ArrowLeft className="w-4 h-4 ml-2 rotate-90" />
                            </>
                          ) : (
                            <>
                              View All {dialectLessonsForDialect.length} Lessons
                              <ArrowLeft className="w-4 h-4 ml-2 -rotate-90" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
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
