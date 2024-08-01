import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model'; // Import the Task model
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AddTaskDialogComponent } from '../../add-task-dialog/add-task-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, NgIf, DragDropModule, MatToolbarModule, MatDialogModule, CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  tasks = {
    todo: [] as Task[],
    inProgress: [] as Task[],
    done: [] as Task[]
  };

  selectedTasks: Set<Task> = new Set(); // To store selected tasks
  isDragging: boolean = false;

  constructor(private taskService: TaskService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks.todo = tasks.filter(task => task.status === 'todo');
      this.tasks.inProgress = tasks.filter(task => task.status === 'in-progress');
      this.tasks.done = tasks.filter(task => task.status === 'done');
    });
  }

  toggleTaskSelection(task: Task): void {
    if (this.selectedTasks.has(task)) {
      this.selectedTasks.delete(task);
    } else {
      this.selectedTasks.add(task);
    }
  }

  startDragging(): void {
    this.isDragging = true;
  }

  stopDragging(): void {
    this.isDragging = false;
  }

  drop(event: CdkDragDrop<Task[], Task[]>, status: 'todo' | 'in-progress' | 'done'): void {
    if (this.isDragging) {
      this.selectedTasks.forEach(task => {
        const index = event.previousContainer.data.indexOf(task);
        if (index !== -1) {
          event.previousContainer.data.splice(index, 1);
          task.status = status;
          event.container.data.splice(event.currentIndex, 0, task);
          this.taskService.updateTask(task).subscribe();
        }
      });
    } else {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        const task = event.container.data[event.currentIndex];
        task.status = status;
        this.taskService.updateTask(task).subscribe();
      }
    }
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '700px',
      panelClass: 'addtask-dialog-container'
    });

    dialogRef.afterClosed().subscribe((result: Task) => {
      if (result) {
        this.taskService.addTask(result).subscribe((newTask: Task) => {
          this.tasks.todo.push(newTask);
        });
      }
    });
  }
}