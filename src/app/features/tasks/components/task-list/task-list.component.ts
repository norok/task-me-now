import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription} from "rxjs";
import { TaskComponent } from "../task/task.component";
import { TaskFilterComponent } from "../task-filter/task-filter.component";
import { TaskFormComponent } from "../task-form/task-form.component";
import { TaskManagerService } from '../../services/task-manager.service';
import { TaskFilterPipe } from "../../pipes/task-filter-pipe";
import { type Task } from "../../../../shared/types";
import {TaskSortPipe} from '../../pipes/sort-by-date-pipe';

@Component({
  selector: 'app-task-list',
  imports: [
    TaskComponent,
    TaskFilterComponent,
    TaskFormComponent,
    TaskFilterPipe,
    TaskSortPipe,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {
  private taskManagerService = inject(TaskManagerService);
  private subscription = new Subscription();

  protected tasks: Task[] = [];
  protected taskFilter: string = 'all';
  protected taskSearchFilter: string = '';

  ngOnInit() {
    this.subscription.add(
      this.taskManagerService.tasks$.subscribe(tasks => {
        this.tasks = tasks;
      })
    );
    this.subscription.add(
      this.taskManagerService.tasksFilter$.subscribe(filter => {
        this.taskFilter = filter;
      })
    );
    this.subscription.add(
      this.taskManagerService.tasksSearchFilter$.subscribe(filter => {
        this.taskSearchFilter = filter;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
