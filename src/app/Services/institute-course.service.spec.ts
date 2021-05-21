import { TestBed } from '@angular/core/testing';

import { InstituteCourseService } from './institute-course.service';

describe('InstituteCourseService', () => {
  let service: InstituteCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstituteCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
