import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Languages, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function GlassNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/lessons', label: 'Lessons' },
    { href: '/profile', label: 'Profile' },
    { href: '/settings', label: 'Settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return location === '/' || location === '/dashboard';
    return location.startsWith(href);
  };

  return (
    <>
      <nav className="glass-navbar fixed top-0 w-full z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-filipino-blue to-filipino-red rounded-xl flex items-center justify-center">
              <Languages className="text-white text-xl" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">KaMAY</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className={`text-gray-700 hover:text-filipino-blue transition-colors font-medium cursor-pointer ${
                  isActive(item.href) ? 'text-filipino-blue' : ''
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden glass-effect p-2 hover:bg-white hover:bg-opacity-20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-gray-700" />
            ) : (
              <Menu className="text-gray-700" />
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
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span 
                      className={`text-gray-700 hover:text-filipino-blue transition-colors font-medium py-2 block cursor-pointer ${
                        isActive(item.href) ? 'text-filipino-blue' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
