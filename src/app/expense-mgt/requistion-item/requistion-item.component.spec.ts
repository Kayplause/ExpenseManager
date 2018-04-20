import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequistionItemComponent } from './requistion-item.component';

describe('RequistionItemComponent', () => {
  let component: RequistionItemComponent;
  let fixture: ComponentFixture<RequistionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequistionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequistionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
