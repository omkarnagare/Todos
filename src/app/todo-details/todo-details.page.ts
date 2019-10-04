import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { trigger, state, transition, style, animate } from '@angular/animations';
import { Todo } from '../types';
import { Subscription } from 'rxjs';
import { TodosService } from '../services/todos.service';
import { AlertController } from '@ionic/angular';
import { LoaderManagerService } from '../services/loader-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
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
export class TodoDetailsPage implements OnInit, OnDestroy {
  todoId: string = null;
  todoObject: Todo = null;
  todoDetails$: Subscription;

  todoDetailsFormGroup: FormGroup;
  validationMessages: any;
  priority: string;
  editing: boolean = false;

  constructor(
    private _todosService: TodosService,
    private _loader: LoaderManagerService,
    private _toastManager: ToastManagerService,
    private _alertController: AlertController,
    activatedRoute: ActivatedRoute,
    formBuilder: FormBuilder
  ) {
    this.todoId = activatedRoute.snapshot.params["todoId"];
    this.todoDetails$ = this._todosService.getTodo(this.todoId)
      .subscribe((item) => {
        console.log("item details", item);
        if (item) {
          this.todoObject = item;
          this.prePopulateValues();
        }
      });

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
    this.markFormDirty();
    console.log(this.priority);
  }

  markFormDirty() {
    this.todoDetailsFormGroup.markAsDirty();
    this.todoDetailsFormGroup.markAsTouched();
  }

  prePopulateValues() {
    this.todoDetailsFormGroup.reset();
    this.todoDetailsFormGroup.markAsUntouched();
    if (this.todoObject) {
      if (this.todoObject.todoDescription) {
        this.todoDetailsFormGroup.get('todoDescription').setValue(this.todoObject.todoDescription);
      }
      this.todoDetailsFormGroup.get('todoTitle').setValue(this.todoObject.todoTitle);
      this.priority = this.todoObject.priority;
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.todoDetails$) {
      this.todoDetails$.unsubscribe();
      this.todoDetails$ = null;
      this.todoObject = null;
    }
  }

  async confirmUpdateDetails() {
    if (this.todoDetailsFormGroup.touched && this.todoDetailsFormGroup.dirty) {
      const alert = await this._alertController.create({
        header: 'Confirm Update',
        message: 'This action will update the existing task details permanently. Do you want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => {
              this.updateTaskDetails();
              this.editing = !this.editing;
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.editing = !this.editing;
    }
  }

  updateTaskDetails() {
    const modifiedItem: Todo = this.todoDetailsFormGroup.value;
    modifiedItem.priority = this.priority;
    const resultantItem = Object.assign({}, this.todoObject, modifiedItem);
    console.log(this.todoObject, this.todoDetailsFormGroup.value, resultantItem);
    this._loader.presentLoader().then(() => {
      this._todosService.updateTodo(resultantItem).then(response => {
        // this._toastManager.showToast(BorrowedAppConstants.ITEM_UPDATE_DETAILS_SUCCESS_MESSAGE);
        console.log("todo updated");
      }).catch(error => {
        this._toastManager.showErrorToast(error);
      }).finally(() => {
        this._loader.stopLoader();
      });
    });
  }

  async confirmCancelEditing() {
    if (this.todoDetailsFormGroup.touched && this.todoDetailsFormGroup.dirty) {
      const alert = await this._alertController.create({
        header: 'Confirm Cancel',
        message: 'There are unsaved changes. The changes will be lost upon confirmation. Do you still want to continue?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => {
              this.prePopulateValues();
              this.editing = !this.editing;
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.editing = !this.editing;
    }
  }

}
