import { TestBed, inject } from '@angular/core/testing';

import { FriendgroupService } from './friendgroup.service';

describe('FriendgroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FriendgroupService]
    });
  });

  it('should be created', inject([FriendgroupService], (service: FriendgroupService) => {
    expect(service).toBeTruthy();
  }));
});
