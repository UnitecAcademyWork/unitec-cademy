import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuverComponent } from './recuver.component';

describe('RecuverComponent', () => {
  let component: RecuverComponent;
  let fixture: ComponentFixture<RecuverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecuverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
