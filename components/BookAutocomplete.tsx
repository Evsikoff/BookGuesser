import React, { useState, useRef, useEffect } from 'react';
import { Book } from '../types';
import { books } from '../data/books';

interface BookAutocompleteProps {
  onSelect: (book: Book) => void;
  disabled: boolean;
  selectedBook: Book | null;
  correctBook: Book;
}

export const BookAutocomplete: React.FC<BookAutocompleteProps> = ({
  onSelect,
  disabled,
  selectedBook,
  correctBook
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const normalizeString = (str: string) =>
    str.toLowerCase().replace(/ё/g, 'е');

  const filteredBooks = query.trim()
    ? books.filter(book => {
        const normalizedQuery = normalizeString(query);
        const normalizedTitle = normalizeString(book.title);
        const normalizedAuthor = normalizeString(book.author);
        return normalizedTitle.includes(normalizedQuery) ||
               normalizedAuthor.includes(normalizedQuery);
      }).slice(0, 10)
    : [];

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredBooks.length]);

  useEffect(() => {
    if (listRef.current && highlightedIndex >= 0) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredBooks.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredBooks[highlightedIndex]) {
          handleSelect(filteredBooks[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (book: Book) => {
    setQuery(`${book.title} — ${book.author}`);
    setIsOpen(false);
    onSelect(book);
  };

  const showDropdown = isOpen && filteredBooks.length > 0 && !disabled && !selectedBook;

  let containerClass = "relative";
  let inputClass = `
    w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all
    focus:outline-none focus:ring-4
  `;

  if (disabled && selectedBook) {
    if (selectedBook.id === correctBook.id) {
      inputClass += " bg-green-100 border-green-500 text-green-800 ring-2 ring-green-200";
    } else {
      inputClass += " bg-red-100 border-red-500 text-red-800";
    }
  } else {
    inputClass += " bg-white border-amber-300 text-stone-800 focus:border-amber-500 focus:ring-amber-100";
  }

  return (
    <div className={containerClass}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Начните вводить название книги или автора..."
          className={inputClass}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600">
          <i className="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      {showDropdown && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-2 bg-white border-2 border-amber-200 rounded-2xl shadow-xl overflow-hidden max-h-80 overflow-y-auto"
        >
          {filteredBooks.map((book, index) => (
            <li
              key={book.id}
              onClick={() => handleSelect(book)}
              className={`
                px-6 py-3 cursor-pointer transition-colors
                ${index === highlightedIndex
                  ? 'bg-amber-100 text-amber-900'
                  : 'hover:bg-amber-50 text-stone-800'}
                ${index !== filteredBooks.length - 1 ? 'border-b border-amber-100' : ''}
              `}
            >
              <div className="font-bold">{book.title}</div>
              <div className="text-sm opacity-70 italic">{book.author}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
