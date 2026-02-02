
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { BookOption } from './components/BookOption';
import { fetchBookQuestion } from './services/geminiService';
import { Question, Book, GameStatus } from './types';
import { paragraphs } from './data/paragraphs';

const STORAGE_KEY = "bookguesser.correctParagraphIds";

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [solvedParagraphIds, setSolvedParagraphIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => typeof item === "string");
    } catch {
      return [];
    }
  });

  const persistSolvedParagraphIds = useCallback((ids: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, []);

  const startNewRound = useCallback(async () => {
    setStatus(GameStatus.LOADING);
    setSelectedBook(null);
    setError(null);
    try {
      const question = await fetchBookQuestion(solvedParagraphIds);
      if (!question) {
        setCurrentQuestion(null);
        setStatus(GameStatus.COMPLETED);
        return;
      }
      setCurrentQuestion(question);
      setStatus(GameStatus.PLAYING);
    } catch (err) {
      console.error(err);
      setError("Не удалось связаться с литературными архивами. Пожалуйста, попробуйте снова.");
      setStatus(GameStatus.IDLE);
    }
  }, [solvedParagraphIds]);

  const handleSelect = (book: Book) => {
    if (status !== GameStatus.PLAYING || !currentQuestion) return;
    
    setSelectedBook(book);
    const isCorrect = book.id === currentQuestion.correctBook.id;
    
    if (isCorrect) {
      setScore(prev => prev + 100 + (streak * 25));
      setStreak(prev => prev + 1);
      setSolvedParagraphIds((prev) => {
        if (prev.includes(currentQuestion.paragraphId)) return prev;
        const next = [...prev, currentQuestion.paragraphId];
        persistSolvedParagraphIds(next);
        return next;
      });
    } else {
      setStreak(0);
    }
    
    setStatus(GameStatus.RESULT);
  };

  const resetProgress = useCallback(() => {
    setSolvedParagraphIds([]);
    persistSolvedParagraphIds([]);
    setScore(0);
    setStreak(0);
    setSelectedBook(null);
    setCurrentQuestion(null);
    setStatus(GameStatus.IDLE);
  }, [persistSolvedParagraphIds]);

  const isSelected = (book: Book) => selectedBook?.id === book.id;
  const isCorrect = (book: Book) => currentQuestion?.correctBook.id === book.id;

  return (
    <Layout>
      {status === GameStatus.IDLE && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 text-center max-w-xl mx-auto">
          <div className="w-20 h-20 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-4 serif">Добро пожаловать, Библиофил</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Я представлю вам один абзац из известного литературного произведения.
            Ваша задача — узнать книгу из 20 предложенных вариантов.
            Точность важна, а серии правильных ответов приносят бонусные очки.
          </p>
          <button
            onClick={startNewRound}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Войти в библиотеку
          </button>
          {error && <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>}
        </div>
      )}

      {status === GameStatus.COMPLETED && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 text-center max-w-xl mx-auto">
          <div className="w-20 h-20 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
            <i className="fa-solid fa-crown"></i>
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-4 serif">РџРѕР·РґСЂР°РІР»СЏРµРј!</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Р’С‹ РѕС‚РІРµС‚РёР»Рё РїСЂР°РІРёР»СЊРЅРѕ РЅР° РІСЃРµ СЃР»РѕР¶РЅС‹Рµ РѕС‚СЂС‹РІРєРё. Р’РѕРїСЂРѕСЃС‹ Р·Р°РєРѕРЅС‡РёР»РёСЃСЊ.
            Р’С‹ РѕС‚РєСЂС‹Р»Рё {solvedParagraphIds.length} / {paragraphs.length} РїСЂРѕРёР·РІРµРґРµРЅРёР№.
          </p>
          <button
            onClick={resetProgress}
            className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            РРіСЂР°С‚СЊ Р·Р°РЅРѕРІРѕ
          </button>
        </div>
      )}

      {status === GameStatus.LOADING && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-24 h-24 mb-6">
             <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-amber-700 rounded-full border-t-transparent animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center text-amber-700 text-2xl">
               <i className="fa-solid fa-feather-pointed"></i>
             </div>
          </div>
          <p className="text-stone-500 font-medium animate-pulse">Советуемся с классиками...</p>
        </div>
      )}

      {(status === GameStatus.PLAYING || status === GameStatus.RESULT) && currentQuestion && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white px-6 py-3 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-bold uppercase tracking-widest text-xs">Счет</span>
              <span className="text-xl font-bold text-stone-800">{score}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                <i className="fa-solid fa-fire text-amber-600 text-xs"></i>
                <span className="text-amber-800 font-bold text-xs">СЕРИЯ: {streak}</span>
              </div>
            )}
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-lg border border-stone-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-700">
              <i className="fa-solid fa-quote-right text-9xl"></i>
            </div>
            <p className="serif text-xl sm:text-2xl text-stone-800 leading-relaxed relative z-10 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-amber-800 italic">
              {currentQuestion.paragraph}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentQuestion.options.map((book, idx) => (
              <BookOption
                key={`${book.id}-${idx}`}
                book={book}
                onClick={() => handleSelect(book)}
                disabled={status === GameStatus.RESULT}
                isSelected={isSelected(book)}
                isCorrect={isCorrect(book)}
              />
            ))}
          </div>

          {status === GameStatus.RESULT && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-stone-200 flex flex-col items-center animate-slide-up z-50">
               <div className="max-w-4xl w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {selectedBook?.id === currentQuestion.correctBook.id ? (
                      <div className="flex items-center gap-3 text-green-700">
                         <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-check"></i>
                         </div>
                         <div className="flex flex-col">
                            <span className="font-bold">Великолепно!</span>
                            <span className="text-sm opacity-80">Вы отлично знаете эту главу.</span>
                         </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-red-700">
                         <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-xmark"></i>
                         </div>
                         <div className="flex flex-col">
                            <span className="font-bold">Не совсем так.</span>
                            <span className="text-sm opacity-80">Это было произведение <span className="font-bold italic">«{currentQuestion.correctBook.title}»</span></span>
                         </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={startNewRound}
                    className="w-full sm:w-auto bg-stone-800 hover:bg-stone-900 text-white font-bold py-3 px-12 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Следующий отрывок
                  </button>
               </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
