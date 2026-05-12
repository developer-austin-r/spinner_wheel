import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { Button } from './ui/Button';
import confetti from 'canvas-confetti';

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerColor: string;
  winnerIndex: number;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, onClose, winnerColor, winnerIndex }) => {
  React.useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [winnerColor, '#ffffff', '#ffd700']
      });
    }
  }, [isOpen, winnerColor]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-gray-900 border border-white/10 p-8 rounded-[2rem] max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Background Glow */}
            <div 
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: winnerColor }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                <Trophy className="w-10 h-10 text-primary animate-bounce" />
              </div>

              <h2 className="text-3xl font-black text-white tracking-tight mb-2">Winner!</h2>
              <p className="text-gray-400 mb-8">
                The wheel has landed on segment <span className="font-bold text-white">#{winnerIndex + 1}</span>
              </p>

              <div className="flex justify-center mb-8">
                <div 
                  className="w-24 h-24 rounded-full border-8 border-white/10 shadow-2xl relative group"
                  style={{ backgroundColor: winnerColor }}
                >
                    <div className="absolute inset-0 rounded-full animate-ping bg-white/20" />
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                    className="w-full py-4 text-lg font-bold"
                    onClick={onClose}
                >
                    Claim Prize
                </Button>
                <button 
                    onClick={onClose}
                    className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
                >
                    Close
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
