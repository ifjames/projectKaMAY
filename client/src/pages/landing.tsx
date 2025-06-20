import { motion } from 'framer-motion';
import { Languages, BookOpen, Trophy, Users, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Landing() {
  const handleLogin = () => {
    localStorage.setItem('kamay_auth', 'true');
    window.location.reload();
  };

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Lessons",
      description: "Learn through engaging audio and visual content"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Earn points and unlock certificates"
    },
    {
      icon: Users,
      title: "Multiple Dialects",
      description: "Hiligaynon, Waray, Bikol, and Ilocano"
    }
  ];

  return (
    <div className="min-h-screen cultural-pattern">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 py-20"
        >
          <div className="text-center">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-8"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-filipino-yellow via-filipino-red to-filipino-blue rounded-full mx-auto flex items-center justify-center relative overflow-hidden">
                <Languages className="text-white text-5xl" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white bg-opacity-20 rounded-full"
                />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl font-bold text-gray-800 mb-6"
            >
              Learn Filipino <span className="text-filipino-blue">Dialects</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Master the beautiful regional languages of the Philippines through interactive lessons, 
              audio pronunciation guides, and engaging quizzes.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-x-4"
            >
              <Button
                size="lg"
                className="bg-filipino-blue text-white hover:bg-blue-700 px-8 py-4 text-lg"
                onClick={handleLogin}
              >
                <Play className="mr-2" />
                Start Learning
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass-effect border-filipino-blue text-filipino-blue hover:bg-filipino-blue hover:text-white px-8 py-4 text-lg"
              >
                Learn More
                <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose KaMAY?</h2>
            <p className="text-xl text-gray-600">Experience the most comprehensive Filipino dialect learning platform</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
              >
                <Card className="glass-effect hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 bg-gradient-to-r from-filipino-blue to-filipino-red rounded-xl flex items-center justify-center mx-auto mb-6"
                    >
                      <feature.icon className="text-white text-2xl" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="glass-effect rounded-3xl p-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-600 mb-8">Join thousands of learners discovering the richness of Filipino culture through language.</p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-filipino-blue to-filipino-red text-white hover:shadow-lg px-12 py-4 text-lg"
              onClick={handleLogin}
            >
              Get Started Free
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}