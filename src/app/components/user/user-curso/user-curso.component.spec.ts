import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserCursoComponent } from './user-curso.component';

describe('UserCursoComponent', () => {
  let component: UserCursoComponent;
  let fixture: ComponentFixture<UserCursoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
