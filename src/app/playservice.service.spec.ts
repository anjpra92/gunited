import { TestBed, inject } from '@angular/core/testing';

import { PlayserviceService } from './playservice.service';

describe('PlayserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayserviceService]
    });
  });

  it('should be created', inject([PlayserviceService], (service: PlayserviceService) => {
    expect(service).toBeTruthy();
  }));
});
