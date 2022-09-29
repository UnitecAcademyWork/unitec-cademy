import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishHorarioComponent } from './english-horario.component';

describe('EnglishHorarioComponent', () => {
  let component: EnglishHorarioComponent;
  let fixture: ComponentFixture<EnglishHorarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishHorarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
