import { TestBed, inject } from '@angular/core/testing';

import { AccountHeadService } from './account-head.service';

describe('AccountHeadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountHeadService]
    });
  });

  it('should be created', inject([AccountHeadService], (service: AccountHeadService) => {
    expect(service).toBeTruthy();
  }));
});
