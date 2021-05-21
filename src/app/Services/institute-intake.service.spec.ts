import { TestBed } from '@angular/core/testing';

import { InstituteIntakeService } from './institute-intake.service';

describe('InstituteIntakeService', () => {
  let service: InstituteIntakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstituteIntakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
