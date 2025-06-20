import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Trophy, Medal, Star, Calendar, Award, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import type { User as UserType, Achievement } from '@shared/schema';

export default function Profile() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ['/api/user'],
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/user/achievements'],
  });

  const totalPoints = achievements?.length ? achievements.length * 100 : 0;
  const completedLessons = 25; // This would come from progress data
  const currentLevel = Math.floor(totalPoints / 300) + 1;

  if (isLoading || achievementsLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-effect rounded-2xl p-8"
            >
              <div className="animate-pulse space-y-4">
                <motion.div 
                  className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
                <motion.div 
                  className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"
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
    <div className="max-w-6xl mx-auto px-4 mb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 bg-gradient-to-br from-filipino-blue via-filipino-red to-filipino-yellow rounded-full flex items-center justify-center relative overflow-hidden"
            >
              <User className="text-white text-2xl" />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white bg-opacity-20 rounded-full"
              />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.name || 'Maria Santos'}</h1>
              <p className="text-gray-600">@{user?.name?.toLowerCase().replace(' ', '_') || 'maria_santos'}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="glass-effect">
                  Level {currentLevel}
                </Badge>
                <Badge variant="secondary" className="glass-effect">
                  {totalPoints} Points
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="glass-effect hover:bg-white hover:bg-opacity-20"
            onClick={() => setLocation('/settings')}
          >
            <SettingsIcon className="mr-2 w-4 h-4" />
            Settings
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats Cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* Learning Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 bg-filipino-blue rounded-lg flex items-center justify-center"
                  >
                    <Trophy className="text-white text-lg" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-800">Learning Stats</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lessons Completed</span>
                    <span className="font-bold text-filipino-blue">{completedLessons}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Streak</span>
                    <span className="font-bold text-filipino-red">{user?.streak || 0} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Points</span>
                    <span className="font-bold text-filipino-yellow">{totalPoints}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Level</span>
                    <span className="font-bold text-gray-800">Level {currentLevel}</span>
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
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 bg-filipino-yellow rounded-lg flex items-center justify-center"
                  >
                    <Calendar className="text-white text-lg" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Completed Hiligaynon Lesson 3</span>
                    <span className="text-gray-400">2h ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-filipino-blue rounded-full"></div>
                    <span className="text-gray-600">Earned "Quick Learner" achievement</span>
                    <span className="text-gray-400">1d ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-filipino-red rounded-full"></div>
                    <span className="text-gray-600">Started Waray lessons</span>
                    <span className="text-gray-400">2d ago</span>
                  </div>
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
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-10 h-10 bg-filipino-red rounded-lg flex items-center justify-center"
                    >
                      <Award className="text-white text-lg" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800">Achievements</h3>
                  </div>
                  <Badge variant="secondary" className="glass-effect">
                    {achievements?.length || 0} Earned
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements?.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="glass-effect rounded-xl p-4 hover:bg-white hover:bg-opacity-30 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.icon === 'medal' ? 'bg-filipino-yellow' : 'bg-filipino-blue'
                          }`}
                        >
                          {achievement.icon === 'medal' ? (
                            <Medal className="text-white text-lg" />
                          ) : (
                            <Star className="text-white text-lg" />
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-filipino-blue">+100</div>
                          <div className="text-xs text-gray-500">Points</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Placeholder for more achievements */}
                  {(!achievements || achievements.length < 6) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="glass-effect rounded-xl p-4 border-2 border-dashed border-gray-300 flex items-center justify-center"
                    >
                      <div className="text-center text-gray-500">
                        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">More achievements coming soon!</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
