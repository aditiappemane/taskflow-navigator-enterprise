
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles } from 'lucide-react';
import { parseNaturalLanguage } from '../utils/taskParser';
import { Task } from '../types/Task';

interface TaskInputProps {
  onAddTask: (task: Task) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const parsed = parseNaturalLanguage(input);
      const newTask: Task = {
        id: '',
        ...parsed,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      
      onAddTask(newTask);
      setInput('');
      setIsProcessing(false);
    }, 500);
  };

  const examples = [
    "Finish landing page Aman by 11pm 20th June",
    "Call client Rajeev tomorrow 5pm P1",
    "Review documents Sarah by Friday 2pm P2"
  ];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Add Task with Natural Language
            </h2>
          </div>
          
          <div className="flex space-x-3">
            <Input
              type="text"
              placeholder="e.g., Finish landing page Aman by 11pm 20th June P2"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isProcessing}
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </div>
              )}
            </Button>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
            <div className="space-y-1">
              {examples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInput(example)}
                  className="block text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskInput;
