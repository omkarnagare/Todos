import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController, ActionSheetController, Platform } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { UsersManagerService } from '../services/users-manager.service';
import { ImageSourceType, TodosAppConstants } from '../constants';
import { CameraAccessService } from '../services/camera-access.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { LoaderManagerService } from '../services/loader-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.page.html',
  styleUrls: ['./account-details.page.scss'],
})
export class AccountDetailsPage implements OnInit, AfterViewInit, OnDestroy {

  storedUserProfile: Observable<any>;
  storedUserProfile$: Subscription;

  userInfoFormGroup: FormGroup;
  validationMessages: any;
  editingName: boolean = false;

  backButtonSubscription$: Subscription;

  isCameraAvailable: boolean = false;

  constructor(
    private _router: Router,
    private _usersService: UsersManagerService,
    private _authenticationService: AuthenticationService,
    private _cameraAccessService: CameraAccessService,
    private _toastManager: ToastManagerService,
    private _loaderManager: LoaderManagerService,
    private _alertController: AlertController,
    private _actionSheetController: ActionSheetController,
    private _platform: Platform,
    formBuilder: FormBuilder
  ) {
    this._cameraAccessService.isCameraAvailable().then((isCameraAvailable) => {
      this.isCameraAvailable = isCameraAvailable;
    });

    this.userInfoFormGroup = formBuilder.group({
      name: ["", [Validators.required, Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$")]]
    });

    this.validationMessages = {
      'name': [
        { type: 'required', message: 'Name cannot be left blank.' },
        { type: 'pattern', message: 'Not a valid name.' }]
    };
  }

  isError(name: string, validationType: string): boolean {
    return this.userInfoFormGroup.get(name).hasError(validationType) && (this.userInfoFormGroup.get(name).dirty || this.userInfoFormGroup.get(name).touched)
  }

  ngOnInit() {
    this.storedUserProfile = this._usersService.getUserProfile();
    this.storedUserProfile$ = this.storedUserProfile.subscribe(data => {
      console.log("storedUserProfile", data);
    });
  }

  ngAfterViewInit() {
    this.backButtonSubscription$ = this._platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {
    this.backButtonSubscription$.unsubscribe();
    this.backButtonSubscription$ = null;

    this.storedUserProfile$.unsubscribe();
    this.storedUserProfile$ = null;
    this.storedUserProfile = null;
  }

  async selectImageSource() {
    let buttons;
    let cancelButtonText: string;
    if (this.isCameraAvailable) {
      // push option to select camera only when available
      buttons = [{
        text: "Camera",
        icon: 'camera',
        handler: () => {
          this.takePicture(ImageSourceType.FRONT_CAMERA);
        }
      },
      {
        text: "Photos",
        icon: 'images',
        handler: () => {
          this.takePicture(ImageSourceType.GALLERY);
        }
      }]
      cancelButtonText = "Cancel";
    } else {
      cancelButtonText = "Not Available"
    }
    buttons.push({
      text: cancelButtonText,
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    const alert = await this._actionSheetController.create({
      buttons: buttons
    });
    await alert.present();
  }

  async takePicture(type: ImageSourceType) {
    this._cameraAccessService.takePicture(type).then((photoDataURL: string) => {
      // console.log("photoDataURL", photoDataURL);
      this._loaderManager.presentLoader().then(() => {
        this._usersService.updateUserProfileImage(photoDataURL).then(() => {
          this._toastManager.showToast(TodosAppConstants.USER_IMAGE_UPDATE_SUCCESS_MESSAGE);
        }).catch(error => {
          this._toastManager.showErrorToast(error);
        }).finally(() => {
          this._loaderManager.stopLoader();
        });
      });
    }).catch(error => {
      this._toastManager.showErrorToast(error);
    })
  }

  async confirmLogOut() {
    const alert = await this._alertController.create({
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.logOut();
          }
        }
      ]
    });
    await alert.present();
  }

  updateUserDisplayName() {
    const displayName = this.userInfoFormGroup.get('name').value;
    this._loaderManager.presentLoader().then(() => {
      this._usersService.updateUserDisplayName(displayName).then(() => {
        this._toastManager.showToast(TodosAppConstants.DISPLAY_NAME_UPDATE_SUCCESS_MESSAGE);
        this.userInfoFormGroup.reset();
        this.editingName = false;
      }).catch(error => {
        this._toastManager.showErrorToast(error);
      }).finally(() => {
        this._loaderManager.stopLoader();
      });
    });
  }

  logOut() {
    this._loaderManager.presentLoader().then(() => {
      this._authenticationService.logOut().then(() => {
        console.log("User logged out successfully");
        this._router.navigate(["/log-in"]);
        // window.location.reload();
      }).catch((error) => {
        this._toastManager.showErrorToast(error);
      }).finally(() => {
        this._loaderManager.stopLoader();
      });
    });
  }

  // logOut() {
  //   this._authenticationService.logOut().subscribe(() => {
  //     console.log("User logged out successfully");
  //     window.location.reload();
  //   },
  //   (error) => {
  //     console.error("Log Out Error :", error);
  //   });
  // }

}
