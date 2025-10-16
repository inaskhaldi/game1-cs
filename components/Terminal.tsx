import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine, LineType } from '../types';
import { TypingEffect } from './TypingEffect';

interface TerminalProps {
  history: TerminalLine[];
  onCommand: (command: string) => void;
  isLoading: boolean;
}

const renderLine = (line: TerminalLine, index: number) => {
  const baseClasses = "whitespace-pre-wrap break-words";
  let lineClasses = "";

  switch (line.type) {
    case LineType.Input:
      return (
        <div key={index} className="flex items-start">
          <span className="text-cyan-400 mr-2 text-glow-cyan">{'>'}</span>
          <span className={`${baseClasses} text-white`}>{line.text}</span>
        </div>
      );
    case LineType.Output:
      lineClasses = "text-green-400";
      break;
    case LineType.Error:
      lineClasses = "text-red-500";
      break;
    case LineType.Info:
      lineClasses = "text-yellow-400";
      break;
    case LineType.Guardian:
        lineClasses = "text-red-400 text-glow-red font-bold";
        break;
  }

  if (line.isTyping) {
     return <TypingEffect key={index} text={line.text} lineType={line.type} className={`${baseClasses} ${lineClasses}`} />;
  }
  
  return <p key={index} className={`${baseClasses} ${lineClasses}`}>{line.text}</p>;
};


export const Terminal: React.FC<TerminalProps> = ({ history, onCommand, isLoading }) => {
  const [input, setInput] = useState('');
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCommand(input);
      setInput('');
    }
  };

  return (
    <div className="h-[65vh] flex flex-col p-4 bg-black/80">
      <div className="flex-grow overflow-y-auto pr-4 scrollbar-hide">
        {history.map(renderLine)}
        <div ref={endOfHistoryRef} />
      </div>
      <div className="flex items-center mt-4">
        <span className="text-cyan-400 mr-2 text-glow-cyan">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none text-white w-full focus:outline-none focus:ring-0"
          placeholder={isLoading ? "Processing..." : "Enter command (e.g., 'help')"}
          disabled={isLoading}
          autoFocus
        />
      </div>
    </div>
  );
};
