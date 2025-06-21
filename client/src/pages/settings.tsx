import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Clock, 
  Bell, 
  Trash2, 
  LogOut, 
  RefreshCw,
  User,
  Lock,
  Palette,
  Shield,
  Globe,
  Eye,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { showConfirmAlert, showInfoAlert, showSuccessAlert, showErrorAlert } from '@/lib/sweetalert';
import { UserSettings } from '@/types';
import { reinitializeAllLessons } from '@/lib/reinitialize-data';

export default function Settings() {
  const { currentUser, userData, logout, updateUserProfile } = useAuth();
  
  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState(30);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState(true);
  const [theme, setTheme] = useState('system');
  const [privateProfile, setPrivateProfile] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  
  // Account management state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [nameChangeDate, setNameChangeDate] = useState<Date | null>(null);

  // Load user settings from Firebase
  useEffect(() => {
    if (userData) {
      // Load settings with type assertion to handle migration
      const settings = (userData.settings || {}) as any;
      setPushNotifications(settings.pushNotifications !== false);
      setWeeklyGoalMinutes(settings.weeklyGoalMinutes || 30);
      
      // Load additional settings if they exist
      setDailyReminders(settings.dailyReminders !== false);
      setAchievementAlerts(settings.achievementAlerts !== false);
      setWeeklyProgress(settings.weeklyProgress !== false);
      setTheme(settings.theme || 'system');
      setPrivateProfile(settings.privateProfile || false);
      setDataSharing(settings.dataSharing || false);
      
      // Apply theme immediately on load
      try {
        const themeValue = settings.theme || 'system';
        if (themeValue === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (themeValue === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // System theme
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          if (mediaQuery.matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      } catch (themeError) {
        console.warn('Error applying initial theme:', themeError);
      }
      
      // Set up system theme listener
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          try {
            const currentTheme = settings.theme || 'system';
            if (currentTheme === 'system') {
              if (e.matches) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }
          } catch (error) {
            console.warn('Error in system theme change handler:', error);
          }
        };
        
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // Cleanup listener when component unmounts
        return () => {
          try {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
          } catch (error) {
            console.warn('Error removing theme change listener:', error);
          }
        };
      } catch (listenerError) {
        console.warn('Error setting up system theme listener:', listenerError);
      }
      
      // Load last name change date
      if (settings.lastNameChange) {
        setNameChangeDate(new Date(settings.lastNameChange));
      }
      
      setNewDisplayName(userData?.displayName || '');
    }
  }, [userData]);

  // Update user settings in Firebase
  const updateUserSettings = useMutation({
    mutationFn: async (settings: Partial<UserSettings>) => {
      try {
        if (!currentUser) throw new Error('No user logged in');
        
        console.log('Updating settings:', settings);
        
        const userRef = doc(db, 'users', currentUser.uid);
        const updatedSettings = {
          ...userData?.settings,
          ...settings
        };
        
        console.log('Final settings to save:', updatedSettings);
        
        await updateDoc(userRef, { 
          settings: updatedSettings
        });
        
        return { success: true };
      } catch (error) {
        console.error('Mutation function error:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      try {
        console.log('Settings updated successfully:', variables);
        showSuccessAlert('Settings Updated', 'Your settings have been saved successfully');
      } catch (error) {
        console.warn('Success handler error:', error);
      }
    },
    onError: (error, variables) => {
      try {
        console.error('Failed to update settings:', error, variables);
        showErrorAlert('Error', 'Failed to update settings. Please try again.');
      } catch (handlerError) {
        console.warn('Error handler error:', handlerError);
      }
    }
  });

  // Handle theme change separately to avoid state conflicts
  const handleThemeChange = useCallback((newTheme: string) => {
    try {
      console.log('Theme change initiated:', newTheme);
      
      // Update local state first
      setTheme(newTheme);
      
      // Apply theme changes in a separate task to avoid render conflicts
      requestAnimationFrame(() => {
        try {
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            console.log('Applied dark theme');
          } else if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
            console.log('Applied light theme');
          } else {
            // System theme
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            if (mediaQuery.matches) {
              document.documentElement.classList.add('dark');
              console.log('Applied dark theme (system)');
            } else {
              document.documentElement.classList.remove('dark');
              console.log('Applied light theme (system)');
            }
          }
          localStorage.setItem('theme', newTheme);
          
          // Update Firebase in a separate task
          setTimeout(() => {
            try {
              updateUserSettings.mutate({ theme: newTheme });
            } catch (dbError) {
              console.warn('Database update error:', dbError);
            }
          }, 100);
          
        } catch (domError) {
          console.warn('DOM manipulation error:', domError);
        }
      });
      
    } catch (error) {
      console.error('Theme change error:', error);
    }
  }, [updateUserSettings]);

  // Handle settings changes (excluding theme)
  const handleSettingsChange = (setting: string, value: any) => {
    try {
      // Handle theme separately
      if (setting === 'theme') {
        handleThemeChange(value);
        return;
      }
      
      const settings: any = {};
      settings[setting] = value;

      // Update local state
      switch(setting) {
        case 'pushNotifications':
          setPushNotifications(value);
          break;
        case 'weeklyGoalMinutes':
          setWeeklyGoalMinutes(parseInt(value));
          settings[setting] = parseInt(value);
          break;
        case 'dailyReminders':
          setDailyReminders(value);
          break;
        case 'achievementAlerts':
          setAchievementAlerts(value);
          break;
        case 'weeklyProgress':
          setWeeklyProgress(value);
          break;
        case 'privateProfile':
          setPrivateProfile(value);
          break;
        case 'dataSharing':
          setDataSharing(value);
          break;
      }

      // Update settings in Firebase
      updateUserSettings.mutate(settings);
    } catch (error) {
      console.error('Error in handleSettingsChange:', error);
      showErrorAlert('Error', 'Failed to update setting. Please try again.');
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!currentUser || !currentPassword || !newPassword || !confirmPassword) {
      showErrorAlert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorAlert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      showErrorAlert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, newPassword);
      
      showSuccessAlert('Password Changed', 'Your password has been updated successfully');
      setIsPasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.warn('Password change error:', error);
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        showErrorAlert('Error', 'Current password is incorrect');
      } else if (error.code === 'auth/too-many-requests') {
        showErrorAlert('Error', 'Too many attempts. Please try again later.');
      } else if (error.code === 'auth/network-request-failed') {
        showErrorAlert('Network Error', 'Please check your internet connection and try again.');
      } else if (error.code === 'auth/requires-recent-login') {
        showErrorAlert('Error', 'Please log out and log back in before changing your password.');
      } else if (error.code === 'auth/weak-password') {
        showErrorAlert('Error', 'Password is too weak. Please choose a stronger password.');
      } else {
        // For unknown errors, show a generic error message
        showErrorAlert('Error', `Failed to change password: ${error.message || 'Please try again.'}`);
      }
    }
  };

  // Handle name change
  const handleNameChange = async () => {
    if (!newDisplayName.trim()) {
      showErrorAlert('Error', 'Please enter a valid name');
      return;
    }

    if (newDisplayName === userData?.displayName) {
      showErrorAlert('Error', 'New name is the same as current name');
      return;
    }

    // Check if 30 days have passed since last name change
    if (nameChangeDate) {
      const daysSinceLastChange = Math.floor((Date.now() - nameChangeDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastChange < 30) {
        const daysLeft = 30 - daysSinceLastChange;
        showErrorAlert('Name Change Limit', `You can change your name again in ${daysLeft} days`);
        return;
      }
    }

    try {
      await updateUserProfile(newDisplayName);
      
      // Update last name change date
      await updateUserSettings.mutateAsync({
        lastNameChange: new Date().toISOString()
      });

      setNameChangeDate(new Date());
      showSuccessAlert('Name Changed', 'Your display name has been updated successfully');
      setIsNameDialogOpen(false);
    } catch (error) {
      showErrorAlert('Error', 'Failed to change name. Please try again.');
    }
  };

  // Check if name change is available
  const canChangeName = () => {
    if (!nameChangeDate) return true;
    const daysSinceLastChange = Math.floor((Date.now() - nameChangeDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceLastChange >= 30;
  };

  const getDaysUntilNameChange = () => {
    if (!nameChangeDate) return 0;
    const daysSinceLastChange = Math.floor((Date.now() - nameChangeDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysSinceLastChange);
  };
  const handleResetProgress = async () => {
    const result = await showConfirmAlert(
      'Reset Progress?',
      'This will delete all your learning progress. This action cannot be undone.',
      'Yes, reset it!'
    );
    
    if (result.isConfirmed && currentUser) {
      try {
        // Delete user progress from Firestore
        const progressRef = collection(db, 'user_lesson_progress');
        const progressQuery = query(progressRef, where('userId', '==', currentUser.uid));
        const progressSnapshot = await getDocs(progressQuery);
        
        const deletePromises = progressSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        
        // Reinitialize all lessons for the user
        await reinitializeAllLessons();
        
        showSuccessAlert('Progress Reset', 'Your learning progress has been reset.');
      } catch (error) {
        console.error('Error resetting progress:', error);
        showInfoAlert('Error', 'There was an error resetting your progress. Please try again.');
      }
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
      try {
        await logout();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  // Handle data reinitialization for data reset
  const handleReinitializeData = async () => {
    const result = await showConfirmAlert(
      'Reinitialize Lesson Data?',
      'This will reset all lesson content data and recreate it with enhanced quiz content. This action cannot be undone.',
      'Yes, Reinitialize'
    );
    
    if (result.isConfirmed) {
      try {
        showInfoAlert('Reinitializing Data', 'Please wait while lesson data is being reset and recreated...');
        const response = await reinitializeAllLessons();
        
        if (response.success) {
          showSuccessAlert('Data Reinitialized', 'All lesson data has been successfully recreated with enhanced quiz content.');
          // Reload the page to reflect changes
          window.location.reload();
        } else {
          showInfoAlert('Error', 'Failed to reinitialize data. Please try again or check console for errors.');
        }
      } catch (error) {
        console.error('Error in handleReinitializeData:', error);
        showInfoAlert('Error', 'An unexpected error occurred. Please try again.');
      }
    }
  };

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
            <SettingsIcon className="text-white text-xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">Customize your learning experience</p>
      </motion.div>

      <div className="space-y-6">
        {/* Learning Preferences */}
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
                  className="w-10 h-10 bg-filipino-yellow rounded-lg flex items-center justify-center"
                >
                  <Clock className="text-white text-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">Learning Preferences</h3>
              </div>
              
              <div className="space-y-6">
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor="daily-goal" className="text-foreground font-medium">
                    Daily Goal
                  </Label>
                  <div className="relative">
                    <select 
                      id="daily-goal"
                      value={weeklyGoalMinutes.toString()} 
                      onChange={(e) => handleSettingsChange('weeklyGoalMinutes', e.target.value)}
                      className="w-40 h-10 px-3 py-2 text-sm glass-effect border-0 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
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
                  className="w-10 h-10 bg-filipino-red rounded-lg flex items-center justify-center"
                >
                  <Bell className="text-white text-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">Notifications</h3>
              </div>
              
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-foreground font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Enable notifications in browser</p>
                  </div>
                  <Switch 
                    checked={pushNotifications}
                    onCheckedChange={(value: boolean) => handleSettingsChange('pushNotifications', value)}
                  />
                </motion.div>

                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-foreground font-medium">Daily Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded to practice daily</p>
                  </div>
                  <Switch 
                    checked={dailyReminders}
                    onCheckedChange={(value: boolean) => handleSettingsChange('dailyReminders', value)}
                  />
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-foreground font-medium">Achievement Alerts</Label>
                    <p className="text-sm text-muted-foreground">Celebrate your milestones</p>
                  </div>
                  <Switch 
                    checked={achievementAlerts}
                    onCheckedChange={(value: boolean) => handleSettingsChange('achievementAlerts', value)}
                  />
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-foreground font-medium">Weekly Progress</Label>
                    <p className="text-sm text-muted-foreground">Weekly learning summary</p>
                  </div>
                  <Switch 
                    checked={weeklyProgress}
                    onCheckedChange={(value: boolean) => handleSettingsChange('weeklyProgress', value)}
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Management */}
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
                  className="w-10 h-10 bg-filipino-blue rounded-lg flex items-center justify-center"
                >
                  <User className="text-white text-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">Account</h3>
              </div>
              
              <div className="space-y-4">
                {/* Change Name */}
                <motion.div whileHover={{ x: 4 }}>
                  <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-white hover:bg-opacity-30 p-4 h-auto"
                        disabled={!canChangeName()}
                      >
                        <User className="mr-4 text-filipino-blue text-xl" />
                        <div className="text-left flex-1">
                          <div className="font-medium text-foreground">Change Display Name</div>
                          <div className="text-sm text-muted-foreground">
                            {canChangeName() 
                              ? `Current: ${userData?.displayName || 'Not set'}` 
                              : `Available in ${getDaysUntilNameChange()} days`
                            }
                          </div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Display Name</DialogTitle>
                        <DialogDescription>
                          Update your display name. Note that you can only change your name once every 30 days.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-name">New Display Name</Label>
                          <Input
                            id="new-name"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            placeholder="Enter new display name"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsNameDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleNameChange}>
                            Update Name
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>

                {/* Change Password */}
                <motion.div whileHover={{ x: 4 }}>
                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-white hover:bg-opacity-30 p-4 h-auto"
                      >
                        <Lock className="mr-4 text-filipino-red text-xl" />
                        <div className="text-left">
                          <div className="font-medium text-foreground">Change Password</div>
                          <div className="text-sm text-muted-foreground">Update your account password</div>
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and choose a new one. Your new password must be at least 6 characters long.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="new-password">New Password</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsPasswordDialogOpen(false);
                              setCurrentPassword('');
                              setNewPassword('');
                              setConfirmPassword('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handlePasswordChange}>
                            Update Password
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance & Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="glass-effect">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center"
                >
                  <Palette className="text-white text-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">Appearance & Privacy</h3>
              </div>
              
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-foreground font-medium">Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <div className="relative">
                    <select 
                      value={theme} 
                      onChange={(e) => handleThemeChange(e.target.value)}
                      className="w-32 h-10 px-3 py-2 text-sm glass-effect border-0 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-foreground font-medium">Private Profile</Label>
                    <p className="text-sm text-muted-foreground">Hide your progress from others</p>
                  </div>
                  <Switch 
                    checked={privateProfile}
                    onCheckedChange={(value: boolean) => handleSettingsChange('privateProfile', value)}
                  />
                </motion.div>

                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label className="text-foreground font-medium">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Share anonymous usage data to improve KaMAY</p>
                  </div>
                  <Switch 
                    checked={dataSharing}
                    onCheckedChange={(value: boolean) => handleSettingsChange('dataSharing', value)}
                  />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="glass-effect">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center"
                >
                  <Shield className="text-white text-lg" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">Account Management</h3>
              </div>
              
              <div className="space-y-4">
                <motion.div whileHover={{ x: 4 }}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white hover:bg-opacity-30 p-4 h-auto"
                    onClick={handleResetProgress}
                  >
                    <Trash2 className="mr-4 text-filipino-red text-xl" />
                    <div className="text-left">
                      <div className="font-medium text-foreground">Reset Progress</div>
                      <div className="text-sm text-muted-foreground">Clear all learning data and start fresh</div>
                    </div>
                  </Button>
                </motion.div>
                
                {/* Developer option for reinitialization - only shown in development */}
                {process.env.NODE_ENV !== 'production' && (
                  <motion.div whileHover={{ x: 4 }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-white hover:bg-opacity-30 p-4 h-auto"
                      onClick={handleReinitializeData}
                    >
                      <RefreshCw className="mr-4 text-green-600 text-xl" />
                      <div className="text-left">
                        <div className="font-medium text-foreground">Reinitialize Lesson Data</div>
                        <div className="text-sm text-muted-foreground">Recreate lesson content with enhanced quiz questions</div>
                      </div>
                    </Button>
                  </motion.div>
                )}
                
                <motion.div whileHover={{ x: 4 }}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-white hover:bg-opacity-30 p-4 h-auto"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-4 text-gray-600 text-xl" />
                    <div className="text-left">
                      <div className="font-medium text-foreground">Sign Out</div>
                      <div className="text-sm text-muted-foreground">Sign out of your account</div>
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