import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Volume2, Clock, Bell, Download, Trash2, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { showConfirmAlert, showInfoAlert } from '@/lib/sweetalert';
import type { User as UserType } from '@shared/schema';

export default function Settings() {
  const [audioSpeed, setAudioSpeed] = useState('normal');
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState(30);

  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ['/api/user'],
  });

  const updateUserMutation = useMutation({
    mutationFn: (updates: Partial<UserType>) => 
      apiRequest('PATCH', '/api/user', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  const handleResetProgress = async () => {
    const result = await showConfirmAlert(
      'Reset Progress?',
      'This will delete all your learning progress. This action cannot be undone.',
      'Yes, reset it!'
    );
    
    if (result.isConfirmed) {
      showInfoAlert('Progress Reset', 'Your learning progress has been reset.');
    }
  };

  const handleExportData = () => {
    showInfoAlert('Exporting Data', 'Your learning data is being prepared for download...');
  };

  const handleSignOut = async () => {
    const result = await showConfirmAlert(
      'Sign Out?',
      'Are you sure you want to sign out?',
      'Yes, sign out'
    );
    
    if (result.isConfirmed) {
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
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
                  className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"
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
    <div className="max-w-4xl mx-auto px-4 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4 mb-2">
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 bg-gradient-to-r from-filipino-blue to-filipino-red rounded-xl flex items-center justify-center"
          >
            <Settings className="text-white text-xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        </div>
        <p className="text-gray-600">Customize your learning experience</p>
      </motion.div>

      <div className="space-y-6">
        {/* Audio Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-effect">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 bg-filipino-blue rounded-lg flex items-center justify-center"
                >
                  <Volume2 className="text-white text-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800">Audio Settings</h3>
              </div>
              
              <div className="space-y-6">
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor="audio-speed" className="text-gray-700 font-medium">
                    Audio Playback Speed
                  </Label>
                  <Select value={audioSpeed} onValueChange={setAudioSpeed}>
                    <SelectTrigger className="w-40 glass-effect border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">0.75x Slow</SelectItem>
                      <SelectItem value="normal">1x Normal</SelectItem>
                      <SelectItem value="fast">1.25x Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor="auto-play" className="text-gray-700 font-medium">
                    Auto-play Audio
                  </Label>
                  <Switch
                    id="auto-play"
                    checked={autoPlayAudio}
                    onCheckedChange={setAutoPlayAudio}
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-effect">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 bg-filipino-yellow rounded-lg flex items-center justify-center"
                >
                  <Clock className="text-white text-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800">Learning Preferences</h3>
              </div>
              
              <div className="space-y-6">
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor="daily-goal" className="text-gray-700 font-medium">
                    Daily Goal
                  </Label>
                  <Select 
                    value={weeklyGoalMinutes.toString()} 
                    onValueChange={(value) => setWeeklyGoalMinutes(parseInt(value))}
                  >
                    <SelectTrigger className="w-40 glass-effect border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor="notifications" className="text-gray-700 font-medium">
                    Push Notifications
                  </Label>
                  <Switch
                    id="notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-effect">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 bg-filipino-red rounded-lg flex items-center justify-center"
                >
                  <Bell className="text-white text-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
              </div>
              
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-gray-700 font-medium">Daily Reminders</Label>
                    <p className="text-sm text-gray-500">Get reminded to practice daily</p>
                  </div>
                  <Switch defaultChecked />
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-gray-700 font-medium">Achievement Alerts</Label>
                    <p className="text-sm text-gray-500">Celebrate your milestones</p>
                  </div>
                  <Switch defaultChecked />
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-gray-700 font-medium">Weekly Progress</Label>
                    <p className="text-sm text-gray-500">Weekly learning summary</p>
                  </div>
                  <Switch defaultChecked />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-effect">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Account Management</h3>
              
              <div className="space-y-4">
                <motion.div whileHover={{ x: 4 }}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white hover:bg-opacity-30 p-4 h-auto"
                    onClick={handleExportData}
                  >
                    <Download className="mr-4 text-filipino-blue text-xl" />
                    <div className="text-left">
                      <div className="font-medium text-gray-800">Export Learning Data</div>
                      <div className="text-sm text-gray-500">Download your progress and achievements</div>
                    </div>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ x: 4 }}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white hover:bg-opacity-30 p-4 h-auto"
                    onClick={handleResetProgress}
                  >
                    <Trash2 className="mr-4 text-filipino-red text-xl" />
                    <div className="text-left">
                      <div className="font-medium text-gray-800">Reset Progress</div>
                      <div className="text-sm text-gray-500">Clear all learning data and start fresh</div>
                    </div>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ x: 4 }}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white hover:bg-opacity-30 p-4 h-auto"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-4 text-gray-600 text-xl" />
                    <div className="text-left">
                      <div className="font-medium text-gray-800">Sign Out</div>
                      <div className="text-sm text-gray-500">Sign out of your account</div>
                    </div>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}