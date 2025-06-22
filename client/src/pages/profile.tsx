import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Medal, Star, Calendar, Award, Settings as SettingsIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserProfile, 
  getUserAchievements, 
  getUserProgress,
  cleanupDuplicateAchievements
} from '@/lib/firestore-service-simple';
import { formatFirestoreDate, getTimeAgo } from '@/lib/date-utils';
import { getAchievementById, calculateLevel, getProgressToNextLevel, getPointsForNextLevel } from '@/lib/achievements';

// Firestore types
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

interface FirestoreAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points?: number;
  earnedAt?: any;
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

export default function Profile() {
  const [, setLocation] = useLocation();
  const { currentUser, userData } = useAuth();
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [achievements, setAchievements] = useState<FirestoreAchievement[]>([]);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [progressData, setProgressData] = useState<FirestoreUserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Clean up duplicates first
        await cleanupDuplicateAchievements();
        
        const [userData, achievementsData, progressData] = await Promise.all([
          getUserProfile(),
          getUserAchievements(),
          getUserProgress()
        ]);
        
        setUser(userData);
        setAchievements(achievementsData);
        setProgressData(progressData);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Deduplicate achievements based on achievementId
  const uniqueAchievements = achievements?.filter((achievement: any, index: number, self: any[]) => {
    return index === self.findIndex((a: any) => a.achievementId === achievement.achievementId);
  }) || [];

  const totalPoints = uniqueAchievements?.reduce((sum: number, achievement: any) => {
    return sum + (achievement.points || 100);
  }, 0) || 0;
  
  const completedLessons = progressData?.reduce((sum: number, progress: any) => sum + (progress.lessonsCompleted || 0), 0) || 0;
  const currentLevel = calculateLevel(totalPoints);
  const progressToNextLevel = getProgressToNextLevel(totalPoints);
  const pointsForNextLevel = getPointsForNextLevel(totalPoints);

  // Calculate dynamic recent activity
  const getRecentActivity = () => {
    const activities: Array<{action: string, time: string, color: string}> = [];
    
    // Add activities based on progress data
    progressData.forEach((progress: any) => {
      if (progress.lastStudiedAt) {
        const timeAgo = getTimeAgo(progress.lastStudiedAt);
        activities.push({
          action: `Studied lessons in dialect ${progress.dialectId}`,
          time: timeAgo,
          color: 'bg-green-500'
        });
      }
    });
    
    // Add activities based on achievements
    uniqueAchievements.forEach((achievement: any) => {
      if (achievement.earnedAt) {
        const timeAgo = getTimeAgo(achievement.earnedAt);
        activities.push({
          action: `Earned "${achievement.title}" achievement`,
          time: timeAgo,
          color: 'bg-filipino-blue'
        });
      }
    });
    
    // Sort by most recent and take first 3
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 sm:space-y-8"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-effect rounded-2xl p-4 sm:p-6 lg:p-8"
            >
              <div className="animate-pulse space-y-4">
                <motion.div 
                  className="h-6 sm:h-8 bg-gradient-to-r from-muted to-muted-foreground rounded w-1/3 sm:w-1/4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
                <motion.div 
                  className="h-16 sm:h-20 bg-gradient-to-r from-muted to-muted-foreground rounded"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: (i * 0.1) + 0.2 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-filipino-blue via-filipino-red to-filipino-yellow rounded-full flex items-center justify-center relative overflow-hidden mx-auto sm:mx-0"
            >
              <User className="text-white text-xl sm:text-2xl" />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white bg-opacity-20 rounded-full"
              />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{userData?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}</h1>
              <p className="text-muted-foreground text-sm sm:text-base">@{(userData?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'user')?.toLowerCase().replace(' ', '_')}</p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-4 mt-2 flex-wrap gap-2">
                <Badge variant="secondary" className="glass-effect text-xs sm:text-sm">
                  Level {currentLevel}
                </Badge>
                <Badge variant="secondary" className="glass-effect text-xs sm:text-sm">
                  {totalPoints} Points
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="glass-effect hover:bg-white hover:bg-opacity-20 w-full sm:w-auto"
            onClick={() => setLocation('/settings')}
          >
            <SettingsIcon className="mr-2 w-4 h-4" />
            Settings
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Stats Cards */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Learning Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-filipino-blue rounded-lg flex items-center justify-center"
                  >
                    <Trophy className="text-white text-base sm:text-lg" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">Learning Stats</h3>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">Lessons Completed</span>
                    <span className="font-bold text-filipino-blue text-sm sm:text-base">{completedLessons}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">Current Streak</span>
                    <span className="font-bold text-filipino-red text-sm sm:text-base">{user?.streak || 0} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">Total Points</span>
                    <span className="font-bold text-filipino-yellow text-sm sm:text-base">{totalPoints}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm sm:text-base">Level</span>
                    <span className="font-bold text-foreground text-sm sm:text-base">Level {currentLevel}</span>
                  </div>
                  
                  {/* Level Progress Bar */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">Progress to Level {currentLevel + 1}</span>
                      <span className="text-xs sm:text-sm font-medium text-filipino-blue">{pointsForNextLevel} points needed</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={progressToNextLevel} 
                        className="h-2 sm:h-3"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-filipino-blue to-filipino-yellow opacity-20 rounded-full"
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Level {currentLevel}</span>
                      <span>{Math.round(progressToNextLevel)}%</span>
                      <span>Level {currentLevel + 1}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-filipino-yellow rounded-lg flex items-center justify-center"
                  >
                    <Calendar className="text-white text-base sm:text-lg" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground">Recent Activity</h3>
                </div>
                
                <div className="space-y-3">
                  {getRecentActivity().length > 0 ? (
                    getRecentActivity().map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 text-sm">
                        <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                        <span className="text-muted-foreground flex-1">{activity.action}</span>
                        <span className="text-muted-foreground">{activity.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <span className="text-muted-foreground">No recent activity</span>
                      <span className="text-muted-foreground">Start learning!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-filipino-red rounded-lg flex items-center justify-center"
                    >
                      <Award className="text-white text-base sm:text-lg" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">Achievements</h3>
                  </div>
                  <Badge variant="secondary" className="glass-effect text-xs sm:text-sm self-start sm:self-auto">
                    {uniqueAchievements?.length || 0} Earned
                  </Badge>
                </div>
                
                {uniqueAchievements?.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-4xl sm:text-6xl mb-3 sm:mb-4"
                    >
                      🏆
                    </motion.div>
                    <h4 className="text-lg sm:text-xl font-bold text-foreground mb-2">No achievements yet</h4>
                    <p className="text-sm sm:text-base text-muted-foreground">Complete lessons and reach milestones to earn your first achievement!</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      {(showAllAchievements ? uniqueAchievements : uniqueAchievements.slice(0, 4))?.map((achievement: any, index: number) => {
                        const achievementData = getAchievementById(achievement.achievementId || achievement.id);
                        const IconComponent = achievementData?.iconComponent || Star;
                        
                        return (
                          <motion.div
                            key={`${achievement.id}-${achievement.achievementId}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="glass-effect rounded-xl p-3 sm:p-4 hover:bg-white hover:bg-opacity-30 transition-all"
                          >
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                                  achievementData?.category === 'master' ? 'bg-gradient-to-r from-filipino-yellow to-filipino-red' :
                                  achievementData?.category === 'advanced' ? 'bg-filipino-red' :
                                  achievementData?.category === 'intermediate' ? 'bg-filipino-blue' :
                                  'bg-filipino-yellow'
                                }`}
                              >
                                <IconComponent className="text-white text-base sm:text-lg" />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm sm:text-base text-foreground truncate">{achievement.title}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{achievement.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatFirestoreDate(achievement.earnedAt)}
                                </p>
                                {achievementData?.category && (
                                  <span className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium mt-1 ${
                                    achievementData.category === 'master' ? 'bg-gradient-to-r from-filipino-yellow to-filipino-red text-white' :
                                    achievementData.category === 'advanced' ? 'bg-filipino-red text-white' :
                                    achievementData.category === 'intermediate' ? 'bg-filipino-blue text-white' :
                                    'bg-filipino-yellow text-gray-900'
                                  }`}>
                                    {achievementData.category}
                                  </span>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-xs sm:text-sm font-bold text-filipino-blue">
                                  +{achievement.points || 100}
                                </div>
                                <div className="text-xs text-muted-foreground">Points</div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    {uniqueAchievements.length > 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-4 sm:mt-6 text-center"
                      >
                        <Button
                          variant="outline"
                          onClick={() => setShowAllAchievements(!showAllAchievements)}
                          className="glass-effect hover:bg-white hover:bg-opacity-20 border-filipino-blue text-filipino-blue hover:text-filipino-blue w-full sm:w-auto"
                        >
                          <motion.div
                            animate={{ rotate: showAllAchievements ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {showAllAchievements ? (
                              <ChevronUp className="mr-2 w-4 h-4" />
                            ) : (
                              <ChevronDown className="mr-2 w-4 h-4" />
                            )}
                          </motion.div>
                          <span className="text-sm sm:text-base">
                            {showAllAchievements ? 'View Less' : `View All Achievements (${uniqueAchievements.length})`}
                          </span>
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
