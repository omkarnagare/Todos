import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { OnlineSharingManagerService } from '../services/online-sharing-manager.service';
import { EmailShare } from '../types';
import { TodosAppConstants } from '../constants';
import { LoaderManagerService } from '../services/loader-manager.service';
import { DeviceInfoService } from '../services/device-info.service';
import { ClipboardManagerService } from '../services/clipboard-manager.service';
import { ToastManagerService } from '../services/toast-manager.service';
import { AdmobManagerService } from '../services/admob-manager.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
  animations: [
    trigger('fadein', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slidelefttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('sliderighttitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidetoptitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ]),
    trigger('slidebottomtitle', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(+150%)' }),
        animate('600ms 200ms ease-out', style({ transform: 'translateY(0%)', opacity: 1 }))
      ])
    ])
  ]
})
export class ContactUsPage implements OnInit {

  contactUsFormGroup: FormGroup;
  validationMessages: any;

  isMobilePlatform: boolean = null;
  deviceDetails: string;
  supportEmail: string;

  constructor(
    private _alertController: AlertController,
    private _loaderManager: LoaderManagerService,
    private _emailSharingService: OnlineSharingManagerService,
    private _deviceInfoService: DeviceInfoService,
    private _toastManager: ToastManagerService,
    private _clipBoardService: ClipboardManagerService,
    private _admobManager: AdmobManagerService,
    formBuilder: FormBuilder
  ) {
    this.contactUsFormGroup = formBuilder.group({
      subject: ["", [Validators.required]],
      body: ["", [Validators.required]]
    });

    this.validationMessages = {
      'subject': [
        { type: 'required', message: 'Subject cannot be left blank.' }],
      'body': [
        { type: 'required', message: 'Body cannot be left blank.' }]
    };
  }

  isError(name: string, validationType: string): boolean {
    return this.contactUsFormGroup.get(name).hasError(validationType) && (this.contactUsFormGroup.get(name).dirty || this.contactUsFormGroup.get(name).touched)
  }

  ionViewDidEnter() {
    this._admobManager.showInterstitialAd();
  }

  ngOnInit() {
    this.supportEmail = TodosAppConstants.SUPPORT_EMAIL;
    this._loaderManager.presentLoader().then(() => {
      this._deviceInfoService.fetchDeviceInfo().then(() => {
        this.isMobilePlatform = this._deviceInfoService.isMobilePlatform();
        this.deviceDetails = this._deviceInfoService.getDeviceDetails();
      }).finally(() => {
        this._loaderManager.stopLoader();
      });
    });    
  }

  copyToClipboard(text: string, type: string) {
    this._clipBoardService.write(text).then(() => {
      this._toastManager.showToast(type + " copied to clipboard.")
    }).catch((error) => {
      this._toastManager.showErrorToast(error);
    })
  }

  async showAlertForSendingEmail() {
    const alert = await this._alertController.create({
      message: 'This will send a email to Team Mr.Todos. Would you like to continue?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this._loaderManager.presentLoader().then(() => {
              this.sendEmail();
            });
          }
        },
        {
          text: 'No',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  async showAlert(message: string) {
    const alert = await this._alertController.create({
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

  sendEmail() {
    const formValue = this.contactUsFormGroup.value;
    const details: EmailShare = {
      to: [this.supportEmail],
      cc: [],
      bcc: [],
      subject: "Regarding Issue: " + formValue.subject,
      body: formValue.body,
      isHtml: false
    };

    this._emailSharingService.sendEmail(details).then(response => {
      console.log(response);
      this._loaderManager.stopLoader().then(() => {
        if (response) {
          // this.showAlert(TodosAppConstants.EMAIL_SENT_MESSAGE);
        } else {
          this.showAlert(TodosAppConstants.GMAIL_NOT_FOUND_MESSAGE);
        }
      });
    }).catch(error => {
      console.error(error);
      this._loaderManager.stopLoader().then(() => {
        this.showAlert(TodosAppConstants.OPERATION_NOT_SUPPORTED_MESSAGE);
      });
    })
  }

}
