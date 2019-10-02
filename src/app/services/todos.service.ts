import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { Todo } from '../types';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivitiesService } from './activities.service';
import { TodosAppConstants, UserActivityType } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  collectionRef: AngularFirestoreCollection;

  constructor(
    private _angularFirestore: AngularFirestore,
    private _authenticationService: AuthenticationService,
    private _activitiesService: ActivitiesService,
  ) { 
    this.collectionRef = this._angularFirestore
      .collection(TodosAppConstants.TODOS_COLLECTION)
      .doc(this._authenticationService.getCurrentUserId())
      .collection(TodosAppConstants.TODOS_COLLECTION);
  }

  addTodo(todo: Todo): Promise<any> {
    return this.collectionRef
      .add({
        todoDescription: todo.todoDescription,
        tags: todo.tags,
        entryDate: todo.entryDate,
        targetDate: todo.targetDate,

        isPending: true
      }).finally(() => {
        this._activitiesService.addActivity(todo, UserActivityType.ADD);
      });
  }

  getTodo(todoId: string): Observable<any> {
    return this.collectionRef
      .doc(todoId).valueChanges();
  }

  getAllTodos(): Observable<any> {
    return this.collectionRef
      .snapshotChanges()
      .pipe(
        map(actions => {
          const todos = actions.map(action => ({ todoId: action.payload.doc.id, ...action.payload.doc.data() }));
          return todos;
        })
      );
  }

  updateTodo(todo: Todo): Promise<void> {
    return this.collectionRef
      .doc(todo.todoId).update(todo).finally(() => {
        this._activitiesService.addActivity(todo, UserActivityType.UPDATE);
      });
  }

  completeTodo(todo: Todo): Promise<void> {
    todo.isPending = false;
    return this.collectionRef
      .doc(todo.todoId).update(todo).finally(() => {
        this._activitiesService.addActivity(todo, UserActivityType.COMPLETE);
      });
  }

  markAsPendingTodo(todo: Todo): Promise<void> {
    todo.isPending = true;
    return this.collectionRef
      .doc(todo.todoId).update(todo).finally(() => {
        this._activitiesService.addActivity(todo, UserActivityType.UPDATE);
      });
  }

  deleteTodo(todo: Todo): Promise<void> {
    return this.collectionRef
      .doc(todo.todoId).delete().finally(() => {
        this._activitiesService.addActivity(todo, UserActivityType.DELETE);
      });;
  }
}
