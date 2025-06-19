import { Component, inject, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TaskManagerService } from '../../services/task-manager.service';
import { type Task } from '../../../../shared/types';
import { ToDatePipe } from '../../pipes/to-date-pipe';

@Component({
  selector: 'app-task',
  imports: [
    ToDatePipe,
    NgClass,
    MatIconModule,
  ],
  exportAs: 'article',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input({required: true}) taskData: Task = {title: '', description: '', createdAt: '', dueDate: ''};

  private taskManagerService = inject(TaskManagerService);

  protected toggleTask(task: Task): void {
    if (task.completed) {
      this.taskManagerService.unCompleteTask(task._id as number);
    } else {
      this.taskManagerService.completeTask(task._id as number);
    }
  }
}
