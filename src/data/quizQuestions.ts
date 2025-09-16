import { QuizQuestion } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What is the maximum speed limit for trucks on European highways?',
    options: ['80 km/h', '90 km/h', '100 km/h', '110 km/h'],
    correctAnswer: 1 // Index 1 = 90 km/h
  },
  {
    id: '2',
    question: 'How many hours can a truck driver drive continuously without a break?',
    options: ['3 hours', '4.5 hours', '6 hours', '8 hours'],
    correctAnswer: 1 // Index 1 = 4.5 hours
  },
  {
    id: '3',
    question: 'What is the minimum rest period required after 9 hours of driving?',
    options: ['9 hours', '11 hours', '12 hours', '15 hours'],
    correctAnswer: 1 // Index 1 = 11 hours
  },
  {
    id: '4',
    question: 'Which document is required for international truck driving in Europe?',
    options: ['National driving license only', 'International driving permit', 'Passport only', 'Work visa only'],
    correctAnswer: 1 // Index 1 = International driving permit
  },
  {
    id: '5',
    question: 'What is the maximum weight limit for a truck and trailer combination in most EU countries?',
    options: ['38 tons', '40 tons', '42 tons', '44 tons'],
    correctAnswer: 3 // Index 3 = 44 tons
  },
  {
    id: '6',
    question: 'When must you use headlights while driving a truck in Europe?',
    options: ['Only at night', 'During rain and fog', 'Always during daytime', 'Only in tunnels'],
    correctAnswer: 2 // Index 2 = Always during daytime
  },
  {
    id: '7',
    question: 'What is the minimum following distance for trucks on highways?',
    options: ['2 seconds', '3 seconds', '5 seconds', '7 seconds'],
    correctAnswer: 2 // Index 2 = 5 seconds
  },
  {
    id: '8',
    question: 'Which side of the road do you drive on in most European countries?',
    options: ['Left side', 'Right side', 'Either side', 'Depends on the country'],
    correctAnswer: 1 // Index 1 = Right side
  },
  {
    id: '9',
    question: 'What should you do if your truck breaks down on a highway?',
    options: ['Continue driving slowly', 'Stop on the hard shoulder and use warning triangle', 'Stop in the right lane', 'Call for help without warning signs'],
    correctAnswer: 1 // Index 1 = Stop on the hard shoulder and use warning triangle
  },
  {
    id: '10',
    question: 'What is the blood alcohol limit for commercial truck drivers in most EU countries?',
    options: ['0.05%', '0.02%', '0.00%', '0.08%'],
    correctAnswer: 2 // Index 2 = 0.00%
  }
];