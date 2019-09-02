import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { OnlineSharingManagerService } from '../services/online-sharing-manager.service';
import { EmailShare } from '../types';
import { TodosAppConstants } from '../constants';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  contactUsFormGroup: FormGroup;
  validationMessages: any;

  loader: any = null;

  constructor(
    private _alertController: AlertController,
    private _loadingController: LoadingController,
    private _emailSharingService: OnlineSharingManagerService,
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

  ngOnInit() {
  }

  async showAlertForSendingEmail() {
    const alert = await this._alertController.create({
      message: 'This will send a email to Team Todos. Would you like to continue?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.presentLoader().then(() => {
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

  async presentLoader() {
    if (!this.loader) {
      this.loader = await this._loadingController.create({
        message: 'Sending mail ...'
      });
      await this.loader.present();
    }
  }

  async stopLoader() {
    if (this.loader) {
      await this.loader.dismiss();
      this.loader = null;
    }
  }

  sendEmail() {
    const formValue = this.contactUsFormGroup.value;
    const details: EmailShare = {
      to: ["omtechnologies.apps@gmail.com"],
      cc: [],
      bcc: [],
      subject: "Issue with Todos: " + formValue.subject,
      body: formValue.body,
      isHtml: false
    };

    this._emailSharingService.sendEmail(details).then(response => {
      console.log(response);
      this.stopLoader().then(() => {
        if (response) {
          // this.showAlert(TodosAppConstants.EMAIL_SENT_MESSAGE);
        } else {
          this.showAlert(TodosAppConstants.GMAIL_NOT_FOUND_MESSAGE);
        }
      });
    }).catch(error => {
      console.error(error);
      this.stopLoader().then(() => {
        this.showAlert(TodosAppConstants.OPERATION_NOT_SUPPORTED_MESSAGE);
      });
    })
  }

}
