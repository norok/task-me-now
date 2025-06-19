import { Injectable } from '@angular/core';
import { type Task } from '../../../shared/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private tasksFilter = new BehaviorSubject<string>('all');
  private tasksSearchFilter = new BehaviorSubject<string>('');

  tasks$ = this.tasksSubject.asObservable();
  tasksFilter$ = this.tasksFilter.asObservable();
  tasksSearchFilter$ = this.tasksSearchFilter.asObservable();

  constructor() {
    this.tasksSubject.next(this.loadTasksFromStorage())
  }

  private loadTasksFromStorage(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  addTask(task: Task): void {
    if (task._id) {
      console.warn('Task ID should not be set when adding a new task. It will be assigned automatically.');
      delete task._id; // Ensure the ID is not set when adding a new task
    }
    const tasks = this.getTasks();
    task._id = tasks.length > 0 ? (tasks[tasks.length - 1]._id || 0) + 1 : 0;
    const updatedTasks = [...tasks, task];
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    this.tasksSubject.next(updatedTasks);
  }

  removeTask(id: number): void {
    const tasks = this.getTasks();
    const updatedTasks = tasks.filter(task => task._id !== id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    this.tasksSubject.next(updatedTasks);
  }

  completeTask(id: number): void {
    const tasks = this.getTasks();
    const updatedTasks = tasks.map(task =>
      task._id === id ? {...task, completed: true} : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    this.tasksSubject.next(updatedTasks);
  }

  unCompleteTask(id: number): void {
    const tasks = this.getTasks();
    const updatedTasks = tasks.map(task =>
      task._id === id ? {...task, completed: false} : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    this.tasksSubject.next(updatedTasks);
  }

  setFilter(status: string): void {
    this.tasksFilter.next(status);
  }

  setSearchFilter(searchString: string): void {
    this.tasksSearchFilter.next(searchString);
  }
}
