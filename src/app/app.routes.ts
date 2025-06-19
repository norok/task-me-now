import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/components/task-list/task-list.component';

export const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
  }
];
