import { TestBed } from '@angular/core/testing';

import { CameraAccessService } from './camera-access.service';

describe('CameraAccessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CameraAccessService = TestBed.get(CameraAccessService);
    expect(service).toBeTruthy();
  });
});
