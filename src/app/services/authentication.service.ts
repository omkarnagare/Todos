import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogInCredentials } from '../types';
import { Observable } from 'rxjs';
import { User } from 'firebase';

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

  logOut(): Promise<any> {
    return this._angularFireAuth.auth.signOut();
  }

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
