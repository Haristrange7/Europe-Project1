import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, CreditCard as Edit, Trash2, Image as ImageIcon, Award, Users, Eye } from "lucide-react";
import { storageUtils } from "@/utils/storage";
import { QuizQuestion } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollArea } from "@/components/ui/scroll-area";

export const QuizManagement: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [selectedType, setSelectedType] = useState<'driver' | 'welder' | 'all'>('all');
  const [formData, setFormData] = useState({
    question: "",
    image: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    type: "driver" as 'driver' | 'welder',
  });

  useEffect(() => {
    loadData();

    // Animate cards
    gsap.fromTo(
      ".quiz-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const loadData = () => {
    const allQuestions = storageUtils.getAllQuizQuestions();
    setQuestions(allQuestions);
  };

  const resetForm = () => {
    setFormData({
      question: "",
      image: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      type: "driver",
    });
    setEditingQuestion(null);
  };

  const handleCreate = () => {
    resetForm();
    setShowDialog(true);
  };

  const handleEdit = (question: QuizQuestion) => {
    setFormData({
      question: question.question,
      image: question.image || "",
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      type: question.type,
    });
    setEditingQuestion(question);
    setShowDialog(true);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (formData.options.some(option => !option.trim())) {
      toast.error("Please fill in all options");
      return;
    }

    const questionData: QuizQuestion = {
      id: editingQuestion?.id || `question-${Date.now()}`,
      question: formData.question,
      image: formData.image || undefined,
      options: formData.options,
      correctAnswer: formData.correctAnswer,
      type: formData.type,
      createdBy: user?.id || "",
      createdAt: editingQuestion?.createdAt || new Date().toISOString(),
    };

    storageUtils.saveQuizQuestion(questionData);
    toast.success(
      editingQuestion ? "Question updated successfully" : "Question created successfully"
    );

    setShowDialog(false);
    resetForm();
    loadData();
  };

  const handleDelete = (questionId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      storageUtils.deleteQuizQuestion(questionId);
      toast.success("Question deleted successfully");
      loadData();
    }
  };

  const filteredQuestions = selectedType === 'all' 
    ? questions 
    : questions.filter(q => q.type === selectedType);

  const driverQuestions = questions.filter(q => q.type === 'driver');
  const welderQuestions = questions.filter(q => q.type === 'welder');

  return (
    <Layout title="Quiz Management">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="text-start">
            <h2 className="text-2xl font-bold text-primary-foreground">
              Quiz Questions
            </h2>
            <p className="text-primary-foreground/60 mt-1">
              Create and manage quiz questions for drivers and welders
            </p>
          </div>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button
                onClick={handleCreate}
                className="bg-brand-600 hover:bg-brand-700 border border-ring hover:scale-105 transition-transform hover:bg-primary text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-hidden">
              <ScrollArea className="max-h-[80vh] pr-4">
                <DialogHeader className="mt-3">
                  <DialogTitle className="text-xl">
                    {editingQuestion ? "Edit Question" : "Create New Question"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingQuestion
                      ? "Update the question details below"
                      : "Fill in the question information"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Question Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'driver' | 'welder') =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="welder">Welder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question">Question *</Label>
                    <Textarea
                      id="question"
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                      placeholder="Enter your question here..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Question Image (Optional)</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Question"
                          className="max-w-full h-32 object-contain border rounded"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Answer Options *</Label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={formData.correctAnswer === index}
                            onChange={() =>
                              setFormData({ ...formData, correctAnswer: index })
                            }
                            className="text-brand-600"
                          />
                          <Input
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                        {formData.correctAnswer === index && (
                          <Badge className="bg-green-500 text-white">Correct</Badge>
                        )}
                      </div>
                    ))}
                    <p className="text-sm text-muted-foreground">
                      Select the radio button next to the correct answer
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="border hover:border-destructive hover:bg-destructive mb-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-brand-600 border border-ring hover:bg-primary"
                  >
                    {editingQuestion ? "Update Question" : "Create Question"}
                  </Button>
                </DialogFooter>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="quiz-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-foreground">
                    Total Questions
                  </p>
                  <p className="text-3xl font-bold text-chart-2">
                    {questions.length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="quiz-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-foreground">
                    Driver Questions
                  </p>
                  <p className="text-3xl font-bold text-chart-4">
                    {driverQuestions.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="quiz-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-foreground">
                    Welder Questions
                  </p>
                  <p className="text-3xl font-bold text-chart-3">
                    {welderQuestions.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-4">
          <Label>Filter by type:</Label>
          <Select
            value={selectedType}
            onValueChange={(value: 'driver' | 'welder' | 'all') => setSelectedType(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              <SelectItem value="driver">Driver Questions</SelectItem>
              <SelectItem value="welder">Welder Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <Card className="quiz-card">
            <CardContent className="p-12 text-center">
              <Award className="h-16 w-16 mx-auto text-gray-400 mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Questions Yet
              </h3>
              <p className="text-primary-foreground mb-6 max-w-md mx-auto">
                Create your first quiz question to start building assessments for candidates.
              </p>
              <Button
                onClick={handleCreate}
                className="bg-brand-600 hover:bg-brand-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredQuestions.map((question) => (
              <Card
                key={question.id}
                className="quiz-card shadow-soft hover:shadow-medium transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge
                          variant={question.type === "driver" ? "default" : "secondary"}
                          className={
                            question.type === "driver"
                              ? "bg-blue-500 text-white"
                              : "bg-orange-500 text-white"
                          }
                        >
                          {question.type}
                        </Badge>
                        {question.image && (
                          <Badge variant="outline" className="flex items-center">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Has Image
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg text-primary-foreground">
                        {question.question}
                      </CardTitle>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {question.image && (
                      <div>
                        <img
                          src={question.image}
                          alt="Question"
                          className="max-w-full h-48 object-contain border rounded"
                        />
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-primary-foreground mb-2">
                        Answer Options:
                      </h4>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded border ${
                              index === question.correctAnswer
                                ? "bg-green-50 border-green-200 text-green-800"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                            {index === question.correctAnswer && (
                              <Badge className="ml-2 bg-green-500 text-white text-xs">
                                Correct
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-xs text-gray-500">
                      <span>
                        Created on{" "}
                        {new Date(question.createdAt).toLocaleDateString()}
                      </span>
                      <span>Question ID: {question.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};