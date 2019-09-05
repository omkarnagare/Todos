import { TestBed } from '@angular/core/testing';

import { UsersManagerService } from './users-manager.service';

describe('UsersManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsersManagerService = TestBed.get(UsersManagerService);
    expect(service).toBeTruthy();
  });
});
