
export interface Task {
  id: string;
  name: string;
  assignee: string;
  dueDate: string;
  dueTime: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  completed: boolean;
  createdAt: string;
}
