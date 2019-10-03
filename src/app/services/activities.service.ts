import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { TodosAppConstants, UserActivityType } from '../constants';
import { Activity, Todo } from '../types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Utils } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(
    private _angularFirestore: AngularFirestore,
    private _authenticationService: AuthenticationService,
    private _utils: Utils
  ) {
  }

  constructMessage(activityObject: Todo, activityType: UserActivityType): string {
    // TODO-: add activity descriptions
    switch (activityType) {
      case UserActivityType.ADD:
        return "ADD_MESSAGE";
      case UserActivityType.UPDATE:
        return "UPDATE_MESSAGE";
      case UserActivityType.COMPLETE:
        return "COMPELET_MESSAGE";
      case UserActivityType.DELETE:
        return "DELETE_MESSAGE";
    }
  }

  getFormattedDateExpression(): string {
    const eventDate = new Date();
    return " on " + eventDate.getDate() + " " + this._utils.getMonthString(eventDate) + ", " + eventDate.getFullYear() + " at " + eventDate.getHours() + ":" + eventDate.getMinutes();
  }

  addActivity(activityObject: Todo, activityType: UserActivityType): Promise<any> {
    const activity: Activity = {
      activityDetails: this.constructMessage(activityObject, activityType),
      activityDate: this._utils.today()
    }
    return this._angularFirestore
      .collection(TodosAppConstants.ACTIVITIES_COLLECTION)
      .doc(this._authenticationService.getCurrentUserId())
      .collection(TodosAppConstants.ACTIVITIES_COLLECTION).add(activity);
  }

  getActivities(): Observable<any> {
    return this._angularFirestore
      .collection(TodosAppConstants.ACTIVITIES_COLLECTION)
      .doc(this._authenticationService.getCurrentUserId())
      .collection(TodosAppConstants.ACTIVITIES_COLLECTION).snapshotChanges().pipe(
        map(actions => {
          const activities = actions.map(action => ({ activityId: action.payload.doc.id, ...action.payload.doc.data() }));

          return activities.sort(
            (activity1, activity2) => {
              return new Date(activity2["activityDate"]).getTime() - new Date(activity1["activityDate"]).getTime();
            }
          );
        })
      );
  }
}
