import { TestBed } from '@angular/core/testing';

import { AgentInstituteService } from './agent-institute.service';

describe('AgentInstituteService', () => {
  let service: AgentInstituteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentInstituteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
