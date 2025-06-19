import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaskManagerService } from '../../services/task-manager.service';

@Component({
  selector: 'app-task-filter',
  imports: [
    FormsModule
  ],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.scss'
})
export class TaskFilterComponent implements OnInit, OnDestroy {
  private taskManagerService = inject(TaskManagerService);
  private subscription = new Subscription();

  protected statuses = ['all', 'completed', 'pending'];
  protected selectedStatus: string = 'all';
  protected search: string = '';

  ngOnInit() {
    this.subscription.add(
      this.taskManagerService.tasksFilter$.subscribe(filter => {
        this.selectedStatus = filter;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  protected onStatusChange(): void {
    this.taskManagerService.setFilter(this.selectedStatus);
  }

  protected onSearch(): void {
    this.taskManagerService.setSearchFilter(this.search);
  }
}
