import questionsDb from './triviaFileDb.json';
import { as } from '../../../util/type.utils';

type Categories = 'General Knowledge' | 'Entertainment: Music' | 'Geography';

type TriviaDb = {
  category: Categories;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}[];

const questions = as<TriviaDb>(questionsDb);

function getQuestionsForCategory(category: Categories) {
  return questions.filter((question) => question.category === category);
}

export default {
  getQuestionsForCategory,
};
