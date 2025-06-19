import {AfterViewChecked, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Task } from '../../../../shared/types';
import { TaskManagerService } from '../../services/task-manager.service';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements AfterViewChecked, OnInit, OnDestroy {
  private taskManagerService = inject(TaskManagerService);
  private formIsReset: boolean = false;

  protected open: boolean = false;
  protected addButtonText: string = 'Add new task';
  protected taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    dueDate: new FormControl<string>('', [Validators.required]),
  });

  ngAfterViewChecked(): void {
    if (this.open && !this.formIsReset) {
     this.resetForm();
    }
  }

  ngOnInit(): void {
    window.addEventListener('keyup', this.onEscape.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('keyup', this.onEscape.bind(this));
  }

  protected onShowForm(): void {
    this.open = true;
  }

  protected onHideForm(): void {
    this.open = false;
    this.formIsReset = false;
  }

  protected onSubmit(): void {
    const task: Task = {
      title: this.taskForm.value.title as string,
      description: this.taskForm.value.description as string | undefined,
      createdAt: new Date().toISOString(),
      dueDate: new Date(this.taskForm.value.dueDate as string).toISOString(),
    }
    this.taskManagerService.addTask(task);
    this.resetForm();
  }

  protected onEscape(event: KeyboardEvent): void {
    if (this.open && event.key === 'Escape') {
      this.onHideForm();
    }
  }

  private resetForm(): void {
    this.formIsReset = true;
    this.taskForm.reset({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
    });
    const taskNameInput = document.querySelector("#taskName") as HTMLInputElement;
    taskNameInput.focus();
  }
}
