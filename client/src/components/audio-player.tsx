import { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/hooks/use-audio';
import { showInfoAlert } from '@/lib/sweetalert';

interface AudioPlayerProps {
  audioUrl: string;
  text?: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({ audioUrl, text = "Play Audio", autoPlay = false }: AudioPlayerProps) {
  const { isPlaying, play, pause } = useAudio();

  const handlePlayPause = async () => {
    if (isPlaying) {
      pause();
    } else {
      try {
        await play(audioUrl);
        showInfoAlert('Playing Audio', 'Listen carefully to the pronunciation');
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  };

  const waveforms = Array.from({ length: 5 }, (_, i) => (
    <motion.div
      key={i}
      className="w-1 bg-filipino-blue rounded-full"
      animate={{
        height: isPlaying ? [8, 48, 24, 40, 32] : [8, 8, 8, 8, 8],
      }}
      transition={{
        duration: 1.5,
        repeat: isPlaying ? Infinity : 0,
        ease: "easeInOut",
        delay: i * 0.1,
      }}
    />
  ));

  return (
    <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto">
      <Button
        onClick={handlePlayPause}
        className="w-full flex items-center justify-center space-x-4 p-4 bg-transparent hover:bg-white hover:bg-opacity-20 transition-all"
        variant="ghost"
      >
        <div className="flex space-x-1 h-12 items-end">
          {waveforms}
        </div>
        {isPlaying ? (
          <Pause className="text-2xl text-filipino-blue" />
        ) : (
          <Play className="text-2xl text-filipino-blue" />
        )}
        <span className="font-medium text-gray-700">{text}</span>
      </Button>
    </div>
  );
}
