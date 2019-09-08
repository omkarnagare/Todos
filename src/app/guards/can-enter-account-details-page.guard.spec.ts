import { TestBed, async, inject } from '@angular/core/testing';

import { CanEnterAccountDetailsPageGuard } from './can-enter-account-details-page.guard';

describe('CanEnterAccountDetailsPageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanEnterAccountDetailsPageGuard]
    });
  });

  it('should ...', inject([CanEnterAccountDetailsPageGuard], (guard: CanEnterAccountDetailsPageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
