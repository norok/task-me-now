import { TaskFilterPipe } from './task-filter-pipe';
import { Task } from '../../../shared/types';

describe('TaskFilterPipe', () => {
  let pipe: TaskFilterPipe;
  let mockTasks: Task[];

  beforeEach(() => {
    pipe = new TaskFilterPipe();
    mockTasks = [
      { _id: 1, title: 'Task 1', completed: true, createdAt: '2023-01-01T00:00:00.000Z' },
      { _id: 2, title: 'Task 2', completed: false, createdAt: '2023-01-02T00:00:00.000Z' },
      { _id: 3, title: 'Task 3', completed: true, createdAt: '2023-01-03T00:00:00.000Z' },
      { _id: 4, title: 'Task 4', completed: false, createdAt: '2023-01-04T00:00:00.000Z' }
    ];
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all tasks when filter type is "all"', () => {
    const result = pipe.transform(mockTasks, 'all');
    expect(result).toEqual(mockTasks);
    expect(result.length).toBe(4);
  });

  it('should return only completed tasks when filter type is "completed"', () => {
    const result = pipe.transform(mockTasks, 'completed');
    expect(result.length).toBe(2);
    expect(result.every(task => task.completed)).toBe(true);
  });

  it('should return only pending tasks when filter type is "pending"', () => {
    const result = pipe.transform(mockTasks, 'pending');
    expect(result.length).toBe(2);
    expect(result.every(task => !task.completed)).toBe(true);
  });

  it('should return all tasks when filter type is not recognized', () => {
    const result = pipe.transform(mockTasks, 'invalid-filter');
    expect(result).toEqual(mockTasks);
    expect(result.length).toBe(4);
  });

  it('should return empty array for null tasks', () => {
    const result = pipe.transform(null as any, 'all');
    expect(result).toEqual([]);
  });

  it('should return empty array for undefined tasks', () => {
    const result = pipe.transform(undefined as any, 'all');
    expect(result).toEqual([]);
  });

  it('should return empty array when tasks array is empty', () => {
    const result = pipe.transform([], 'all');
    expect(result).toEqual([]);
  });

  it('should use "all" as default filter when no filter type is provided', () => {
    const result = pipe.transform(mockTasks);
    expect(result).toEqual(mockTasks);
    expect(result.length).toBe(4);
  });
});
