import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SpinnerWheelProps {
  size?: number;
  colors: string[];
  winnerIndex?: number | null;
  onSelect?: (index: number) => void;
  onSpinEnd?: (index: number) => void;
  disabled?: boolean;
}

export const SpinnerWheel: React.FC<SpinnerWheelProps> = ({ 
  size = 320, 
  colors, 
  winnerIndex = null,
  onSelect,
  onSpinEnd,
  disabled = false
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segmentAngle = 360 / colors.length;

  // Handle automatic spin when winnerIndex is set
  useEffect(() => {
    if (winnerIndex !== null && !isSpinning) {
      setIsSpinning(true);
      
      const baseRotations = 5 * 360; // 5 full spins
      const segmentOffset = -(winnerIndex * segmentAngle) - (segmentAngle / 2);
      const finalRotation = rotation + baseRotations + (360 - (rotation % 360)) + segmentOffset;
      
      setRotation(finalRotation);

      const timer = setTimeout(() => {
        setIsSpinning(false);
        onSpinEnd?.(winnerIndex);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [winnerIndex]);

  const handleSectionClick = (index: number) => {
    if (isSpinning || disabled) return;
    setSelectedIndex(index);
    onSelect?.(index);
  };

  const renderSegments = () => {
    return colors.map((color, i) => {
      const startAngle = i * segmentAngle;
      const isSelected = selectedIndex === i;
      const isWinner = winnerIndex === i;

      return (
        <div 
          key={i}
          onClick={() => handleSectionClick(i)}
          className={cn(
            "absolute inset-0 origin-center cursor-pointer transition-all duration-300",
            isSelected && "z-10 scale-[1.02] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]",
            isWinner && !isSpinning && "z-20 animate-pulse"
          )}
          style={{
            clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((startAngle + segmentAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle + segmentAngle - 90) * Math.PI / 180)}%)`,
            backgroundColor: color,
            border: isSelected ? '2px solid white' : 'none'
          }}
        >
          <div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold pointer-events-none"
            style={{ transform: `rotate(${(i * segmentAngle) + segmentAngle / 2}deg)` }}
          >
            {i + 1}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 group relative">
      <div className="relative">
        <AnimatePresence>
          {winnerIndex !== null && !isSpinning && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-full bg-yellow-400/30 blur-3xl"
              style={{ backgroundColor: colors[winnerIndex] + '44' }}
            />
          )}
        </AnimatePresence>
        
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 w-8 h-8">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] relative">
            <div className="absolute -top-[27px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>

        <motion.div 
          ref={wheelRef}
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }}
          className={cn(
            "relative rounded-full border-[10px] border-white/10 dark:border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.4)] overflow-hidden bg-gray-900",
            disabled && "opacity-80 grayscale-[0.2]"
          )}
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
          }}
        >
          {renderSegments()}
          <div className="absolute inset-0 rounded-full border-[1px] border-white/20 pointer-events-none" />
          <div className="absolute inset-[15%] rounded-full border-[1px] border-white/10 pointer-events-none" />
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
           <div className="w-24 h-24 rounded-full bg-gray-900 shadow-[0_0_30px_rgba(0,0,0,0.8)] border-4 border-white/10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <div className="relative text-xl font-black text-white tracking-widest italic">
                LUCKY
              </div>
           </div>
        </div>
      </div>
      
      {selectedIndex !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Selected</div>
          <div 
            className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
            style={{ backgroundColor: colors[selectedIndex] }} 
          />
          <div className="text-sm font-bold text-white">Color {selectedIndex + 1}</div>
        </motion.div>
      )}
    </div>
  );
};
