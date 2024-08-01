import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost/kanban-board-app/api/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTasks(): Observable<Task[]> {
    const headers = new HttpHeaders().set('Authorization', this.authService.getToken() || '');
    return this.http.get<Task[]>(`${this.apiUrl}/getTasks`, { headers });
  }

  addTask(task: Task): Observable<Task> {
    const headers = new HttpHeaders().set('Authorization', this.authService.getToken() || '');
    return this.http.post<Task>(`${this.apiUrl}/addTasks`, task, { headers });
  }

  updateTask(task: Task): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', this.authService.getToken() || '');
    return this.http.post<void>(`${this.apiUrl}/updateTask/${task.id}`, task, { headers });
  }
}
