import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, FileText, CheckCircle, Award, RefreshCw, Check, X, HelpCircle, Star, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { showQuizFeedback, showSuccessAlert } from '@/lib/sweetalert';
import type { Lesson } from '@shared/schema';
import { enhancedLessonContent } from '@/data/enhanced-lesson-content';
import { checkLessonAchievements, getAchievementById } from '@/lib/achievements';
import { getUserAchievements } from '@/lib/firestore-service-simple';

interface EnhancedLessonInterfaceProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (score: number, totalPossiblePoints: number, achievements: string[]) => void;
  progress: number;
  dialectTotalLessons: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple-choice' | 'translation' | 'listening';
}

interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  selectedAnswer: number | null;
  correctAnswer: number;
  points: number;
  timeSpent: number;
}

type LessonStep = 'objectives' | 'vocabulary' | 'content' | 'quiz' | 'results';

// Helper function to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function EnhancedLessonInterface({ 
  lesson, 
  onBack, 
  onComplete, 
  progress,
  dialectTotalLessons
}: EnhancedLessonInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<LessonStep>('objectives');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Map<string, number | null>>(new Map());
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalPossiblePoints, setTotalPossiblePoints] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [answerTimes, setAnswerTimes] = useState<Map<string, number>>(new Map());
  const [earnedAchievements, setEarnedAchievements] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [actualNewAchievements, setActualNewAchievements] = useState<string[]>([]);

  // Get enhanced lesson content
  const getEnhancedContent = () => {
    const content = enhancedLessonContent[lesson.dialectId]?.[lesson.lessonNumber];
    if (content) {
      return content;
    }
    // Fallback to original lesson data
    return {
      title: lesson.title,
      description: `Learn ${lesson.title}`,
      content: lesson.content || "Practice this lesson to improve your dialect skills.",
      vocabulary: lesson.vocabulary || [],
      quizQuestions: lesson.quiz?.map((q, index) => ({
        id: `quiz_${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: 10,
        difficulty: 'medium' as const,
        type: 'multiple-choice' as const
      })) || [],
      lessonObjectives: ["Complete the lesson", "Learn new vocabulary", "Pass the quiz"],
      culturalNote: "Learn about the cultural context of this dialect."
    };
  };

  const enhancedContent = getEnhancedContent();

  // Generate quiz questions from enhanced content
  useEffect(() => {
    if (currentStep === 'quiz' && quizQuestions.length === 0) {
      let allQuestions: QuizQuestion[] = [...enhancedContent.quizQuestions];
      
      // Add vocabulary questions if needed
      if (allQuestions.length < 5 && enhancedContent.vocabulary.length > 0) {
        const vocabQuestions = enhancedContent.vocabulary.slice(0, 8).map((item, index) => ({
          id: `vocab_${index}`,
          question: `What does "${item.word}" mean in English?`,
          options: shuffle([
            item.translation,
            ...enhancedContent.vocabulary
              .filter(v => v.translation !== item.translation)
              .slice(0, 3)
              .map(v => v.translation)
          ]).slice(0, 4),
          correctAnswer: 0, // Will be updated after shuffle
          points: 10,
          explanation: `"${item.word}" means "${item.translation}" in English.`,
          difficulty: 'easy' as const,
          type: 'multiple-choice' as const
        }));
        
        // Fix correct answer indices after shuffle
        vocabQuestions.forEach(q => {
          const correctOption = enhancedContent.vocabulary.find(v => 
            q.question.includes(v.word))?.translation;
          if (correctOption) {
            q.correctAnswer = q.options.indexOf(correctOption);
          }
        });
        
        allQuestions = [...allQuestions, ...vocabQuestions];
      }
      
      const shuffledQuestions = shuffle(allQuestions).slice(0, 6);
      setQuizQuestions(shuffledQuestions);
      setTotalPossiblePoints(shuffledQuestions.reduce((sum, q) => sum + q.points, 0));
      setQuizStartTime(Date.now());
    }
  }, [currentStep, enhancedContent]);

  // Handle quiz submission and check for achievements
  const handleQuizSubmit = async () => {
    // Increment quiz attempts
    setQuizAttempts(prev => prev + 1);
    
    // Calculate quiz results
    const results: QuizResult[] = quizQuestions.map((question: any) => {
      const userAnswer = quizAnswers.get(question.id);
      const isCorrect = userAnswer === question.correctAnswer;
      const timeSpent = answerTimes.get(question.id) || 0;
      
      return {
        questionId: question.id,
        isCorrect,
        selectedAnswer: userAnswer || null,
        correctAnswer: question.correctAnswer,
        points: isCorrect ? question.points : 0,
        timeSpent
      };
    });
    
    setQuizResults(results);
    const score = results.reduce((sum, result) => sum + result.points, 0);
    setTotalScore(score);
    
    // Store quiz metrics for parent component to use for achievement checking
    const totalTime = Date.now() - quizStartTime;
    const scorePercentage = (score / totalPossiblePoints) * 100;
    
    // Get existing achievements to check what's truly new
    try {
      const existingAchievements = await getUserAchievements();
      const existingIds = existingAchievements.map((a: any) => a.achievementId || a.id);
      
      // Set basic achievements that can be determined locally
      const localAchievements: string[] = [];
      
      // Check speed achievement (under 5 minutes)
      if (totalTime < 300000) {
        localAchievements.push('speed_demon');
      }
      
      // Check perfect score achievement
      if (scorePercentage === 100) {
        localAchievements.push('perfect_scholar');
      }
      
      // Filter out achievements that user already has
      const newAchievements = localAchievements.filter(id => !existingIds.includes(id));
      
      setEarnedAchievements(localAchievements); // All potential achievements for backend
      setActualNewAchievements(newAchievements); // Only truly new ones for display
    } catch (error) {
      console.error('Error checking existing achievements:', error);
      // Fallback: show all potential achievements
      const localAchievements: string[] = [];
      
      if (totalTime < 300000) {
        localAchievements.push('speed_demon');
      }
      
      if (scorePercentage === 100) {
        localAchievements.push('perfect_scholar');
      }
      
      setEarnedAchievements(localAchievements);
      setActualNewAchievements(localAchievements);
    }
    
    setQuizSubmitted(true);
    setCurrentStep('results');
  };

  const handleComplete = () => {
    onComplete(totalScore, totalPossiblePoints, earnedAchievements);
  };

  const handleNextStep = () => {
    const steps: LessonStep[] = ['objectives', 'vocabulary', 'content', 'quiz', 'results'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setQuizAnswers((prev: Map<string, number | null>) => new Map(prev).set(currentQuestion.id, answerIndex));
    setAnswerTimes((prev: Map<string, number>) => new Map(prev).set(currentQuestion.id, Date.now() - quizStartTime));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      handleQuizSubmit();
    }
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lessons</span>
          </Button>
          <Badge variant="secondary">
            Lesson {lesson.lessonNumber} of {dialectTotalLessons}
          </Badge>
        </div>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{enhancedContent.title}</h1>
          <p className="text-muted-foreground">{enhancedContent.description}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Lesson Objectives */}
        {currentStep === 'objectives' && (
          <motion.div
            key="objectives"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white bg-opacity-50 rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-8 h-8 text-filipino-blue" />
              <h2 className="text-2xl font-bold text-foreground">Lesson Objectives</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              {enhancedContent.lessonObjectives.map((objective, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-foreground">{objective}</span>
                </motion.div>
              ))}
            </div>
            
            <Button
              className="bg-filipino-blue text-white hover:bg-blue-700"
              onClick={handleNextStep}
            >
              Start Learning
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Vocabulary Step */}
        {currentStep === 'vocabulary' && (
          <motion.div
            key="vocabulary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white bg-opacity-50 rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-8 h-8 text-filipino-blue" />
              <h2 className="text-2xl font-bold text-foreground">Vocabulary</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {enhancedContent.vocabulary.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg text-foreground">{item.word}</p>
                      <p className="text-muted-foreground">{item.translation}</p>
                      {('pronunciation' in item) && item.pronunciation && (
                        <p className="text-sm text-muted-foreground italic">/{item.pronunciation}/</p>
                      )}
                    </div>
                    {('category' in item) && item.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <Button
              className="bg-filipino-blue text-white hover:bg-blue-700"
              onClick={handleNextStep}
            >
              Continue to Content
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Content Step */}
        {currentStep === 'content' && (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white bg-opacity-50 rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-8 h-8 text-filipino-blue" />
              <h2 className="text-2xl font-bold text-foreground">Learn</h2>
            </div>
            
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-foreground leading-relaxed">{enhancedContent.content}</p>
              
              {enhancedContent.culturalNote && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-filipino-blue">
                  <h4 className="font-semibold text-filipino-blue mb-2">Cultural Note</h4>
                  <p className="text-foreground">{enhancedContent.culturalNote}</p>
                </div>
              )}
            </div>
            
            <Button
              className="bg-filipino-blue text-white hover:bg-blue-700"
              onClick={handleNextStep}
            >
              Take Quiz
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Quiz Step */}
        {currentStep === 'quiz' && currentQuestion && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white bg-opacity-50 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-8 h-8 text-filipino-blue" />
                <h2 className="text-2xl font-bold text-foreground">Quiz</h2>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </span>
                <div className="flex space-x-1">
                  {quizQuestions.map((_: any, index: number) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index <= currentQuestionIndex ? 'bg-filipino-blue' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant={
                    currentQuestion.difficulty === 'easy' ? 'default' :
                    currentQuestion.difficulty === 'medium' ? 'secondary' : 'destructive'
                  }
                >
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">
                  {currentQuestion.points} points
                </Badge>
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {currentQuestion.question}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full text-left justify-start p-4 h-auto ${
                      selectedAnswer === index ? 'bg-filipino-blue text-white' : ''
                    }`}
                    onClick={() => handleAnswer(index)}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              className="bg-filipino-blue text-white hover:bg-blue-700"
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white bg-opacity-50 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 text-filipino-yellow mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-2">Lesson Complete!</h2>
              <p className="text-muted-foreground">Great job completing this lesson</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 text-center">
                <Star className="w-8 h-8 text-filipino-yellow mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{totalScore}</p>
                <p className="text-muted-foreground">Points Earned</p>
              </Card>
              
              <Card className="p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">
                  {Math.round((totalScore / totalPossiblePoints) * 100)}%
                </p>
                <p className="text-muted-foreground">Accuracy</p>
              </Card>
              
              <Card className="p-6 text-center">
                <Award className="w-8 h-8 text-filipino-blue mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{actualNewAchievements.length}</p>
                <p className="text-muted-foreground">Achievements</p>
              </Card>
            </div>
            
            {actualNewAchievements.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-4">🎉 New Achievements!</h3>
                <div className="space-y-3">
                  {actualNewAchievements.map((achievementKey: any) => {
                    const achievement = getAchievementById(achievementKey);
                    if (!achievement) return null;
                    
                    const IconComponent = achievement.iconComponent || Award;
                    
                    return (
                      <motion.div
                        key={achievementKey}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-filipino-yellow to-filipino-blue rounded-lg text-white"
                      >
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold">{achievement.title}</p>
                          <p className="text-sm opacity-90">{achievement.description}</p>
                        </div>
                        <span className="ml-auto px-2 py-1 bg-white bg-opacity-20 rounded text-sm font-bold">
                          +{achievement.points} pts
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Quiz Review Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">Quiz Review</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReview(!showReview)}
                  className="text-filipino-blue border-filipino-blue hover:bg-filipino-blue hover:text-white"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {showReview ? 'Hide Review' : 'Show Answers'}
                </Button>
              </div>
              
              {showReview && (
                <div className="space-y-4">
                  {quizResults.map((result, index) => {
                    const question = quizQuestions.find(q => q.id === result.questionId);
                    if (!question) return null;
                    
                    return (
                      <motion.div
                        key={result.questionId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 ${
                          result.isCorrect 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-foreground flex-1">
                            {index + 1}. {question.question}
                          </h4>
                          <div className={`flex items-center space-x-2 ${
                            result.isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {result.isCorrect ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                            <span className="font-bold">
                              {result.isCorrect ? '+' : '0'}{result.points} pts
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => {
                            const isCorrect = optionIndex === question.correctAnswer;
                            const isSelected = optionIndex === result.selectedAnswer;
                            
                            return (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded text-sm ${
                                  isCorrect 
                                    ? 'bg-green-100 text-green-800 font-semibold' 
                                    : isSelected 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-gray-50 text-muted-foreground'
                                }`}
                              >
                                <span className="font-medium mr-2">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                {option}
                                {isCorrect && <span className="ml-2">✓ Correct</span>}
                                {isSelected && !isCorrect && <span className="ml-2">✗ Your answer</span>}
                              </div>
                            );
                          })}
                        </div>
                        
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400">
                            <p className="text-blue-800 text-sm">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="flex justify-center space-x-4">
              {quizAttempts < 3 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentStep('quiz');
                    setQuizSubmitted(false);
                    setCurrentQuestionIndex(0);
                    setQuizAnswers(new Map());
                    setSelectedAnswer(null);
                    setShowReview(false);
                  }}
                  className="text-filipino-blue border-filipino-blue hover:bg-filipino-blue hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake Quiz ({3 - quizAttempts} attempts left)
                </Button>
              )}
              
              {quizAttempts >= 3 && (
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                  <p className="text-yellow-800 text-sm">
                    You've reached the maximum number of quiz attempts (3). 
                    You can continue with your current score or review the lesson content again.
                  </p>
                </div>
              )}
              
              <Button
                className="bg-filipino-blue text-white hover:bg-blue-700"
                onClick={handleComplete}
              >
                Continue Learning
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
