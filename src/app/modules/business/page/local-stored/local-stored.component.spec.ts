import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalStoredComponent } from './local-stored.component';

describe('LocalStoredComponent', () => {
  let component: LocalStoredComponent;
  let fixture: ComponentFixture<LocalStoredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalStoredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalStoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
