
import React, { useState } from 'react';
import TaskInput from '../components/TaskInput';
import TaskBoard from '../components/TaskBoard';
import { Task } from '../types/Task';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now().toString() }]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TaskFlow Navigator
          </h1>
          <p className="text-lg text-gray-600">
            Enterprise-grade task management with natural language processing
          </p>
        </div>
        
        <div className="mb-8">
          <TaskInput onAddTask={addTask} />
        </div>
        
        <TaskBoard 
          tasks={tasks} 
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      </div>
    </div>
  );
};

export default Index;
