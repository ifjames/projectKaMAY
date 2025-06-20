import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Download, Trash2, LogOut } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { showConfirmAlert, showInfoAlert } from '@/lib/sweetalert';
import type { User as UserType } from '@shared/schema';

export default function Profile() {
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
      // In a real app, this would call an API to reset progress
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
      // In a real app, this would handle sign out
      showInfoAlert('Signed Out', 'You have been signed out successfully.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="animate-pulse">
            <div className="glass-effect rounded-2xl p-6 h-64"></div>
          </div>
          <div className="md:col-span-2 animate-pulse">
            <div className="glass-effect rounded-2xl p-8 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 mb-12">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-effect text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 bg-gradient-to-r from-filipino-blue to-filipino-red rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {user?.name || 'User'}
              </h3>
              <p className="text-gray-600 mb-4">
                {user?.email || 'user@example.com'}
              </p>
              <Button
                variant="ghost"
                className="glass-effect hover:bg-white hover:bg-opacity-20 w-full"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Settings */}
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-effect">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Settings</h3>
              
              <div className="space-y-6">
                {/* Audio Settings */}
                <div className="bg-white bg-opacity-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Audio Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="audio-speed" className="text-gray-700">
                        Audio Playback Speed
                      </Label>
                      <Select value={audioSpeed} onValueChange={setAudioSpeed}>
                        <SelectTrigger className="w-32 glass-effect border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Slow</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-play" className="text-gray-700">
                        Auto-play Audio
                      </Label>
                      <Switch
                        id="auto-play"
                        checked={autoPlayAudio}
                        onCheckedChange={setAutoPlayAudio}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Learning Preferences */}
                <div className="bg-white bg-opacity-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Learning Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="daily-goal" className="text-gray-700">
                        Daily Goal (minutes)
                      </Label>
                      <Select 
                        value={weeklyGoalMinutes.toString()} 
                        onValueChange={(value) => setWeeklyGoalMinutes(parseInt(value))}
                      >
                        <SelectTrigger className="w-32 glass-effect border-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="45">45 min</SelectItem>
                          <SelectItem value="60">60 min</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications" className="text-gray-700">
                        Push Notifications
                      </Label>
                      <Switch
                        id="notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Account Actions */}
                <div className="bg-white bg-opacity-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Account</h4>
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-gray-100 hover:bg-opacity-50"
                      onClick={handleExportData}
                    >
                      <Download className="mr-3 text-filipino-blue" />
                      Export Learning Data
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-gray-100 hover:bg-opacity-50"
                      onClick={handleResetProgress}
                    >
                      <Trash2 className="mr-3 text-filipino-red" />
                      Reset Progress
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-gray-100 hover:bg-opacity-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-3 text-gray-600" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
