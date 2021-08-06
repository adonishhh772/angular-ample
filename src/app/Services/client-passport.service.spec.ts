import { TestBed } from '@angular/core/testing';

import { ClientPassportService } from './client-passport.service';

describe('ClientPassportService', () => {
  let service: ClientPassportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientPassportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
