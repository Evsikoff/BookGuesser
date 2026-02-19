
export interface Book {
  id: string;
  title: string;
  author: string;
}

export interface Paragraph {
  id: string;
  text: string;
  bookId: string;
  distractorBookIds: string[];
}

export interface Question {
  paragraphId: string;
  paragraph: string;
  correctBook: Book;
  options: Book[];
}

export interface FailedQuestion {
  paragraphId: string;
  failedAt: number; // timestamp
}

export enum GameStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT',
  GAMEOVER = 'GAMEOVER',
  COMPLETED = 'COMPLETED'
}
