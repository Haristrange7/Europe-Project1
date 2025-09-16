import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { storageUtils } from '@/utils/storage';
import { quizQuestions } from '@/data/quizQuestions';
import { toast } from 'sonner';
import gsap from 'gsap';

export const Quiz: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

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

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setTimeLeft(600);
    setQuizCompleted(false);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error('Please select an answer');
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setSelectedAnswer(null);

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

  const handleSubmitQuiz = () => {
    const finalAnswers = [...answers];
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestion] = selectedAnswer;
    }

    let correctAnswers = 0;
    finalAnswers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100);
    setScore(finalScore);
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
      toast.success(`Congratulations! You passed with ${finalScore}%`);
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
          <Card className="quiz-card">
            <CardHeader className="text-center">
              <Award className="h-16 w-16 mx-auto text-primary mb-4" />
              <CardTitle className="text-2xl">European Driving Quiz</CardTitle>
              <CardDescription>
                Test your knowledge of European driving regulations and safety
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">Quiz Information:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 10 questions about European driving regulations</li>
                  <li>• 10 minutes time limit</li>
                  <li>• 70% score required to pass</li>
                  <li>• You can retake the quiz if needed</li>
                </ul>
              </div>
              
              <div className="text-center space-y-4">
                <Button onClick={startQuiz} size="lg" className="px-12">
                  Start Quiz
                </Button>
                
                <div className="flex justify-center">
                  <Button variant="ghost" onClick={() => navigate('/candidate/dashboard')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </div>
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
          <Card className="quiz-card">
            <CardHeader className="text-center">
              {score >= 70 ? (
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              )}
              <CardTitle className="text-2xl">
                {score >= 70 ? 'Congratulations!' : 'Quiz Complete'}
              </CardTitle>
              <CardDescription>
                {score >= 70 ? 'You passed the driving knowledge quiz' : 'You can retake the quiz to improve your score'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{score}%</div>
                <Badge variant={score >= 70 ? 'default' : 'destructive'} className="text-lg px-4 py-2">
                  {score >= 70 ? 'PASSED' : 'FAILED'}
                </Badge>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Correct Answers:</span>
                  <span className="font-semibold">{Math.round(score * quizQuestions.length / 100)} / {quizQuestions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Passing Score:</span>
                  <span className="font-semibold">70%</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                {score < 70 && (
                  <Button onClick={startQuiz} className="flex-1">
                    Retake Quiz
                  </Button>
                )}
                
                <Button 
                  variant={score >= 70 ? 'default' : 'outline'}
                  onClick={() => navigate('/candidate/dashboard')}
                  className="flex-1"
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
      <div className="max-w-2xl mx-auto">
        <Card className="quiz-card">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="outline">
                {currentQuestion + 1} / {quizQuestions.length}
              </Badge>
            </div>
            <Progress value={progress} className="mb-4" />
          </CardHeader>
          
          <CardContent>
            <div className="question-content space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {question.question}
                </h3>
                
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  className="space-y-3"
                >
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handleSubmitQuiz}
                  disabled={answers.length === 0 && selectedAnswer === null}
                >
                  Submit Quiz
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                >
                  {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next Question'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};