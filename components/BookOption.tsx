
import React from 'react';
import { Book } from '../types';

interface BookOptionProps {
  book: Book;
  onClick: () => void;
  disabled: boolean;
  isCorrect?: boolean;
  isSelected?: boolean;
}

export const BookOption: React.FC<BookOptionProps> = ({ 
  book, 
  onClick, 
  disabled, 
  isCorrect, 
  isSelected 
}) => {
  let bgColor = "bg-white hover:bg-stone-50 border-stone-200 text-stone-800";
  
  if (disabled) {
    if (isCorrect) {
      bgColor = "bg-green-100 border-green-500 text-green-800 ring-2 ring-green-200";
    } else if (isSelected && !isCorrect) {
      bgColor = "bg-red-100 border-red-500 text-red-800";
    } else {
      bgColor = "bg-stone-100 border-stone-100 text-stone-400 opacity-60";
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left p-3 rounded-xl border-2 transition-all duration-200
        flex flex-col gap-0.5 shadow-sm
        ${bgColor}
        ${!disabled ? 'hover:shadow-md hover:-translate-y-0.5 active:translate-y-0' : ''}
      `}
    >
      <span className="font-bold text-sm line-clamp-1">{book.title}</span>
      <span className="text-xs opacity-70 italic line-clamp-1">{book.author}</span>
    </button>
  );
};
