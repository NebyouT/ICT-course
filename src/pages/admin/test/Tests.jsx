import React, { useState } from "react";
import { useGetCreatorCourseQuery } from "../../../features/api/courseApi";
import { useCreateTestMutation, useGetTestsByCourseQuery, useDeleteQuestionMutation } from "../../../features/api/testApi";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Tests = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "" }]);
  const [selectedViewCourse, setSelectedViewCourse] = useState("");

  const { data: courses } = useGetCreatorCourseQuery();
  const { data: courseTests } = useGetTestsByCourseQuery(selectedViewCourse, {
    skip: !selectedViewCourse,
  });
  const [createTest] = useCreateTestMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    // Validate all fields are filled
    for (const q of questions) {
      if (!q.question || !q.options.a || !q.options.b || !q.options.c || !q.options.d || !q.correctAnswer) {
        toast.error("Please fill all fields for each question");
        return;
      }
    }

    try {
      await createTest({
        courseId: selectedCourse,
        questions
      }).unwrap();
      
      toast.success("Test created successfully");
      // Reset form
      setQuestions([{ question: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "" }]);
      setSelectedCourse("");
    } catch (error) {
      toast.error(error.data?.message || "Failed to create test");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      newQuestions[index][parent][child] = value;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: { a: "", b: "", c: "", d: "" }, correctAnswer: "" }]);
  };

  const handleDeleteQuestion = async (testId, questionId) => {
    try {
      await deleteQuestion({ testId, questionId }).unwrap();
      toast.success("Question deleted successfully");
    } catch (error) {
      toast.error(error.data?.message || "Failed to delete question");
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto">
      {/* Create Test Section */}
      <div className="bg-white/[0.7] backdrop-blur rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Test</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-6">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courses?.courses?.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.courseTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Test
            </Button>
          </div>

          {questions.map((q, index) => (
            <div key={index} className="mb-6 p-4 border rounded">
              <div className="mb-4">
                <Label>Question</Label>
                <Input
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                  placeholder="Enter question"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {Object.keys(q.options).map((option) => (
                  <div key={option}>
                    <Label>Option {option.toUpperCase()}</Label>
                    <Input
                      value={q.options[option]}
                      onChange={(e) => handleQuestionChange(index, `options.${option}`, e.target.value)}
                      placeholder={`Option ${option.toUpperCase()}`}
                    />
                  </div>
                ))}
              </div>
              <div>
                <Label>Correct Answer</Label>
                <Select
                  value={q.correctAnswer}
                  onValueChange={(value) => handleQuestionChange(index, "correctAnswer", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(q.options).map((option) => (
                      <SelectItem key={option} value={option}>
                        Option {option.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Question
          </Button>
        </form>
      </div>

      {/* View Questions Section */}
      <div className="bg-white/[0.7] backdrop-blur rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">View Questions</h2>
        <Select value={selectedViewCourse} onValueChange={setSelectedViewCourse}>
          <SelectTrigger className="mb-6">
            <SelectValue placeholder="Select Course to View Questions" />
          </SelectTrigger>
          <SelectContent>
            {courses?.courses?.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.courseTitle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {courseTests?.tests?.map((test) => (
          <div key={test._id} className="mb-6">
            {test.questions.map((q, index) => (
              <div key={q._id} className="mb-4 p-4 border rounded bg-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold">Question {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteQuestion(test._id, q._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p className="mb-2">{q.question}</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(q.options).map(([key, value]) => (
                    <div
                      key={key}
                      className={`p-2 rounded ${
                        key === q.correctAnswer
                          ? "bg-green-100 border-green-500"
                          : "bg-gray-50 border-gray-200"
                      } border`}
                    >
                      {key.toUpperCase()}: {value}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tests;
