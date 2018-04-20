import { TestBed, inject } from '@angular/core/testing';

import { AuthoutService } from './authout.service';

describe('AuthoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthoutService]
    });
  });

  it('should be created', inject([AuthoutService], (service: AuthoutService) => {
    expect(service).toBeTruthy();
  }));
});
