import { Injectable } from '@angular/core';
import { GenericShare, EmailShare } from '../types';

import { Plugins } from '@capacitor/core';
const { Share } = Plugins;

import { Email } from '@teamhive/capacitor-email';
import { TodosAppConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class OnlineSharingManagerService {

  email: any;

  constructor() {
    this.email = new Email();
  }

  async share(details: GenericShare) {
    return await Share.share({
      title: details.title,
      text: details.text,
      url: details.url,
      dialogTitle: details.dialogTitle
    });
  }

  async sendEmail(details: EmailShare): Promise<any> {
    const hasPermission = await this.email.hasPermission();
    if (!hasPermission) {
      await this.email.requestPermission();
    }
    const available = await this.email.isAvailable({
      alias: TodosAppConstants.EMAIL_APP // gmail, outlook, yahoo *optional*,
    });

    const aliases = await this.email.getAliases();
    console.log("available aliases", aliases);

    if (available.hasAccount) {
      return await this.email.open({
        to: details.to,
        cc: details.cc,
        bcc: details.bcc,
        subject: details.subject,
        body: details.body,
        isHtml: details.isHtml,
        attachments: details.attachments,
        app: TodosAppConstants.EMAIL_APP
      });
    } else {
      return new Promise(() => null);
    }
  }
}
