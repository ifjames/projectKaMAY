import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Target, Medal, Star, Plus, BookOpen, Trophy, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DialectCard from '@/components/dialect-card';
import { showSuccessAlert, showQuickActions } from '@/lib/sweetalert';
import type { User, Dialect, UserProgress, Achievement } from '@shared/schema';

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  const { data: dialects, isLoading: dialectsLoading } = useQuery<Dialect[]>({
    queryKey: ['/api/dialects'],
  });

  const { data: progressData, isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ['/api/user/progress'],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/user/achievements'],
  });

  const handleDialectClick = async (dialect: Dialect) => {
    await showSuccessAlert(
      'Opening Lesson',
      `Starting ${dialect.name} lessons...`
    );
    setLocation(`/lessons/${dialect.id}`);
  };

  const handleFabClick = () => {
    showQuickActions();
  };

  if (userLoading || dialectsLoading || progressLoading || achievementsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-effect rounded-3xl p-8"
              >
                <div className="animate-pulse">
                  <motion.div 
                    className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 w-1/3"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div 
                    className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-6 w-1/2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="glass-effect rounded-2xl p-6 animate-pulse"
              >
                <motion.div 
                  className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const getProgressForDialect = (dialectId: number) => {
    return progressData?.find(p => p.dialectId === dialectId);
  };

  const weeklyProgress = user ? Math.round((4 / 7) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 mb-12">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-effect rounded-3xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Kumusta, <span className="text-filipino-blue">{user?.name || 'Student'}!</span>
                </h2>
                <p className="text-gray-600">Ready to continue your Filipino dialect journey?</p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-r from-filipino-yellow to-filipino-red rounded-2xl flex items-center justify-center">
                  <Star className="text-white text-2xl" />
                </div>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="bg-white bg-opacity-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Overall Progress</h3>
                <span className="text-2xl font-bold text-filipino-blue">
                  {user?.overallProgress || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  className="bg-gradient-to-r from-filipino-blue to-filipino-yellow h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${user?.overallProgress || 0}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
          
          {/* Dialect Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {dialects?.map((dialect, index) => (
              <motion.div
                key={dialect.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <DialectCard
                  dialect={dialect}
                  progress={getProgressForDialect(dialect.id)}
                  onClick={() => handleDialectClick(dialect)}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Daily Streak */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Daily Streak</h3>
                  <Flame className="text-filipino-red text-xl" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-filipino-red mb-2">
                    {user?.streak || 0}
                  </div>
                  <p className="text-gray-600 text-sm">days in a row</p>
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
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Weekly Goal</h3>
                  <Target className="text-filipino-blue text-xl" />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>4/7 days</span>
                    <span>{weeklyProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="bg-filipino-blue h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${weeklyProgress}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
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
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {achievements?.slice(-2).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.icon === 'medal' ? 'bg-filipino-yellow' : 'bg-filipino-blue'
                      }`}>
                        {achievement.icon === 'medal' ? (
                          <Medal className="text-white" />
                        ) : (
                          <Star className="text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{achievement.title}</p>
                        <p className="text-xs text-gray-500">
                          {achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <Button
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-filipino-blue to-filipino-red rounded-full shadow-lg hover:scale-110 transition-transform md:hidden"
        onClick={handleFabClick}
      >
        <Plus className="text-white text-xl" />
      </Button>
    </div>
  );
}
