import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogInCredentials } from '../types';
import { Observable } from 'rxjs';
import { User } from 'firebase';

import { cfaSignIn, mapUserToUserInfo, cfaSignOut } from 'capacitor-firebase-auth';
import { UserInfo } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private _angularFireAuth: AngularFireAuth
  ) { }

  resetPassword(email: string) {
    return this._angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  logInWithEmailAndPassword(credentials: LogInCredentials): Promise<any> {
    return this._angularFireAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  logInWithGooglePlus(): Observable<UserInfo> {
    return cfaSignIn('google.com').pipe(
      mapUserToUserInfo(),
    );
  }

  logInWithFacebook(): Observable<UserInfo> {
    return cfaSignIn('facebook.com').pipe(
      mapUserToUserInfo(),
    );
  }

  logInWithTwitter(): Observable<UserInfo> {
    return cfaSignIn('twitter.com').pipe(
      mapUserToUserInfo(),
    );
  }

  logOut(): Promise<any> {
    return this._angularFireAuth.auth.signOut();
  }

  // logOut(): Observable<void> {
  //   return cfaSignOut();
  // }

  signUp(credentials: LogInCredentials): Promise<any> {
    return this._angularFireAuth.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  getAuthState(): Observable<User | null> {
    return this._angularFireAuth.authState;
  }

  getCurrentUserId(): string {
    return this._angularFireAuth.auth.currentUser.uid;
  }

  getAuth() {
    return this._angularFireAuth.auth;
  }
}
