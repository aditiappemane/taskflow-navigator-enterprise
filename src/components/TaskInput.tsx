
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles, Mic, MicOff } from 'lucide-react';
import { parseNaturalLanguage } from '../utils/taskParser';
import { Task } from '../types/Task';
import { useToast } from '@/hooks/use-toast';

interface TaskInputProps {
  onAddTask: (task: Task) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input:', transcript);
        setInput(transcript);
        toast({
          title: "Voice input captured",
          description: `"${transcript}"`,
        });
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Could not capture voice input. Please try again.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended');
      };

      recognitionRef.current = recognition;
    } else {
      console.log('Speech recognition not supported');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        toast({
          title: "Listening...",
          description: "Speak your task now",
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Error",
          description: "Could not start voice recognition",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

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
      toast({
        title: "Task created",
        description: `"${parsed.name}" assigned to ${parsed.assignee}`,
      });
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
              disabled={isProcessing || isListening}
            />
            
            {isRecognitionSupported && (
              <Button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`h-12 px-4 transition-colors ${
                  isListening 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isListening ? (
                  <div className="flex items-center space-x-2">
                    <MicOff className="h-4 w-4" />
                    <span>Stop</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mic className="h-4 w-4" />
                    <span>Voice</span>
                  </div>
                )}
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={!input.trim() || isProcessing || isListening}
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

          {isListening && (
            <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-700 font-medium">Listening... Speak your task now</p>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Try these examples {isRecognitionSupported ? '(type or speak):' : ':'}
            </p>
            <div className="space-y-1">
              {examples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInput(example)}
                  className="block text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                  disabled={isListening}
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          {!isRecognitionSupported && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Voice input is not supported in this browser. Please use a modern browser like Chrome, Safari, or Edge.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskInput;
