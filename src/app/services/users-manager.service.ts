import { Injectable, SecurityContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { TodosAppConstants } from '../constants';
import { UserInfo } from '../types';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersManagerService {

  constructor(
    private _anugularFirestore: AngularFirestore,
    private _angualrFireAuth: AngularFireAuth
  ) { }

  getUserProfile(): Observable<any> {
    return this._angualrFireAuth.user.pipe(switchMap(
      (user) => {
        if (user) {
          return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
            .doc(this._angualrFireAuth.auth.currentUser.uid)
            .valueChanges()
        } else {
          return of(null);
        }
      }
    ));
  }

  updateUserProfileImage(photoDataURL: string): Promise<void> {
    return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .update({
        profileImage: photoDataURL
      });
  }

  updateUserDisplayName(displayName: string): Promise<void> {
    return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .update({
        name: displayName
      });
  }

  setPIN(pin: string) {
    return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .update({
        pin: pin
      });
  }

  removePIN() {
    return this.setPIN("");
  }

  setUserInfo(userInfo: UserInfo) {
    return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .update({
        email: userInfo.email,
        signedInWith: userInfo.signedInWith
      }).catch(error => {
        console.error(error);
        this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
          .doc(this._angualrFireAuth.auth.currentUser.uid)
          .set({
            name: userInfo.name,
            email: userInfo.email,
            profileImage: userInfo.profileImage,
            signedInWith: userInfo.signedInWith
          });
      });
  }

}
