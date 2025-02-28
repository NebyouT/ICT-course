import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Trophy } from 'lucide-react';

const CourseProgressBar = ({ progress = [], totalLectures = 0, className = "" }) => {
  const completedLectures = progress.filter(prog => prog.viewed).length;
  const progressPercentage = totalLectures > 0 
    ? Math.round((completedLectures / totalLectures) * 100) 
    : 0;

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Progress Circle and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center"
                style={{
                  background: `conic-gradient(#7c3aed ${progressPercentage}%, #f3f4f6 ${progressPercentage}%)`
                }}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  {progressPercentage === 100 ? (
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <span className="text-sm font-semibold text-purple-600">{progressPercentage}%</span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Course Progress</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {progressPercentage === 100 ? 'Course completed!' : 'Keep going, you\'re doing great!'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">{completedLectures}/{totalLectures}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Lectures completed</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <Progress 
            value={progressPercentage} 
            className="h-2.5"
          />
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{totalLectures} Total lectures</span>
            </div>
            <span>{completedLectures} Completed</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseProgressBar;
