import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Clock, CheckCircle, XCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storageUtils } from '@/utils/storage';
import { quizQuestions } from '@/data/quizQuestions';
import { toast } from 'sonner';
import gsap from 'gsap';

export const Quiz: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    if (!user) return;

    const profile = storageUtils.getProfile(user.id);
    if (!profile || !profile.personal.firstName || !profile.passport.number) {
      toast.error('Please complete your profile first');
      navigate('/candidate/profile');
      return;
    }

    // Animate quiz card
    gsap.fromTo('.quiz-card', 
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );
  }, [user, navigate]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  // Set selected answer when navigating between questions
  useEffect(() => {
    setSelectedAnswer(answers[currentQuestion]);
  }, [currentQuestion, answers]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers(new Array(quizQuestions.length).fill(null));
    setSelectedAnswer(null);
    setTimeLeft(600);
    setQuizCompleted(false);
    setShowResults(false);
    setScore(0);
    setCorrectAnswers(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    // Update answers array
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      
      // Animate question change
      gsap.fromTo('.question-content', 
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      
      // Animate question change
      gsap.fromTo('.question-content', 
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    
    // Calculate score based on answers
    answers.forEach((answer, index) => {
      if (answer !== null && answer === quizQuestions[index].correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / quizQuestions.length) * 100);
    setScore(finalScore);
    setCorrectAnswers(correctCount);
    setQuizCompleted(true);
    setShowResults(true);

    // Save quiz result
    if (user) {
      const profile = storageUtils.getProfile(user.id);
      if (profile) {
        const updatedProfile = {
          ...profile,
          quizScore: finalScore,
          status: finalScore >= 70 ? 'documents_pending' as const : 'quiz_pending' as const,
        };
        storageUtils.saveProfile(updatedProfile);
      }
    }

    // Show result message
    if (finalScore >= 70) {
      toast.success(`🎉 Congratulations! You passed with ${finalScore}%`);
    } else {
      toast.error(`You need 70% to pass. You scored ${finalScore}%`);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <Layout title="Driving Knowledge Quiz">
        <div className="max-w-2xl mx-auto">
          <Card className="quiz-card shadow-large">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-brand-100 flex items-center justify-center">
                <Award className="h-10 w-10 text-brand-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">European Driving Quiz</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Test your knowledge of European driving regulations and safety
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="bg-gradient-to-r from-brand-50 to-blue-50 p-6 rounded-xl border border-brand-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-brand-600 mr-2" />
                  Quiz Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-brand-600 rounded-full mr-3"></div>
                    10 questions about European driving
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-brand-600 rounded-full mr-3"></div>
                    10 minutes time limit
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-brand-600 rounded-full mr-3"></div>
                    70% score required to pass
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-brand-600 rounded-full mr-3"></div>
                    Retake available if needed
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-6">
                <Button onClick={startQuiz} size="lg" className="px-12 py-3 text-lg bg-brand-600 hover:bg-brand-700">
                  Start Quiz
                </Button>
                
                <Button variant="ghost" onClick={() => navigate('/candidate/dashboard')} className="text-gray-600">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (showResults) {
    return (
      <Layout title="Quiz Results">
        <div className="max-w-2xl mx-auto">
          <Card className="quiz-card shadow-large">
            <CardHeader className="text-center pb-8">
              <div className={`mx-auto mb-6 h-20 w-20 rounded-full flex items-center justify-center ${
                score >= 70 ? 'bg-success-100' : 'bg-danger-100'
              }`}>
                {score >= 70 ? (
                  <CheckCircle className="h-10 w-10 text-success-600" />
                ) : (
                  <XCircle className="h-10 w-10 text-danger-600" />
                )}
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                {score >= 70 ? 'Congratulations!' : 'Quiz Complete'}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {score >= 70 ? 'You passed the driving knowledge quiz!' : 'You can retake the quiz to improve your score'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4 text-gray-900">{score}%</div>
                <Badge 
                  variant={score >= 70 ? 'default' : 'destructive'} 
                  className={`text-lg px-6 py-2 ${
                    score >= 70 ? 'bg-success-600 hover:bg-success-700' : 'bg-danger-600 hover:bg-danger-700'
                  }`}
                >
                  {score >= 70 ? 'PASSED' : 'FAILED'}
                </Badge>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Quiz Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{correctAnswers}</div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{quizQuestions.length - correctAnswers}</div>
                    <div className="text-sm text-gray-600">Incorrect Answers</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Passing Score Required:</span>
                    <span className="font-semibold text-gray-900">70%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                {score < 70 && (
                  <Button onClick={startQuiz} className="flex-1 bg-brand-600 hover:bg-brand-700">
                    Retake Quiz
                  </Button>
                )}
                
                <Button 
                  variant={score >= 70 ? 'default' : 'outline'}
                  onClick={() => navigate('/candidate/dashboard')}
                  className={`flex-1 ${score >= 70 ? 'bg-success-600 hover:bg-success-700' : ''}`}
                >
                  {score >= 70 ? 'Continue to Documents' : 'Back to Dashboard'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  return (
    <Layout title="Driving Knowledge Quiz">
      <div className="max-w-3xl mx-auto">
        <Card className="quiz-card shadow-large">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-gray-500">Time Remaining</div>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {currentQuestion + 1} / {quizQuestions.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent>
            <div className="question-content space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-900 leading-relaxed">
                  {question.question}
                </h3>
                
                <RadioGroup
                  value={selectedAnswer?.toString() || ''}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  className="space-y-4"
                >
                  {question.options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-4 p-4 border-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer ${
                        selectedAnswer === index ? 'border-brand-500 bg-brand-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`}
                        className="text-brand-600"
                      />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 cursor-pointer text-gray-900 font-medium"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleSubmitQuiz}
                    className="text-danger-600 border-danger-200 hover:bg-danger-50"
                  >
                    Submit Quiz
                  </Button>
                </div>
                
                <Button 
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="bg-brand-600 hover:bg-brand-700"
                >
                  {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};