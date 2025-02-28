import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetTestsByCourseQuery, useSubmitTestMutation } from '../../features/api/testApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, Award, Brain, CheckCircle2, Loader2 } from 'lucide-react';

const CourseTest = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const { data: testData, isLoading } = useGetTestsByCourseQuery(courseId);
  const [submitTest, { isLoading: isSubmitting }] = useSubmitTestMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!testData?.tests?.[0]) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Test Available</h2>
        <p className="text-gray-600 mb-4">There is no test available for this course yet.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const test = testData.tests[0];
  const questions = test.questions;

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      // Format answers for submission
      const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      // Submit test
      const response = await submitTest({
        testId: test._id,
        courseId,
        answers: formattedAnswers
      }).unwrap();

      // Set results and show results screen
      setTestResults(response.result);
      setShowResults(true);
      
      // Show appropriate toast message
      if (response.result.passed) {
        toast.success("Congratulations! You've passed the test!");
      } else {
        toast.error(`Test score: ${response.result.score.toFixed(2)}%. Try again to pass.`);
      }
    } catch (error) {
      console.error('Test submission error:', error);
      toast.error(error.data?.message || 'Failed to submit test');
    }
  };

  if (showResults) {
    const { score, passed } = testResults || {};
    const percentage = score || 0;
    const passedTest = passed || false;

    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-600 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="text-center mb-8">
          <Award className={`w-20 h-20 mx-auto mb-4 ${passedTest ? 'text-green-600' : 'text-gray-400'}`} />
          <h1 className="text-3xl font-bold mb-2">Test Results</h1>
          <p className="text-gray-600">
            {passedTest 
              ? "Congratulations! You've passed the test." 
              : "Keep practicing! You can retake the test to improve your score."}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="mb-4">
              <span className={`text-5xl font-bold ${passedTest ? 'text-green-600' : 'text-red-600'}`}>
                {percentage.toFixed(0)}%
              </span>
              <p className="text-gray-600 mt-2">Final Score</p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full max-w-xs mx-auto mb-4">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  passedTest ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Passing score: 70%
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {passedTest && (
            <Button 
              onClick={() => navigate(`/certificate/${courseId}`)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full max-w-xs"
            >
              <Award className="w-4 h-4 mr-2" />
              View Certificate
            </Button>
          )}
          <Button 
            onClick={() => {
              setShowResults(false);
              setSelectedAnswers({});
              setCurrentQuestion(0);
              setTestResults(null);
            }}
            variant={passedTest ? "outline" : "default"}
            className={`w-full max-w-xs ${
              !passedTest ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : ""
            }`}
          >
            Retake Test
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="w-full max-w-xs"
          >
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-600 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="text-center mb-8">
        <Brain className="w-16 h-16 mx-auto mb-4 text-purple-600" />
        <h1 className="text-3xl font-bold mb-2">Course Evaluation</h1>
        <p className="text-gray-600">
          Test your knowledge of the course material. You need to score at least 70% to pass.
        </p>
      </div>

      <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex gap-2 items-start">
          <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Important</h3>
            <p className="text-sm text-gray-600">
              Take your time to answer each question carefully. You can navigate between questions and change your answers before submitting.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Question {currentQuestion + 1}</h2>
          <span className="text-gray-600">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <p className="text-lg font-semibold mb-6">{questions[currentQuestion].question}</p>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(questions[currentQuestion].options).map(([key, value]) => (
            <Button
              key={key}
              variant={selectedAnswers[questions[currentQuestion]._id] === key ? "default" : "outline"}
              className={`w-full justify-start text-left p-4 h-auto ${
                selectedAnswers[questions[currentQuestion]._id] === key
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "hover:bg-purple-50"
              }`}
              onClick={() => handleAnswerSelect(questions[currentQuestion]._id, key)}
            >
              <span className="font-semibold mr-3">{key.toUpperCase()}.</span> {value}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => currentQuestion > 0 && setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {currentQuestion === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== questions.length || isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Test'
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={!selectedAnswers[questions[currentQuestion]._id]}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Next
          </Button>
        )}
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold mb-2">Tips for Success:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Read each question carefully before selecting an answer</li>
          <li>You can navigate back to previous questions to review your answers</li>
          <li>Make sure to answer all questions before submitting</li>
          <li>You need 70% or higher to pass and receive your certificate</li>
        </ul>
      </div>
    </div>
  );
};

export default CourseTest;
