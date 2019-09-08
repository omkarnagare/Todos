import { Injectable, SecurityContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { TodosAppConstants } from '../constants';
import { UserInfo } from '../types';

@Injectable({
  providedIn: 'root'
})
export class UsersManagerService {

  constructor(
    private _anugularFirestore: AngularFirestore,
    private _angualrFireAuth: AngularFireAuth
  ) { }

  getUserProfile(): Observable<any> {
    return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .valueChanges();
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

  setUserInfo(userInfo: UserInfo) {
    return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .set({
        name: userInfo.name,
        email: userInfo.email,
        profileImage: userInfo.profileImage,
        signedInWith: userInfo.signedInWith
      });
  }

  clearPersistence(): Promise<void> {
    return this._anugularFirestore.firestore.clearPersistence();
  }
}
