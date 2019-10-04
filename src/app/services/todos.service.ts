import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { Todo } from '../types';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodosAppConstants, UserActivityType } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  collectionRef: AngularFirestoreCollection;

  constructor(
    private _angularFirestore: AngularFirestore,
    private _authenticationService: AuthenticationService
  ) { 
    this.collectionRef = this._angularFirestore
      .collection(TodosAppConstants.TODOS_COLLECTION)
      .doc(this._authenticationService.getCurrentUserId())
      .collection(TodosAppConstants.TODOS_COLLECTION);
  }

  addTodo(todo: Todo): Promise<any> {
    return this.collectionRef
      .add({
        todoTitle: todo.todoTitle,
        todoDescription: todo.todoDescription,
        priority: todo.priority,
        entryDate: new Date().toISOString(),
        isPending: true
      }).finally(() => {
      });
  }

  getTodo(todoId: string): Observable<any> {
    return this.collectionRef
      .doc(todoId).valueChanges().pipe(map((data) => {
        data["todoId"] = todoId;
        return data;
      }));
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
      });
  }

  completeTodo(todo: Todo): Promise<void> {
    todo.isPending = false;
    todo.completionDate = new Date().toISOString();
    return this.collectionRef
      .doc(todo.todoId).update(todo).finally(() => {
      });
  }

  markAsPendingTodo(todo: Todo): Promise<void> {
    todo.isPending = true;
    return this.collectionRef
      .doc(todo.todoId).update(todo).finally(() => {
      });
  }

  deleteTodo(todo: Todo): Promise<void> {
    return this.collectionRef
      .doc(todo.todoId).delete().finally(() => {
      });;
  }
}
