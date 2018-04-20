import { TestBed, inject } from '@angular/core/testing';

import { UsermgtService } from './usermgt.service';

describe('UsermgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsermgtService]
    });
  });

  it('should be created', inject([UsermgtService], (service: UsermgtService) => {
    expect(service).toBeTruthy();
  }));
});
