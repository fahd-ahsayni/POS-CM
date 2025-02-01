import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface NumericKeypadProps {
  onClose: () => void;
  onKeyPress: (key: string) => void;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onClose, onKeyPress }) => {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const headerRef = useRef<HTMLDivElement>(null);

  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', '-']
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && (headerRef.current === e.target || headerRef.current.contains(e.target as Node))) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault(); // Prevent text selection while dragging
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={`fixed bg-white rounded-lg shadow-xl p-4 select-none ${
        isDragging ? 'opacity-80' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '240px',
        zIndex: 1000
      }}
    >
      <div
        ref={headerRef}
        className="flex justify-between items-center mb-4 cursor-move bg-gray-50 -m-4 p-4 rounded-t-lg"
        onMouseDown={handleMouseDown}
      >
        <div className="text-sm font-semibold text-gray-700">
          Numeric Keypad
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="h-14 rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 
                         transition-colors flex items-center justify-center text-gray-700
                         font-medium text-xl"
              >
                {key}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NumericKeypad;