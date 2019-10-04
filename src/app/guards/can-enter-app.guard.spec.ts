import { TestBed, async, inject } from '@angular/core/testing';

import { CanEnterAppGuard } from './can-enter-app.guard';

describe('CanEnterAppGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanEnterAppGuard]
    });
  });

  it('should ...', inject([CanEnterAppGuard], (guard: CanEnterAppGuard) => {
    expect(guard).toBeTruthy();
  }));
});
