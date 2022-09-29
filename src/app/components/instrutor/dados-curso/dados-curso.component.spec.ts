import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosCursoComponent } from './dados-curso.component';

describe('DadosCursoComponent', () => {
  let component: DadosCursoComponent;
  let fixture: ComponentFixture<DadosCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DadosCursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
