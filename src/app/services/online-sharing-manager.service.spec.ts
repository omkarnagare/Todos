import { TestBed } from '@angular/core/testing';

import { OnlineSharingManagerService } from './online-sharing-manager.service';

describe('OnlineSharingManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnlineSharingManagerService = TestBed.get(OnlineSharingManagerService);
    expect(service).toBeTruthy();
  });
});
