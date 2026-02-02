import { Question } from "../types";
import { getRandomQuestion } from "../data/questions";

export const fetchBookQuestion = async (excludeParagraphIds: string[] = []): Promise<Question | null> => {
  // Небольшая задержка для имитации загрузки
  await new Promise(resolve => setTimeout(resolve, 500));
  return getRandomQuestion(excludeParagraphIds);
};
