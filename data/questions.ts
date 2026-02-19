import { Book, Question, FailedQuestion } from "../types";
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

function buildQuestion(paragraphId: string): Question {
  const paragraph = paragraphs.find((p) => p.id === paragraphId);
  if (!paragraph) {
    throw new Error(`Unknown paragraph id: ${paragraphId}`);
  }

  const correctBook = getBookOrThrow(paragraph.bookId);
  const distractors = paragraph.distractorBookIds.map(getBookOrThrow);

  const options: Book[] = [correctBook, ...distractors]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);

  return {
    paragraphId: paragraph.id,
    paragraph: paragraph.text,
    correctBook,
    options,
    difficulty: paragraph.difficulty
  };
}

export function getRandomQuestion(
  solvedParagraphIds: string[] = [],
  failedQuestions: FailedQuestion[] = []
): Question | null {
  const solvedSet = new Set(solvedParagraphIds);
  const failedSet = new Set(failedQuestions.map((f) => f.paragraphId));

  // 1. Найти отрывки, которые ещё не были показаны пользователю
  const unseenParagraphs = paragraphs.filter(
    (item) => !solvedSet.has(item.id) && !failedSet.has(item.id)
  );

  if (unseenParagraphs.length > 0) {
    // Выбрать случайный из непоказанных
    const randomIndex = Math.floor(Math.random() * unseenParagraphs.length);
    return buildQuestion(unseenParagraphs[randomIndex].id);
  }

  // 2. Все отрывки были показаны, выбрать из проваленных
  // тот, на который ошиблись раньше всего
  if (failedQuestions.length > 0) {
    const sorted = [...failedQuestions].sort((a, b) => a.failedAt - b.failedAt);
    return buildQuestion(sorted[0].paragraphId);
  }

  // 3. Всё решено, вопросов больше нет
  return null;
}
