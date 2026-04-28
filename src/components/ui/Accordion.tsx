import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg" style={{ borderColor: '#30363d' }}>
      <button
        onClick={function() { setIsOpen(!isOpen); }}
        className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium transition-colors hover:bg-[#21262d] rounded-t-lg"
        style={{ color: '#8b949e' }}
      >
        {title}
        <ChevronDown
          className={'w-3.5 h-3.5 transition-transform ' + (isOpen ? 'rotate-180' : '')}
        />
      </button>
      {isOpen && (
        <div className="px-3 pb-3 pt-1 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};
