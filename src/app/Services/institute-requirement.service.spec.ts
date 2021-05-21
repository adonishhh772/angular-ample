import { TestBed } from '@angular/core/testing';

import { InstituteRequirementService } from './institute-requirement.service';

describe('InstituteRequirementService', () => {
  let service: InstituteRequirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstituteRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
