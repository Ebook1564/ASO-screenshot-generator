import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null as any);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.top - 35, // Adjusted position
          left: rect.left + rect.width / 2,
        });
        setIsVisible(true);
      }
    }, 200); // 200ms delay for better UX
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className="relative flex items-center justify-center w-full h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div 
          className="fixed z-[9999] px-2 py-1 bg-[#21262d] border border-[#30363d] text-[10px] text-[#c9d1d9] rounded shadow-xl whitespace-nowrap pointer-events-none transform -translate-x-1/2"
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
        >
          {text}
        </div>,
        document.body
      )}
    </>
  );
};
