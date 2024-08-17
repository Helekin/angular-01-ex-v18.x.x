import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskComponent } from './task/task.component';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, RouterLink],
})
export class TasksComponent implements OnInit {
  userId = input.required<string>();
  order = signal<'asc' | 'desc'>('desc');

  private tasksService = inject(TasksService);

  userTasks = computed(() =>
    this.tasksService
      .allTasks()
      .filter((task) => task.userId === this.userId())
      .sort((a, b) => {
        if (this.order() === 'desc') {
          return a.id > b.id ? -1 : 1;
        } else {
          return a.id > b.id ? 1 : -1;
        }
      })
  );

  private activatedRouted = inject(ActivatedRoute);
  private destroyref = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.activatedRouted.queryParams.subscribe({
      next: (params) => this.order.set(params['order']),
    });

    this.destroyref.onDestroy(() => subscription.unsubscribe());
  }
}
