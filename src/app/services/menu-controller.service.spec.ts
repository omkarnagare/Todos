import { TestBed } from '@angular/core/testing';

import { MenuControllerService } from './menu-controller.service';

describe('MenuControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuControllerService = TestBed.get(MenuControllerService);
    expect(service).toBeTruthy();
  });
});
