import { TestBed } from '@angular/core/testing';

import { ClipboardManagerService } from './clipboard-manager.service';

describe('ClipboardManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClipboardManagerService = TestBed.get(ClipboardManagerService);
    expect(service).toBeTruthy();
  });
});
