import { useState } from 'react';
import { ArrowLeft, ArrowRight, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AudioPlayer from './audio-player';
import { showQuizFeedback } from '@/lib/sweetalert';
import type { Lesson } from '@shared/schema';

interface LessonInterfaceProps {
  lesson: Lesson;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  progress: number;
}

export default function LessonInterface({ 
  lesson, 
  onBack, 
  onNext, 
  onComplete, 
  progress 
}: LessonInterfaceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleQuizAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const isCorrect = lesson.quiz?.[0]?.correctAnswer === optionIndex;
    showQuizFeedback(isCorrect);
    
    if (isCorrect) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop recording
  };

  const quiz = lesson.quiz?.[0];
  const vocabulary = lesson.vocabulary?.[0];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card className="glass-effect p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="glass-effect hover:bg-white hover:bg-opacity-20"
              onClick={onBack}
            >
              <ArrowLeft className="text-gray-700" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{lesson.title}</h2>
              <p className="text-gray-600">Lesson {lesson.lessonNumber} of {16}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Progress</p>
              <p className="font-bold text-filipino-blue">{Math.round(progress)}%</p>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-filipino-blue h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Lesson Content */}
        <div className="bg-white bg-opacity-50 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {vocabulary?.word || "Hello"} - "{vocabulary?.translation || "Kumusta"}"
            </h3>
            <p className="text-gray-600 mb-6">Listen and repeat the pronunciation</p>
            
            {/* Audio Player */}
            {vocabulary?.audioUrl && (
              <div className="mb-6">
                <AudioPlayer audioUrl={vocabulary.audioUrl} />
              </div>
            )}
            
            {/* Record Button */}
            <Button
              className={`glass-effect px-8 py-4 rounded-2xl transition-all group ${
                isRecording ? 'bg-filipino-red bg-opacity-20' : 'hover:bg-filipino-red hover:bg-opacity-20'
              }`}
              variant="ghost"
              onClick={handleRecord}
            >
              <Mic className={`text-filipino-red text-xl mr-3 transition-transform ${
                isRecording ? 'scale-110 animate-pulse' : 'group-hover:scale-110'
              }`} />
              <span className="font-medium text-gray-700">
                {isRecording ? 'Recording...' : 'Record Your Pronunciation'}
              </span>
            </Button>
          </div>
        </div>
        
        {/* Interactive Quiz */}
        {quiz && (
          <div className="bg-white bg-opacity-50 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-gray-800 mb-6">Choose the correct translation:</h4>
            <p className="text-lg text-gray-700 mb-6">"{quiz.question}"</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {quiz.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`glass-effect p-4 rounded-xl text-left transition-all group ${
                    selectedAnswer === index 
                      ? 'bg-filipino-blue bg-opacity-20' 
                      : 'hover:bg-filipino-blue hover:bg-opacity-20'
                  }`}
                  onClick={() => handleQuizAnswer(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 border-2 rounded-full transition-colors ${
                      selectedAnswer === index
                        ? 'bg-filipino-blue border-filipino-blue'
                        : 'border-gray-300 group-hover:border-filipino-blue'
                    }`} />
                    <span className="font-medium text-gray-700">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="ghost"
                className="glass-effect hover:bg-gray-200 hover:bg-opacity-50"
                onClick={onBack}
              >
                <ArrowLeft className="mr-2" />
                Previous
              </Button>
              <Button
                className="bg-filipino-blue text-white hover:bg-blue-700"
                onClick={onNext}
                disabled={selectedAnswer === null}
              >
                Next
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
