import { TestBed } from '@angular/core/testing';

import { AdmobManagerService } from './admob-manager.service';

describe('AdmobManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmobManagerService = TestBed.get(AdmobManagerService);
    expect(service).toBeTruthy();
  });
});
