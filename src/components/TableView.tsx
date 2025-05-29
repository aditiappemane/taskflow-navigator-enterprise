
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { Task } from '../types/Task';
import { format, parseISO } from 'date-fns';

interface TableViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TableView: React.FC<TableViewProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    name: string;
    assignee: string;
    dueTime: string;
    priority: Task['priority'];
  }>({
    name: '',
    assignee: '',
    dueTime: '',
    priority: 'P3',
  });

  const formatDateTime = (dateStr: string, timeStr: string) => {
    try {
      const date = parseISO(dateStr);
      const formattedDate = format(date, 'dd MMMM');
      return `${timeStr}, ${formattedDate}`;
    } catch {
      return `${timeStr}, ${dateStr}`;
    }
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

  const toggleComplete = (task: Task) => {
    onUpdateTask({
      ...task,
      completed: !task.completed,
    });
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditData({
      name: task.name,
      assignee: task.assignee,
      dueTime: task.dueTime,
      priority: task.priority,
    });
  };

  const saveEdit = (task: Task) => {
    onUpdateTask({
      ...task,
      ...editData,
    });
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditData({
      name: '',
      assignee: '',
      dueTime: '',
      priority: 'P3',
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle>Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date/Time</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No tasks available
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id} className={task.completed ? 'opacity-60' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleComplete(task)}
                      />
                    </TableCell>
                    
                    {/* Task Name */}
                    <TableCell className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {editingTaskId === task.id ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="min-w-[200px]"
                        />
                      ) : (
                        task.name
                      )}
                    </TableCell>
                    
                    {/* Assignee */}
                    <TableCell>
                      {editingTaskId === task.id ? (
                        <Input
                          value={editData.assignee}
                          onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
                          className="min-w-[120px]"
                        />
                      ) : (
                        task.assignee
                      )}
                    </TableCell>
                    
                    {/* Due Date/Time */}
                    <TableCell>
                      {editingTaskId === task.id ? (
                        <Input
                          value={editData.dueTime}
                          onChange={(e) => setEditData({ ...editData, dueTime: e.target.value })}
                          placeholder="Due time"
                          className="min-w-[100px]"
                        />
                      ) : (
                        formatDateTime(task.dueDate, task.dueTime)
                      )}
                    </TableCell>
                    
                    {/* Priority */}
                    <TableCell>
                      {editingTaskId === task.id ? (
                        <select
                          value={editData.priority}
                          onChange={(e) => setEditData({ ...editData, priority: e.target.value as Task['priority'] })}
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px]"
                        >
                          <option value="P1">P1 (Urgent)</option>
                          <option value="P2">P2 (High)</option>
                          <option value="P3">P3 (Normal)</option>
                          <option value="P4">P4 (Low)</option>
                        </select>
                      ) : (
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      )}
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {editingTaskId === task.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveEdit(task)}
                              className="h-8 px-2 text-green-600 hover:text-green-700"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={cancelEdit}
                              className="h-8 px-2 text-gray-600 hover:text-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditing(task)}
                              className="h-8 px-2"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteTask(task.id)}
                              className="h-8 px-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableView;
