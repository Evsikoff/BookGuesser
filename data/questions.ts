import { Book, Question } from "../types";
import { books } from "./books";
import { paragraphs } from "./paragraphs";

const booksById = new Map<string, Book>(books.map((book) => [book.id, book]));

const getBookOrThrow = (bookId: string): Book => {
  const book = booksById.get(bookId);
  if (!book) {
    throw new Error(`Unknown book id: ${bookId}`);
  }
  return book;
};

export function getRandomQuestion(): Question {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  const paragraph = paragraphs[randomIndex];

  const correctBook = getBookOrThrow(paragraph.bookId);
  const distractors = paragraph.distractorBookIds.map(getBookOrThrow);

  const options: Book[] = [correctBook, ...distractors]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);

  return {
    paragraph: paragraph.text,
    correctBook,
    options
  };
}
