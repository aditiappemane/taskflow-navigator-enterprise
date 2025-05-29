
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit2, Trash2 } from 'lucide-react';
import { Task } from '../types/Task';
import { format, parseISO } from 'date-fns';

interface TableViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TableView: React.FC<TableViewProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
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
                    <TableCell className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.name}
                    </TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>{formatDateTime(task.dueDate, task.dueTime)}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
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
