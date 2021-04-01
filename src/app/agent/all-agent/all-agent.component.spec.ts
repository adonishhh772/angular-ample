import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAgentComponent } from './all-agent.component';

describe('AllAgentComponent', () => {
  let component: AllAgentComponent;
  let fixture: ComponentFixture<AllAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
