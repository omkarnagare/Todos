import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PinModalData } from '../types';
import { UsersManagerService } from './users-manager.service';

@Injectable({
  providedIn: 'root'
})
export class PinVerificationService implements OnInit, OnDestroy {

  userProfileFetched: boolean = false; // one time variable
  verified: boolean = false; // status of pin verification
  pin: string = ""; // current pin

  constructor(
    private _usersService: UsersManagerService
  ) {
  }

  isVerified(): Promise<PinModalData> {
    return new Promise((resolve, reject) => {
      if (this.userProfileFetched) {
        resolve({
          pin: this.pin,
          verified: this.verified
        });
      } else {
        this._usersService.getUserProfile().subscribe(userProfile => {
          if (userProfile) {
            if (userProfile.pin) {
              this.verified = false;
              this.pin = userProfile.pin;
            } else {
              this.verified = true;
            }
            this.userProfileFetched = true;
            resolve({
              pin: this.pin,
              verified: this.verified
            });
          }
        });
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
