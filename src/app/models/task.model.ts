export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date | string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  selected?: boolean;
}