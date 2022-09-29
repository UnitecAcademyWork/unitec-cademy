import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstrutorComponent } from './instrutor.component';

describe('InstrutorComponent', () => {
  let component: InstrutorComponent;
  let fixture: ComponentFixture<InstrutorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InstrutorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
