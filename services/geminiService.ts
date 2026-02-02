
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Book } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchBookQuestion = async (): Promise<Question> => {
  const prompt = `Сгенерируй литературное задание на РУССКОМ ЯЗЫКЕ.
  1. Выбери случайный, узнаваемый или характерный абзац (минимум 3-5 предложений) из известного произведения мировой литературы (классика или современность).
  2. Укажи правильное название и автора.
  3. Предложи еще 19 правдоподобных, но неверных названий книг и их авторов.
  4. Убедись, что варианты ответов относятся к похожим жанрам или эпохам, чтобы было сложно.
  5. ВАЖНО: Весь текст (абзац, названия, авторы) должен быть на РУССКОМ ЯЗЫКЕ.
  6. Ответ должен быть валидным JSON-объектом.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          paragraph: { type: Type.STRING, description: "Отрывок из книги." },
          correctBook: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING }
            },
            required: ["title", "author"]
          },
          distractors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING }
              },
              required: ["title", "author"]
            }
          }
        },
        required: ["paragraph", "correctBook", "distractors"]
      }
    }
  });

  const data = JSON.parse(response.text);
  
  // Объединяем правильную книгу с вариантами и перемешиваем
  const allOptions: Book[] = [data.correctBook, ...data.distractors].sort(() => Math.random() - 0.5);

  return {
    paragraph: data.paragraph,
    correctBook: data.correctBook,
    options: allOptions
  };
};
