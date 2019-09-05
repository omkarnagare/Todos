import { Injectable } from '@angular/core';
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
    private _angualrFireAuth: AngularFireAuth,
  ) { }

  getUserProfile(): Observable<any> {
    return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .valueChanges();
  }

  setUserProfileImage(imageData: any) {
    // const image = TodosAppConstants.BASE64_IMAGE_PREFIX_DATA + imageData;
    // return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
    //   .doc(this._angualrFireAuth.auth.currentUser.uid)
    //   .update({
    //     profileImage: image
    //   });
  }

  setUserInfo(userInfo: UserInfo) {
    return this._anugularFirestore.collection(TodosAppConstants.USER_COLLECTION)
      .doc(this._angualrFireAuth.auth.currentUser.uid)
      .set({
        name: userInfo.name,
        email: userInfo.email,
        profileImage: "/assets/person.svg"
      });
  }
}
