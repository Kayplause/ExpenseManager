import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTabsComponent } from './manage-tabs.component';

describe('ManageTabsComponent', () => {
  let component: ManageTabsComponent;
  let fixture: ComponentFixture<ManageTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
