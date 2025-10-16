import React, { useState, useEffect } from 'react';
import { LineType } from '../types';

interface TypingEffectProps {
  text: string;
  lineType: LineType;
  className?: string;
}

// Configuration for different line types
const typeConfig = {
  [LineType.Output]: { speed: 25, cursor: '|' },
  [LineType.Info]: { speed: 30, cursor: '|' },
  [LineType.Error]: { speed: 60, cursor: '█' }, // Slower, more deliberate
  [LineType.Guardian]: { speed: 15, cursor: '▋' }, // Fast, aggressive
  [LineType.Input]: { speed: 25, cursor: '|' }, // Default for completeness
};

export const TypingEffect: React.FC<TypingEffectProps> = ({ text, lineType, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const { speed, cursor } = typeConfig[lineType] || typeConfig[LineType.Output];

  useEffect(() => {
    // Reset state for new text
    setDisplayedText('');
    setIsTyping(true);

    if (!text) {
        setIsTyping(false);
        return;
    }

    let i = 0;
    const intervalId = setInterval(() => {
      // Use substring for a cleaner update
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, speed);

    // Cleanup function to clear interval if component unmounts or text changes
    return () => clearInterval(intervalId);
  }, [text, speed]); // Rerun effect if text or speed changes

  return (
    <p className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse">{cursor}</span>}
    </p>
  );
};
