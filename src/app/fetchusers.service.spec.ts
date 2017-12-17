import { TestBed, inject } from '@angular/core/testing';

import { FetchusersService } from './fetchusers.service';

describe('FetchusersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchusersService]
    });
  });

  it('should be created', inject([FetchusersService], (service: FetchusersService) => {
    expect(service).toBeTruthy();
  }));
});
