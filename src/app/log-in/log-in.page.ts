import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserState, TodosAppConstants, SIGN_IN_OPTIONS } from '../constants';

import { Platform, AlertController, MenuController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { LoaderManagerService } from '../services/loader-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { Router } from '@angular/router';
import { LogInCredentials, UserInfo } from '../types';
import { UsersManagerService } from '../services/users-manager.service';
import { AdmobManagerService } from '../services/admob-manager.service';
import { DeviceInfoService } from '../services/device-info.service';

import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

import { UserInfo as FirebaseUserInfo } from 'firebase/app';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit, OnDestroy, AfterViewInit {

  backButtonSubscription$;

  userInfoFormGroup: FormGroup;
  validationMessages: any;

  showPassword: boolean = false;
  userState: UserState;
  isMobilePlatform: boolean = true;

  constructor(
    private _admobManager: AdmobManagerService, // to load ads
    private _router: Router,
    private _alertController: AlertController,
    private _menuController: MenuController,
    private _loderManager: LoaderManagerService,
    private _toastManager: ToastManagerService,
    private _userService: UsersManagerService,
    private _authenticationService: AuthenticationService,
    private _deviceInfoService: DeviceInfoService,
    private _platform: Platform,
    formBuilder: FormBuilder
  ) {
    this._deviceInfoService.fetchDeviceInfo().then(() => {
      this.isMobilePlatform = this._deviceInfoService.isMobilePlatform();
    });

    this.userInfoFormGroup = formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]]
    });

    this.validationMessages = {
      'email': [
        { type: 'required', message: 'User email cannot be left blank.' },
        { type: 'email', message: 'Not a valid Email address.' }],
      'password': [
        { type: 'minlength', message: 'Password should be atleast 6 charcters.' },
        { type: 'required', message: 'Password cannot be left blank.' }],
      'confirmPassword': [
        { type: 'minlength', message: 'Password should be atleast 6 charcters.' },
        { type: 'required', message: 'Password cannot be left blank.' }],
      'name': [
        { type: 'required', message: 'Name cannot be left blank.' },
        { type: 'pattern', message: 'Not a valid name.' }]
    };
  }

  ionViewWillEnter() {
    this._menuController.enable(false);
  }

  ionViewWillLeave() {
    this._menuController.enable(true);
  }

  isError(name: string, validationType: string): boolean {
    return this.userInfoFormGroup.get(name).hasError(validationType) && (this.userInfoFormGroup.get(name).dirty || this.userInfoFormGroup.get(name).touched)
  }

  ionViewDidEnter() {
    // this._admobService.showBannerAd();
    SplashScreen.hide();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
  }

  addValidatorsForLoginWithEmailAndPassword() {
    this.removeAllControls();
    this.userInfoFormGroup.addControl('email', new FormControl("", [Validators.required, Validators.email]));
    this.userInfoFormGroup.addControl('password', new FormControl("", [Validators.required, Validators.minLength(6)]));
    this.userInfoFormGroup.updateValueAndValidity();
  }

  addValidatorsForSignUpWithEmailAndPassword() {
    this.removeAllControls();
    this.userInfoFormGroup.addControl('email', new FormControl("", [Validators.required, Validators.email]));
    this.userInfoFormGroup.addControl('password', new FormControl("", [Validators.required, Validators.minLength(6)]));
    this.userInfoFormGroup.addControl('confirmPassword', new FormControl("", [Validators.required, Validators.minLength(6)]));
    this.userInfoFormGroup.addControl('name', new FormControl("", [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]));
    this.userInfoFormGroup.updateValueAndValidity();
  }

  addValidatorsForForgotPasswordWithEmailAndPassword() {
    this.removeAllControls();
    this.userInfoFormGroup.addControl('email', new FormControl("", [Validators.required, Validators.email]));
    this.userInfoFormGroup.updateValueAndValidity();
  }

  removeAllControls() {
    this.userInfoFormGroup.removeControl('name');
    this.userInfoFormGroup.removeControl('email');
    this.userInfoFormGroup.removeControl('password');
    this.userInfoFormGroup.removeControl('confirmPassword');
  }

  handleError(error: any) {
    console.error(error);
    this._loderManager.stopLoader();
    this._toastManager.showToast(error.message ? error.message : error);
  }

  handleSuccess(response: any) {
    console.log(response);
    this._loderManager.stopLoader();
    this._router.navigate(["/home"]);
  }

  logInWithEmailAndPassword() {
    this._loderManager.presentLoader().then(() => {

      if (this.userState === UserState.LOG_IN) {
        if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
          const credentials: LogInCredentials = this.userInfoFormGroup.value;
          this._authenticationService.logInWithEmailAndPassword(credentials)
            .then((authData) => {
              this.handleSuccess(authData);
            }).catch((authDataError) => {
              this.handleError(authDataError);
            });
        } else {
          this._toastManager.showToast(TodosAppConstants.INVALID_FIELDS_MESSAGE);
          this._loderManager.stopLoader();
        }
      } else {
        this.userState = UserState.LOG_IN;
        this.addValidatorsForLoginWithEmailAndPassword();
        this._loderManager.stopLoader();
      }

    });
  }

  signUp() {
    this._loderManager.presentLoader().then(() => {

      if (this.userState === UserState.SIGN_UP) {
        if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
          if (this.userInfoFormGroup.get('password').value !== this.userInfoFormGroup.get('confirmPassword').value) {
            this._toastManager.showToast(TodosAppConstants.PASSWORD_MISSMATCH_MESSAGE);
            this._loderManager.stopLoader();
            return;
          }
          const credentials: LogInCredentials = this.userInfoFormGroup.value;

          const userInfo: UserInfo = this.userInfoFormGroup.value;
          userInfo.profileImage = "/assets/person.svg";
          userInfo.signedInWith = SIGN_IN_OPTIONS.EMAIL_PASSOWRD;

          this._authenticationService.signUp(credentials)
            .then((authData) => {
              this._userService.setUserInfo(userInfo).then(response => {
                this.handleSuccess(response);
              }).catch(error => {
                this.handleError(error);
              });
            }).catch((authDataError) => {
              this.handleError(authDataError);
            });
        } else {
          this._toastManager.showToast(TodosAppConstants.INVALID_FIELDS_MESSAGE);
          this._loderManager.stopLoader();
        }
      } else {
        this.userState = UserState.SIGN_UP;
        this.addValidatorsForSignUpWithEmailAndPassword();
        this._loderManager.stopLoader();
      }

    });
  }

  forgotPassword() {
    this._loderManager.presentLoader().then(() => {

      if (this.userState === UserState.FORGOT_PASSWORD) {
        if (this.userInfoFormGroup.valid && this.userInfoFormGroup.dirty) {
          this._authenticationService.resetPassword(this.userInfoFormGroup.get('email').value)
            .then(response => {
              console.log(response);
              this._loderManager.stopLoader();
              this.showAlertForResetPassword();
            }).catch(error => {
              this.handleError(error);
            });
        } else {
          this._toastManager.showToast(TodosAppConstants.INVALID_FIELDS_MESSAGE);
          this._loderManager.stopLoader();
        }
      } else {
        this.userState = UserState.FORGOT_PASSWORD
        this.addValidatorsForForgotPasswordWithEmailAndPassword();
        this._loderManager.stopLoader();
      }

    });
  }

  async showAlertForResetPassword() {
    const alert = await this._alertController.create({
      message: 'Please check your email inbox for a password reset link',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  logInWithFacebook() {
    this._loderManager.presentLoader().then(() => {
      this._authenticationService.logInWithFacebook().subscribe(
        (user: FirebaseUserInfo) => {
          console.log("Facebook User Info: ", user);
          this.setUserInfoInFirebase({
            profileImage: user.photoURL ? user.photoURL : "/assets/person.svg",
            email: user.email,
            name: user.displayName,
            signedInWith: SIGN_IN_OPTIONS.FACEBOOK
          });
        },
        (error) => {
          this.handleError(error);
        });
    });
  }

  logInWithGooglePlus() {
    this._loderManager.presentLoader().then(() => {
      this._authenticationService.logInWithGooglePlus().subscribe(
        (user: FirebaseUserInfo) => {
          console.log("Google User Info: ", user);
          this.setUserInfoInFirebase({
            profileImage: user.photoURL ? user.photoURL : "/assets/person.svg",
            email: user.email,
            name: user.displayName,
            signedInWith: SIGN_IN_OPTIONS.GOOGLE
          });
        },
        (error) => {
          this.handleError(error);
        });
    });
  }

  logInWithTwitter() {
    this._loderManager.presentLoader().then(() => {
      this._authenticationService.logInWithTwitter().subscribe(
        (user: FirebaseUserInfo) => {
          console.log("Twitter User Info: ", user);
          this.setUserInfoInFirebase({
            profileImage: user.photoURL ? user.photoURL : "/assets/person.svg",
            email: user.email,
            name: user.displayName,
            signedInWith: SIGN_IN_OPTIONS.TWITTER
          });
        },
        (error) => {
          this.handleError(error);
        });
    });
  }

  setUserInfoInFirebase(userInfo: UserInfo) {
    this._userService.setUserInfo(userInfo).then(response => {
      this._router.navigate(["/home"]);
    }).catch(error => {
      this._toastManager.showToast(error.message ? error.message : error);
    }).finally(() => {
      this._loderManager.stopLoader();
    });
  }

}
