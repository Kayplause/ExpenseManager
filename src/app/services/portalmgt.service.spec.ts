import { TestBed, inject } from '@angular/core/testing';

import { PortalmgtService } from './portalmgt.service';

describe('PortalmgtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortalmgtService]
    });
  });

  it('should be created', inject([PortalmgtService], (service: PortalmgtService) => {
    expect(service).toBeTruthy();
  }));
});
