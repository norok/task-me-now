import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../../../shared/types';

@Pipe({
  name: 'taskFilterPipe'
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: Task[], filterType: string = 'all', filterString: string = ''): Task[] {
    if (!tasks || tasks.length === 0 || !Array.isArray(tasks)) {
      return [];
    }

    return filterBySearchAndStatus(tasks, filterString, filterType);
  }
}

function filterBySearchAndStatus(tasks: Task[], filterString: string = '', filterType: string): Task[] {
  return tasks.filter(task => {
    const matchesSearch = filterString !== '' ? (task.title.toLowerCase().includes(filterString.toLowerCase()) || task.description?.toLowerCase().includes(filterString.toLowerCase())) : true;
    const matchesStatus = filterType === 'all' || (filterType === 'completed' && task.completed) || (filterType === 'pending' && !task.completed);
    return matchesSearch && matchesStatus;
  });
}
