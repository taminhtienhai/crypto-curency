import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionGeneratorComponent } from './transaction-generator.component';

describe('TransactionGeneratorComponent', () => {
  let component: TransactionGeneratorComponent;
  let fixture: ComponentFixture<TransactionGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
