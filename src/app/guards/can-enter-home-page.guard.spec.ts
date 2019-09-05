import { TestBed, async, inject } from '@angular/core/testing';

import { CanEnterHomePageGuard } from './can-enter-home-page.guard';

describe('CanEnterHomePageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanEnterHomePageGuard]
    });
  });

  it('should ...', inject([CanEnterHomePageGuard], (guard: CanEnterHomePageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
