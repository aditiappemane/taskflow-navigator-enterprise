
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Calendar, 
  Clock, 
  User, 
  Edit2, 
  Save, 
  X, 
  Trash2 
} from 'lucide-react';
import { Task } from '../types/Task';
import { format, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: task.name,
    assignee: task.assignee,
    dueTime: task.dueTime,
    priority: task.priority,
  });

  const handleSave = () => {
    onUpdate({
      ...task,
      ...editData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: task.name,
      assignee: task.assignee,
      dueTime: task.dueTime,
      priority: task.priority,
    });
    setIsEditing(false);
  };

  const toggleComplete = () => {
    onUpdate({
      ...task,
      completed: !task.completed,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-500 text-white';
      case 'P2': return 'bg-orange-500 text-white';
      case 'P3': return 'bg-blue-500 text-white';
      case 'P4': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      task.completed ? 'opacity-75 bg-gray-50' : 'bg-white'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={toggleComplete}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Task name"
                  className="font-medium"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    value={editData.assignee}
                    onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
                    placeholder="Assignee"
                  />
                  
                  <Input
                    value={editData.dueTime}
                    onChange={(e) => setEditData({ ...editData, dueTime: e.target.value })}
                    placeholder="Due time"
                  />
                  
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value as Task['priority'] })}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="P1">P1 (Urgent)</option>
                    <option value="P2">P2 (High)</option>
                    <option value="P3">P3 (Normal)</option>
                    <option value="P4">P4 (Low)</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`font-medium text-gray-900 mb-2 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}>
                  {task.name}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{task.assignee}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{task.dueTime}</span>
                  </div>
                  
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                
                <div className="flex justify-end space-x-2 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 px-2"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                    className="h-8 px-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
