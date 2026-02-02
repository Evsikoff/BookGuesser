
export interface Book {
  title: string;
  author: string;
}

export interface Question {
  paragraph: string;
  correctBook: Book;
  options: Book[];
}

export enum GameStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  RESULT = 'RESULT',
  GAMEOVER = 'GAMEOVER'
}
