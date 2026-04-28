import React, { useRef, useEffect, useState } from 'react';
import { TextElement } from '../../types';

interface TextElementComponentProps {
  element: TextElement;
  style: React.CSSProperties;
  onMouseDown: (e: React.MouseEvent, element: TextElement) => void;
  renderResizeHandles: () => React.ReactNode;
}

export const TextElementComponent: React.FC<TextElementComponentProps> = ({
  element,
  style,
  onMouseDown,
  renderResizeHandles,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [autoFitFontSize, setAutoFitFontSize] = useState(element.fontSize);

  useEffect(() => {
    if (element.autoFit && textRef.current) {
      const el = textRef.current;
      let lo = 8;
      let hi = element.fontSize;
      let best = element.fontSize;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        el.style.fontSize = mid + 'px';
        if (el.scrollWidth <= element.width && el.scrollHeight <= element.height) {
          best = mid;
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      setAutoFitFontSize(best);
    } else {
      setAutoFitFontSize(element.fontSize);
    }
  }, [element.content, element.fontSize, element.autoFit, element.width, element.height]);

  const renderStyle = {
    ...style,
    fontSize: element.autoFit ? autoFitFontSize : element.fontSize,
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start',
    overflow: 'hidden',
    wordBreak: 'break-word' as const,
  };

  return (
    <div
      ref={textRef}
      style={renderStyle}
      onMouseDown={(e) => onMouseDown(e, element as any)}
    >
      {element.content}
      {renderResizeHandles()}
    </div>
  );
};
