import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Languages, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function GlassNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { currentUser, userData, logout } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/lessons', label: 'Lessons' },
    { href: '/profile', label: 'Profile' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return location === '/' || location === '/dashboard';
    return location.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "Successfully signed out of KaMAY.",
      });
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message || "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <nav className="glass-navbar fixed top-0 w-full z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-filipino-blue to-filipino-red rounded-xl flex items-center justify-center">
              <Languages className="text-white text-lg sm:text-xl" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">KaMAY</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className={`text-foreground hover:text-filipino-blue transition-colors font-medium cursor-pointer ${
                  isActive(item.href) ? 'text-filipino-blue' : ''
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
            
            {/* User Info & Logout */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-filipino-blue rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-foreground font-medium hidden lg:block">
                  {userData?.displayName || currentUser?.displayName || 'User'}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-foreground hover:text-filipino-red hover:bg-white hover:bg-opacity-20"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden glass-effect p-2 hover:bg-white hover:bg-opacity-20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-foreground" />
            ) : (
              <Menu className="text-foreground" />
            )}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 glass-effect rounded-2xl p-4 mx-4 overflow-hidden"
            >
              <div className="flex flex-col space-y-3">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 rounded-xl mb-3">
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-filipino-blue rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <p className="text-foreground font-medium text-sm">
                      {userData?.displayName || currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
                
                {/* Navigation Items */}
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span 
                      className={`text-foreground hover:text-filipino-blue transition-colors font-medium py-3 px-2 block cursor-pointer rounded-lg hover:bg-white hover:bg-opacity-10 ${
                        isActive(item.href) ? 'text-filipino-blue bg-white bg-opacity-10' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
                
                {/* Logout Button */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-foreground hover:text-filipino-red hover:bg-white hover:bg-opacity-20 justify-start px-2 mt-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
