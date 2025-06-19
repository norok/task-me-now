import { TestBed } from '@angular/core/testing';
import { TaskManagerService } from './task-manager.service';
import { Task } from '../../../shared/types';
import { firstValueFrom } from 'rxjs';

describe('TaskManagerService', () => {
  let service: TaskManagerService;
  let mockTasks: Task[];
  let localStorageSpy: any;

  beforeEach(() => {
    mockTasks = [
      { _id: 1, title: 'Task 1', completed: false, createdAt: '2023-01-01T00:00:00.000Z' },
      { _id: 2, title: 'Task 2', completed: true, createdAt: '2023-01-02T00:00:00.000Z' }
    ];

    // Mock localStorage
    localStorageSpy = {
      getItem: jasmine.createSpy('getItem').and.returnValue(JSON.stringify(mockTasks)),
      setItem: jasmine.createSpy('setItem')
    };
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);

    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load tasks from localStorage on initialization', () => {
    expect(localStorage.getItem).toHaveBeenCalledWith('tasks');
    expect(service.getTasks()).toEqual(mockTasks);
  });

  it('should return tasks with getTasks()', () => {
    expect(service.getTasks()).toEqual(mockTasks);
  });

  it('should emit tasks through tasks$ observable', async () => {
    const tasks = await firstValueFrom(service.tasks$);
    expect(tasks).toEqual(mockTasks);
  });

  it('should add a new task and update localStorage', () => {
    const newTask: Task = { title: 'New Task', completed: false, createdAt: '2023-01-03T00:00:00.000Z' };
    service.addTask(newTask);

    const expectedTasks = [...mockTasks, { ...newTask, _id: 3 }];
    expect(service.getTasks()).toEqual(expectedTasks);
    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(expectedTasks));
  });

  it('should remove task ID when adding if present', () => {
    const newTask: Task = { _id: 99, title: 'Task with ID', completed: false, createdAt: '2023-01-03T00:00:00.000Z' };
    service.addTask(newTask);

    const expectedTasks = [...mockTasks, { title: 'Task with ID', completed: false, createdAt: '2023-01-03T00:00:00.000Z', _id: 3 }];
    expect(service.getTasks()).toEqual(expectedTasks);
  });

  it('should remove a task', () => {
    service.removeTask(1);

    const expectedTasks = mockTasks.filter(task => task._id !== 1);
    expect(service.getTasks()).toEqual(expectedTasks);
    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(expectedTasks));
  });

  it('should complete a task', () => {
    service.completeTask(1);

    const expectedTasks = mockTasks.map(task =>
      task._id === 1 ? { ...task, completed: true } : task
    );
    expect(service.getTasks()).toEqual(expectedTasks);
    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(expectedTasks));
  });

  it('should set filter and emit through tasksFilter$ observable', async () => {
    // Default filter should be 'all'
    let filter = await firstValueFrom(service.tasksFilter$);
    expect(filter).toBe('all');

    // Change filter
    service.setFilter('completed');
    filter = await firstValueFrom(service.tasksFilter$);
    expect(filter).toBe('completed');
  });

  it('should assign ID 0 when tasks array is empty', () => {
    // Reset service with empty tasks array
    localStorageSpy.getItem.and.returnValue(JSON.stringify([]));
    service = TestBed.inject(TaskManagerService);

    const newTask: Task = { title: 'First Task', completed: false, createdAt: '2023-01-03T00:00:00.000Z' };
    service.addTask(newTask);

    const expectedTasks = [{ ...newTask, _id: 0 }];
    expect(service.getTasks()).toEqual(expectedTasks);
  });

  it('should handle null localStorage value', () => {
    // Reset service with null localStorage return
    localStorageSpy.getItem.and.returnValue(null);
    service = TestBed.inject(TaskManagerService);

    expect(service.getTasks()).toEqual([]);
  });
});
