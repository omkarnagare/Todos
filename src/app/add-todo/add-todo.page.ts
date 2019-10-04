import { Component, OnInit } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TodosService } from '../services/todos.service';
import { Todo } from '../types';
import { ToastManagerService } from '../services/toast-manager.service';
import { Router } from '@angular/router';
import { LoaderManagerService } from '../services/loader-manager.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.page.html',
  styleUrls: ['./add-todo.page.scss'],
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
export class AddTodoPage implements OnInit {

  todoDetailsFormGroup: FormGroup;
  validationMessages: any;

  priority: string = null;

  constructor(
    private _todosService: TodosService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService,
    private _router: Router,
    formBuilder: FormBuilder
  ) {
    this.todoDetailsFormGroup = formBuilder.group({
      todoTitle: ["", [Validators.required]],
      todoDescription: ""
    });
    this.validationMessages = {
      'todoTitle': [{ type: 'required', message: 'Task title cannot be left blank.' }]
    };
  }

  isError(name: string, validationType: string): boolean {
    return this.todoDetailsFormGroup.get(name).hasError(validationType) && (this.todoDetailsFormGroup.get(name).dirty || this.todoDetailsFormGroup.get(name).touched)
  }

  onPriorityChange(event: any) {
    this.priority = event.detail.value;
    console.log(this.priority);
  }

  ngOnInit() {
  }

  addTodo() {
    this._loader.presentLoader().then(() => {
      const currentTodo: Todo = this.todoDetailsFormGroup.value;
      currentTodo.priority = this.priority;
      this._todosService.addTodo(currentTodo).then((respose) => {
        console.log(respose);
      }).catch(error => {
        this._toastManager.showErrorToast(error);
      }).finally(() => {
        this.redirectToHomePage();
        this._loader.stopLoader();
      });
    });
  }

  redirectToHomePage() {
    this._router.navigate(["/"]);
  }
}
