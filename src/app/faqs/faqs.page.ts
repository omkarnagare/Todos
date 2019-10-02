import { Component, OnInit } from '@angular/core';
import { ToastManagerService } from '../services/toast-manager.service';
import { TodosAppConstants } from '../constants';
import { ClipboardManagerService } from '../services/clipboard-manager.service';
import { AdmobManagerService } from '../services/admob-manager.service';

import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
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
export class FaqsPage implements OnInit {

  googlePayId: string;

  showFAQs: boolean = false;

  constructor(
    private _toastManager: ToastManagerService,
    private _clipBoardService: ClipboardManagerService,
    private _admobManager: AdmobManagerService
  ) {
    this.googlePayId = TodosAppConstants.GOOGLE_PAY_ID;
  }

  ngOnInit() {
  }

  copyToClipboard() {
    this._clipBoardService.write(this.googlePayId).then(() => {
      this._toastManager.showToast("Google pay Id copied to clipboard.")
    }).catch((error) => {
      this._toastManager.showErrorToast(error);
    })
  }

  ionViewDidEnter() {
    this.showFAQs = true;
    this._admobManager.showInterstitialAd();
  }

  ionViewWillLeave() {
    this.showFAQs = false;
  }

}
