import { Question, FailedQuestion } from "../types";
import { getRandomQuestion } from "../data/questions";

export const fetchBookQuestion = async (
  solvedParagraphIds: string[] = [],
  failedQuestions: FailedQuestion[] = []
): Promise<Question | null> => {
  // Небольшая задержка для имитации загрузки
  await new Promise(resolve => setTimeout(resolve, 500));
  return getRandomQuestion(solvedParagraphIds, failedQuestions);
};
