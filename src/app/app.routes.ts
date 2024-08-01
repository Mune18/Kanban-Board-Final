import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent },
  { path: 'task-list', component: TaskListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
