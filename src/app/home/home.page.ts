import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Platform, ModalController, AlertController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
import { LocalNotificationsService } from '../services/local-notifications.service';
import { ConfirmExitService } from '../services/confirm-exit.service';
import { PinVerificationService } from '../services/pin-verification.service';
import { PinUnlockPage } from '../pin-unlock/pin-unlock.page';
import { PIN_STATE } from '../constants';
import { Todo } from '../types';
import { TodosService } from '../services/todos.service';
import { LoaderManagerService } from '../services/loader-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';
const { SplashScreen } = Plugins;

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$: Subscription;

  allTodos: Todo[] = null;
  todos: Todo[] = null;
  todos$: Subscription;

  taskStatus: string = null;
  searchTerm: string = "";

  constructor(
    private _todosService: TodosService,
    private _platform: Platform,
    private _pinVerification: PinVerificationService,
    private _localNotification: LocalNotificationsService,
    private _confirmExitService: ConfirmExitService,
    private _toastManager: ToastManagerService,
    private _alertController: AlertController,
    private _loaderManager: LoaderManagerService,
    private _modalController: ModalController
  ) {
    this.todos$ = this._todosService.getAllTodos().subscribe((data) => {
      console.log("todos", data);
      this.allTodos = data;
      this.todos = [...data];

      this._localNotification.processTodosForNotifications([...data]);

      this.filterTasks();
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this._pinVerification.isVerified().then((data) => {
      if (data.verified) {
        // safe to go ahead
      } else {
        this.openPinVerifyModal(data.pin);
      }
      SplashScreen.hide();
    });
  }

  onTaskStatusChange(event: any) {
    this.taskStatus = event.detail.value;
    console.log(this.taskStatus);
    this.filterTasks();
  }

  onSearchInput(event: any) {
    this.searchTerm = event.detail.value;
    console.log(this.searchTerm);
    this.filterTasks();
  }

  filterTasks() {
    if (!this.allTodos || (this.allTodos && this.allTodos.length <= 0)) {
      return;
    }

    this.todos = this.allTodos.filter(todo => {
      if (todo.todoTitle.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
        switch (this.taskStatus) {
          case "all":
            return true;
          case "pending":
            if (todo.isPending) {
              return true;
            } else {
              return false;
            }
          case "completed":
            if (!todo.isPending) {
              return true;
            } else {
              return false;
            }
        }
      } else {
        return false;
      }

    });

    this.sortTasks();
  }

  sortTasks() {
    this.todos.sort((todo1: Todo, todo2: Todo) => {
      if (todo1.priority === "high" && (todo2.priority === "medium" || todo2.priority === "low")) {
        return -1;
      } else if (todo1.priority === "medium" && todo2.priority === "low") {
        return -1;
      } else if (todo2.priority === "high" && (todo1.priority === "medium" || todo1.priority === "low")) {
        return 1;
      } else if (todo2.priority === "medium" && todo1.priority === "low") {
        return 1;
      } else {
        return 0;
      }
    });

    this.todos.sort((todo1: Todo, todo2: Todo) => {
      if (todo1.isPending && !todo2.isPending) {
        return -1;
      } else if (!todo1.isPending && todo2.isPending) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  getClass(todo: Todo) {
    return "todo-item " + todo.priority;
  }

  async cofirmRecreation(todo: Todo) {
    const alert = await this._alertController.create({
      header: 'Confirm Duplication',
      message: 'This will mark the current task as complete and create a new duplicate task, Do you wish to Continue ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this._loaderManager.presentLoader().then(() => {
              this.recreateTodo(todo);
            });
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  recreateTodo(todo: Todo) {
    this._todosService.completeTodo(todo).then(() => {
      console.log("todo completed", todo);
      this._todosService.addTodo(todo).then((response) => {
        console.log(response, "todo created", todo);
      }).catch(error => {
        this._toastManager.showErrorToast(error);
      }).finally(() => {
        this._loaderManager.stopLoader();
      })
    }).catch(error => {
      this._toastManager.showErrorToast(error);
      this._loaderManager.stopLoader();
    });
  }

  async confirmCompletion(todo: Todo) {
    const alert = await this._alertController.create({
      header: 'Confirm Completion',
      message: 'Did you finish the task ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this._loaderManager.presentLoader().then(() => {
              this.completeTodo(todo);
            });
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  completeTodo(todo: Todo) {
    this._todosService.completeTodo(todo).then(() => {
      console.log("todo completed", todo);
    }).catch(error => {
      this._toastManager.showErrorToast(error);
    }).finally(() => {
      this._loaderManager.stopLoader();
    })
  }

  async cofirmDeletion(todo: Todo) {
    const alert = await this._alertController.create({
      header: 'Confirm Deletion',
      message: 'This will delete the task permanently. Would you like to continue?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this._loaderManager.presentLoader().then(() => {
              this.deleteTodo(todo);
            });
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  deleteTodo(todo: Todo) {
    this._todosService.deleteTodo(todo).then(() => {
      console.log("todo deleted", todo);
    }).catch(error => {
      this._toastManager.showErrorToast(error);
    }).finally(() => {
      this._loaderManager.stopLoader();
    })
  }

  async openPinVerifyModal(expectedPIN: string = "") {
    console.log(expectedPIN);
    const pinModalOfHome = await this._modalController.create({
      component: PinUnlockPage,
      componentProps: {
        title: "Enter PIN",
        pinSetupState: PIN_STATE.VERIFY_PIN,
        expectedPIN: expectedPIN
      },
      backdropDismiss: false // user cannot dissmiss by clicking outside
    });
    pinModalOfHome.onDidDismiss()
      .then((data) => {
        this._pinVerification.verified = true;
      });
    return await pinModalOfHome.present();
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      this._confirmExitService.confirmExit();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    this.backButtonSubscription$ = null;

    if (this.todos$) {
      this.todos$.unsubscribe();
      this.todos$ = null;
      this.todos = null;
    }
  }

}
