import { Component, OnInit } from '@angular/core';
import { ToastManagerService } from '../services/toast-manager.service';
import { TodosAppConstants } from '../constants';
import { ClipboardManagerService } from '../services/clipboard-manager.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {

  googlePayId: string;

  constructor(
    private _toastManager: ToastManagerService,
    private _clipBoardService: ClipboardManagerService
  ) {
    this.googlePayId = TodosAppConstants.GOOGLE_PAY_ID;
  }

  ngOnInit() {
  }

  copyToClipboard() {
    this._clipBoardService.write(this.googlePayId).then(() => {
      this._toastManager.showToast("Google pay Id copied to clipboard.")
    }).catch((error) => {
      console.error(error);
      this._toastManager.showToast(error);
    })
  }

}
