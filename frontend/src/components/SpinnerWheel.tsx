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
  selectedIndices?: number[];
  onToggleSelect?: (index: number) => void;
  onSpinEnd?: (index: number) => void;
  disabled?: boolean;
}

export const SpinnerWheel: React.FC<SpinnerWheelProps> = ({ 
  size = 320, 
  colors, 
  winnerIndex = null,
  selectedIndices = [],
  onToggleSelect,
  onSpinEnd,
  disabled = false
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
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
    onToggleSelect?.(index);
  };

  const renderSegments = () => {
    return colors.map((color, i) => {
      const startAngle = i * segmentAngle;
      const isSelected = selectedIndices.includes(i);
      const isWinner = winnerIndex === i;

      // Calculate positions radially to ensure consistency across all segments
      const labelAngle = (startAngle + segmentAngle / 2 - 90) * Math.PI / 180;
      
      // Move labels further out to avoid the center circle (which is ~30% radius)
      // and ensure they stay within the wider part of the triangle to avoid clipping
      const labelRadius = 45; // 45% from center
      const labelX = 50 + labelRadius * Math.cos(labelAngle);
      const labelY = 50 + labelRadius * Math.sin(labelAngle);

      // Checkmark slightly further out than the number
      const checkRadius = 68; // 68% from center
      const checkX = 50 + checkRadius * Math.cos(labelAngle);
      const checkY = 50 + checkRadius * Math.sin(labelAngle);

      return (
        <div 
          key={i}
          onClick={() => handleSectionClick(i)}
          className={cn(
            "absolute inset-0 origin-center cursor-pointer transition-all duration-300",
            isSelected && "z-10 scale-[1.02]",
            isWinner && !isSpinning && "z-20 animate-pulse"
          )}
          style={{
            clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((startAngle + segmentAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle + segmentAngle - 90) * Math.PI / 180)}%)`,
            backgroundColor: color,
            filter: isSelected ? 'brightness(1.2) saturate(1.2)' : 'brightness(1)',
            boxShadow: isSelected ? `inset 0 0 40px rgba(255,255,255,0.3)` : 'none',
          }}
        >
          {/* Segment number label */}
          <div 
            className="absolute text-white font-black pointer-events-none text-sm drop-shadow-md"
            style={{ 
              left: `${labelX}%`, 
              top: `${labelY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {i + 1}
          </div>

          {/* Selected checkmark overlay */}
          <AnimatePresence>
            {isSelected && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute pointer-events-none z-30"
                style={{
                  left: `${checkX}%`, 
                  top: `${checkY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-[0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-green-500">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
      
      {/* Selected colors count badge */}
      {selectedIndices.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Selected</div>
          <div className="flex gap-1">
            {selectedIndices.map(idx => (
              <div 
                key={idx}
                className="w-4 h-4 rounded-full shadow-[0_0_6px_rgba(0,0,0,0.5)] border border-white/30" 
                style={{ backgroundColor: colors[idx] }} 
              />
            ))}
          </div>
          <div className="text-sm font-bold text-white">{selectedIndices.length} color{selectedIndices.length > 1 ? 's' : ''}</div>
        </motion.div>
      )}
    </div>
  );
};
