
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

export enum GameStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT',
  GAMEOVER = 'GAMEOVER',
  COMPLETED = 'COMPLETED'
}
