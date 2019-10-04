import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Todo, MonthlyTodos } from '../types';
import { Utils } from '../utils';
import { TodosService } from '../services/todos.service';

@Component({
  selector: 'app-todo-history',
  templateUrl: './todo-history.page.html',
  styleUrls: ['./todo-history.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class TodoHistoryPage implements OnInit, OnDestroy {

  monthlyTodos: MonthlyTodos[] = null;
  todos$: Subscription;

  icons: string[] = ["american-football", "baseball", "basketball", "football", "tennisball"];

  constructor(
    private _todosService: TodosService,
    private _utils: Utils
  ) {
  }

  fetchIcon(index: number): string {
    return this.icons[index % this.icons.length];
  }

  ngOnInit() {
    this.todos$ = this._todosService.getAllTodos().subscribe((data) => {
      console.log("todos", data);
      this.processTodos([...data]);
    });
  }

  processTodos(todos: Todo[]) {
    this.monthlyTodos = [];
    todos.forEach(todo => {
      if (!todo.isPending) {
        this.addToMonthlyTodos(todo, todo.completionDate);
      }
      todo.isPending = true;
      this.addToMonthlyTodos(todo, todo.entryDate);
    });

    this.monthlyTodos.forEach(monthlyTodo => {
      monthlyTodo.todos.sort((todo1: Todo, todo2: Todo) => {
        let date1 = null;
        let date2 = null;
        if (todo1.isPending) {
          date1 = todo1.entryDate;
        } else {
          date1 = todo1.completionDate;
        }
        if (todo2.isPending) {
          date2 = todo2.entryDate;
        } else {
          date2 = todo2.completionDate;
        }
        return new Date(date2).getTime() - new Date(date1).getTime();
      });
    })
    console.log(this.monthlyTodos);
  }

  addToMonthlyTodos(todo:Todo, date: string) {
    const monthlyTimeline = this._utils.getMonthlyTimeline(new Date(date));
    const monthlyActivity = this.monthlyTodos.find((monthlyActivity) => {
      return monthlyActivity.monthlyTimeline === monthlyTimeline;
    });
    if (monthlyActivity) {
      monthlyActivity.todos.push({...todo});
    } else {
      const newMonthlyActivity = {
        monthlyTimeline: monthlyTimeline,
        todos: [
          todo
        ]
      }
      this.monthlyTodos.push(newMonthlyActivity);
    }
  }

  ionViewDidEnter() {
  }

  ngOnDestroy() {
    if (this.todos$) {
      this.todos$.unsubscribe();
      this.todos$ = null;
    }
    this.monthlyTodos = null;
  }

}
