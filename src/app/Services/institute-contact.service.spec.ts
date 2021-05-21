import { TestBed } from '@angular/core/testing';

import { InstituteContactService } from './institute-contact.service';

describe('InstituteContactService', () => {
  let service: InstituteContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstituteContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
