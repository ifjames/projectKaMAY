import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Flame, Target, Trophy, Users, BookOpen, Star, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DialectCard from '@/components/dialect-card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getDialects, 
  getUserProfile, 
  getUserProgress, 
  getUserAchievements 
} from '@/lib/firestore-service-simple';

// Firestore types
interface FirestoreDialect {
  id: string;
  name: string;
  description: string;
  region: string;
  color: string;
  totalLessons: number;
}

interface FirestoreUser {
  id: string;
  name: string;
  email: string;
  overallProgress: number;
  streak: number;
  weeklyGoalMinutes: number;
  audioSpeed: string;
  autoPlayAudio: boolean;
  pushNotifications: boolean;
  lastActiveDate?: any;
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

interface FirestoreAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: any;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { currentUser, userData } = useAuth();
  const [dialects, setDialects] = useState<FirestoreDialect[]>([]);
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [userProgress, setUserProgress] = useState<FirestoreUserProgress[]>([]);
  const [achievements, setAchievements] = useState<FirestoreAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) {
        console.log('No current user, skipping data load');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading dashboard data for user:', currentUser.uid);
        
        const [dialectsData, userData, progressData, achievementsData] = await Promise.all([
          getDialects(),
          getUserProfile(),
          getUserProgress(),
          getUserAchievements()
        ]);
        
        console.log('Data loaded:', { dialectsData, userData, progressData, achievementsData });
        
        setDialects(dialectsData);
        setUser(userData);
        setUserProgress(progressData);
        setAchievements(achievementsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleDialectClick = (dialect: FirestoreDialect) => {
    setLocation(`/lessons?dialect=${dialect.id}`);
  };

  // Calculate user stats
  const getUserStats = () => {
    if (!userProgress || !dialects.length) {
      return {
        totalLessonsCompleted: 0,
        totalLessons: dialects.reduce((sum, d) => sum + d.totalLessons, 0),
        overallProgress: 0,
        streak: user?.streak || 0,
        dialectsStarted: 0,
        recentAchievements: []
      };
    }

    const totalLessonsCompleted = userProgress.reduce((sum, progress) => sum + (progress.lessonsCompleted || 0), 0);
    const totalLessons = dialects.reduce((sum, d) => sum + d.totalLessons, 0);
    const overallProgress = totalLessons > 0 ? (totalLessonsCompleted / totalLessons) * 100 : 0;
    
    // Count how many dialects have been started
    const dialectsWithProgress = new Set(userProgress.map(p => p.dialectId));
    const dialectsStarted = dialectsWithProgress.size;

    return {
      totalLessonsCompleted,
      totalLessons,
      overallProgress,
      streak: user?.streak || 0,
      dialectsStarted,
      recentAchievements: achievements.slice(-3) // Show last 3 achievements
    };
  };

  // Get progress for a specific dialect
  const getProgressForDialect = (dialectId: string) => {
    const dialectIdNum = parseInt(dialectId);
    return userProgress?.find(p => p.dialectId === dialectIdNum) || {
      dialectId: dialectIdNum,
      lessonsCompleted: 0,
      totalLessons: dialects.find(d => d.id === dialectId)?.totalLessons || 0,
      progress: 0
    };
  };

  const stats = getUserStats();
  const weeklyProgress = Math.min((stats.totalLessonsCompleted * 20), 100); // Simplified weekly goal

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8"
            >
              <div className="animate-pulse">
                <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3 sm:mb-4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6 sm:mb-8"></div>
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-effect rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 break-words">
                  Kumusta, <span className="text-filipino-blue">{userData?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">Ready to continue your Filipino dialect journey?</p>
              </div>
              <div className="flex sm:hidden md:flex w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-filipino-yellow to-filipino-red rounded-xl sm:rounded-2xl items-center justify-center flex-shrink-0 self-center sm:self-auto">
                <Heart className="text-white text-lg sm:text-xl lg:text-2xl" />
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
              <div className="bg-white/10 dark:bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Streak</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-filipino-yellow">{stats.streak}</p>
                  </div>
                  <Flame className="text-filipino-yellow text-lg sm:text-xl lg:text-2xl" />
                </div>
              </div>
              
              <div className="bg-white/10 dark:bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Lessons</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-filipino-blue">{stats.totalLessonsCompleted}</p>
                  </div>
                  <BookOpen className="text-filipino-blue text-lg sm:text-xl lg:text-2xl" />
                </div>
              </div>
              
              <div className="bg-white/10 dark:bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Dialects</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-filipino-red">{stats.dialectsStarted}</p>
                  </div>
                  <Users className="text-filipino-red text-lg sm:text-xl lg:text-2xl" />
                </div>
              </div>
              
              <div className="bg-white/10 dark:bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Achievements</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-filipino-yellow">{stats.recentAchievements.length}</p>
                  </div>
                  <Trophy className="text-filipino-yellow text-lg sm:text-xl lg:text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="bg-white/10 dark:bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-sm sm:text-base text-foreground">Overall Progress</h3>
                <span className="text-xl sm:text-2xl font-bold text-filipino-blue">
                  {Math.round(stats.overallProgress)}%
                </span>
              </div>
              <div className="w-full bg-white/20 dark:bg-gray-700 rounded-full h-2 sm:h-3 mb-2 sm:mb-3">
                <motion.div 
                  className="bg-gradient-to-r from-filipino-blue to-filipino-yellow h-2 sm:h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.overallProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-0">
                <span>{stats.totalLessonsCompleted} of {stats.totalLessons} lessons completed</span>
                <span>{stats.dialectsStarted} dialects started</span>
              </div>
            </div>
          </motion.div>
          
          {/* Dialect Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {dialects.length === 0 ? (
              <div className="sm:col-span-2 text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-4">🌟</div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">Setting up your learning experience...</h3>
                <p className="text-sm sm:text-base text-muted-foreground">We're preparing all the dialects and lessons for you!</p>
              </div>
            ) : (
              dialects.map((dialect, index) => {
                // Convert FirestoreDialect to the format expected by DialectCard
                const dialectForCard = {
                  ...dialect,
                  id: parseInt(dialect.id),
                  totalLessons: dialect.totalLessons || 0
                };
                
                const progress = getProgressForDialect(dialect.id);
                const progressForCard = {
                  dialectId: progress.dialectId,
                  id: parseInt(('id' in progress ? progress.id : '0') || '0'),
                  userId: parseInt(('userId' in progress ? progress.userId : '0') || '0'),
                  currentLesson: null,
                  lastStudiedAt: null,
                  lessonsCompleted: progress.lessonsCompleted || 0,
                  progress: progress.progress || 0
                };
                
                return (
                  <motion.div
                    key={dialect.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <DialectCard
                      dialect={dialectForCard}
                      progress={progressForCard}
                      onClick={() => handleDialectClick(dialect)}
                    />
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Sidebar Stats */}
        <div className="space-y-4 sm:space-y-6">
          {/* Daily Streak */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground">Learning Streak</h3>
                  <Flame className="text-filipino-red text-lg sm:text-xl" />
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-filipino-red mb-2">
                    {stats.streak}
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {stats.streak === 0 ? 'Start learning today!' : 
                     stats.streak === 1 ? 'lesson completed' : 'lessons completed'}
                  </p>
                  {stats.streak > 0 && (
                    <p className="text-xs text-green-600 mt-1">Keep going! 🔥</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Weekly Goal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground">Weekly Progress</h3>
                  <Target className="text-filipino-blue text-lg sm:text-xl" />
                </div>
                <div className="mb-3 sm:mb-4">
                  <div className="flex justify-between text-xs sm:text-sm mb-2 text-muted-foreground">
                    <span>{stats.totalLessonsCompleted} lessons this week</span>
                    <span>{Math.round(weeklyProgress)}%</span>
                  </div>
                  <div className="w-full bg-white/20 dark:bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="bg-filipino-blue h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${weeklyProgress}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {weeklyProgress >= 100 ? 'Great job this week! 🎉' : 'Keep learning to reach your goal!'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Recent Achievements</h3>
                <div className="space-y-2 sm:space-y-3">
                  {stats.recentAchievements.length > 0 ? (
                    stats.recentAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          achievement.icon === 'medal' ? 'bg-filipino-yellow' : 
                          achievement.icon === 'trophy' ? 'bg-filipino-red' :
                          'bg-filipino-blue'
                        }`}>
                          {achievement.icon === 'medal' ? (
                            <Trophy className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                          ) : achievement.icon === 'trophy' ? (
                            <Trophy className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Star className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base text-foreground truncate">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">Recently earned</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 sm:py-4">
                      <Trophy className="text-muted-foreground text-3xl sm:text-4xl mx-auto mb-2" />
                      <p className="text-muted-foreground text-xs sm:text-sm">No achievements yet</p>
                      <p className="text-muted-foreground text-xs">Complete lessons to earn your first achievement!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Quick Stats</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="text-filipino-blue w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Lessons</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{stats.totalLessonsCompleted}/{stats.totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="text-filipino-red w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Dialects</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{stats.dialectsStarted}/{dialects.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="text-filipino-yellow w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Achievements</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{stats.recentAchievements.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Call to Action */}
      {stats.totalLessonsCompleted === 0 && dialects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 sm:mt-8 text-center"
        >
          <Card className="glass-effect">
            <CardContent className="p-6 sm:p-8">
              <div className="max-w-md mx-auto">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🚀</div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Ready to start learning?</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Choose a dialect above and begin your journey into Filipino languages!</p>
                <Button
                  onClick={() => setLocation('/lessons')}
                  className="bg-gradient-to-r from-filipino-blue to-filipino-red text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                >
                  Start Learning Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
