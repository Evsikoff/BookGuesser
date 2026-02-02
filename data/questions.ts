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

export function getRandomQuestion(excludeParagraphIds: string[] = []): Question | null {
  const excluded = new Set(excludeParagraphIds);
  const availableParagraphs = paragraphs.filter((item) => !excluded.has(item.id));

  if (availableParagraphs.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableParagraphs.length);
  const paragraph = availableParagraphs[randomIndex];

  const correctBook = getBookOrThrow(paragraph.bookId);
  const distractors = paragraph.distractorBookIds.map(getBookOrThrow);

  const options: Book[] = [correctBook, ...distractors]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);

  return {
    paragraphId: paragraph.id,
    paragraph: paragraph.text,
    correctBook,
    options
  };
}
