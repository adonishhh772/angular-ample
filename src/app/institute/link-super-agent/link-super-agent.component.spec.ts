import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSuperAgentComponent } from './link-super-agent.component';

describe('LinkSuperAgentComponent', () => {
  let component: LinkSuperAgentComponent;
  let fixture: ComponentFixture<LinkSuperAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkSuperAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkSuperAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
