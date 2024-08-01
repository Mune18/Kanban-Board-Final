import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Task } from '../models/task.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [    
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatSelectModule, 
    ReactiveFormsModule, 
    FormsModule, 
    NgIf, 
    MatFormFieldModule, 
    MatInputModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css'],
})
export class AddTaskDialogComponent {
  task: Task = { 
    id: 0, 
    title: '', 
    description: '', // Added description property
    dueDate: new Date().toISOString(), // Added dueDate property and initialized with current date
    status: 'todo',
    priority: 'low' // Default priority
  };

  constructor(public dialogRef: MatDialogRef<AddTaskDialogComponent>) {
    // Convert dueDate to Date object for date picker if it's a valid string
    if (typeof this.task.dueDate === 'string') {
      const date = new Date(this.task.dueDate);
      this.task.dueDate = isNaN(date.getTime()) ? new Date() : date; // Default to current date if invalid
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // Ensure dueDate is a Date object before converting to string
    if (this.task.dueDate instanceof Date) {
      this.task.dueDate = this.task.dueDate.toISOString(); // Convert Date to ISO string
    }
    this.dialogRef.close(this.task);
  }
}
