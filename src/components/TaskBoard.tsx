
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TaskCard from './TaskCard';
import TableView from './TableView';
import { Task } from '../types/Task';
import { CheckCircle, Clock, AlertCircle, Grid, List } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const urgentTasks = pendingTasks.filter(task => task.priority === 'P1');

  const stats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: Clock,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending',
      value: pendingTasks.length,
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex justify-end space-x-2">
        <Button
          variant={viewMode === 'cards' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('cards')}
          className="flex items-center space-x-2"
        >
          <Grid className="h-4 w-4" />
          <span>Cards</span>
        </Button>
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
          className="flex items-center space-x-2"
        >
          <List className="h-4 w-4" />
          <span>Table</span>
        </Button>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'table' ? (
        <TableView 
          tasks={tasks}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      ) : (
        <>
          {/* Task Lists - Card View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Tasks */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>Pending Tasks ({pendingTasks.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {pendingTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending tasks</p>
                ) : (
                  pendingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={onUpdateTask}
                      onDelete={onDeleteTask}
                    />
                  ))
                )}
              </CardContent>
            </Card>

            {/* Completed Tasks */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Completed Tasks ({completedTasks.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {completedTasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No completed tasks</p>
                ) : (
                  completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={onUpdateTask}
                      onDelete={onDeleteTask}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Urgent Tasks Alert */}
          {urgentTasks.length > 0 && (
            <Card className="bg-red-50 border-red-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span>Urgent Tasks (P1) - {urgentTasks.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {urgentTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default TaskBoard;
