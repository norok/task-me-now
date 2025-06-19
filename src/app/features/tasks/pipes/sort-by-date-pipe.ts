import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../../shared/types';

@Pipe({
  name: 'sortByDate',
  standalone: true
})
export class TaskSortPipe implements PipeTransform {
  transform(tasks: Task[] | null, direction: 'asc' | 'desc' = 'desc'): Task[] {
    if (!tasks || tasks.length === 0) {
      return [];
    }

    return [...tasks].sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();

      return direction === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    });
  }
}
