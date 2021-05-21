import { TestBed } from '@angular/core/testing';

import { InstituteAddressService } from './institute-address.service';

describe('InstituteAddressService', () => {
  let service: InstituteAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstituteAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
