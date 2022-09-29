import { GoogleAnalyticsService } from './../../../_services/google-analytics.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder } from '@angular/forms';

import { CursosService } from 'src/app/_services/cursos.service';
import { Curso } from 'src/app/_models/user/curso';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-listar-cursos',
  templateUrl: './listar-cursos.component.html',
  styleUrls: ['./listar-cursos.component.scss'],
})
export class ListarCursosComponent implements OnInit, OnDestroy {
  cursos: any;
  cursos_on: any;
  cursos_pre: any;
  cursos_ins: any;

  curso: any;
  loading: boolean = true;
  nomeCurso = '';
  categoria = ['todos'];
  searchForm: FormGroup;
  result: any;

  enumList = [
    'Todos Cursos',
    'Cursos Online',
    'Cursos Presenciais',
    'Cursos Técnicos',
  ];
  selected: any;

  private subscription: Subscription[] = [];

  constructor(
    private cursosService: CursosService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.selected = this.enumList[0];

    this.searchForm = this.formBuilder.group({
      search: '',
    });
    window.scroll(0, 0);
    this.listarCategoria();

    if (this.route.snapshot.queryParams['pesquisar']) {
      this.subscription.push(
        this.route.queryParams.subscribe((params) => {
          this.searchForm.setValue({ search: params.pesquisar });
          this.pesquisarCurso();
        })
      );
    } else {
      this.getAllCursos();
    }

    this.OnChanges();
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  onSelectList(item: any) {
    this.selected = item;
  }

  emitEvent(curso: Curso) {
    this.googleAnalyticsService.eventEmitter(
      'click',
      curso.nome,
      curso.tipocurso,
      'click'
    );
  }

  filterCurso(curso: Curso[]) {
    this.cursos = curso.filter((elem) => {
      if (
        elem.id !== 56 &&
        elem.id !== 57 &&
        elem.id !== 58 &&
        elem.id !== 46
      ) {
        return elem;
      }
    });
    this.cursos_on = this.cursos.filter((elem) => {
      if (elem.tipocurso === 'online') return elem;
    });
    this.cursos_pre = this.cursos.filter((elem) => {
      if (elem.tipocurso === 'presencial') return elem;
    });
    this.cursos_ins = this.cursos.filter((elem) => {
      if (elem.tipocurso === 'técnico-presencial') return elem;
    });
  }

  getAllCursos() {
    this.subscription.push(
      this.cursosService.getCursos().subscribe({
        next: (data) => {
          this.filterCurso(data);
          this.categoria.push(this.cursos.categoria);
          // this.getVotes(this.cursos);
          // this.getVotes(this.cursos_on);
          // this.getVotes(this.cursos_pre);
          // this.getVotes(this.cursos_ins);
        },
        error: (error) =>
          this.toastr.error('Ocorreu um erro, por favor tente mais tarde!'),
        complete: () => (this.loading = false),
      })
    );
  }

  // getVotes(cursoList: any) {
  //   cursoList.forEach((item) => {
  //     const novo = {
  //       votos: 0,
  //     };
  //     Object.assign(item, novo);
  //     this.subscription.push(this.cursosService.getVotos(item.id).subscribe({
  //       next: (data) => {
  //         item.votos = data;
  //       },
  //     }));
  //   });
  // }

  filter(catg): void {
    this.loading = true;
    if (catg === 'todos') this.getAllCursos();
    else this.buscarCatg(catg);
  }

  buscarCatg(catg) {
    this.subscription.push(
      this.cursosService.getCursoCategoria(catg).subscribe((data) => {
        this.cursos = data;
        this.filterCurso(data);
        this.getImg(this.cursos);
        this.getImg(this.cursos_on);
        this.getImg(this.cursos_pre);
        this.getImg(this.cursos_ins);
        this.loading = false;
      })
    );
  }

  getImg(cursoList) {
    cursoList.forEach((item) => {
      const novo = {
        votos: 0,
        Imagens: [{ url: '' }],
      };
      Object.assign(item, novo);
      this.subscription.push(
        this.cursosService.getCurso(item.id).subscribe((data) => {
          this.curso = data;
          item.Imagens[0].url = this.curso.Imagens[0].url;
        })
      );
      // this.subscription.push(this.cursosService.getVotos(item.id).subscribe((data) => {
      //   item.votos = data;
      // }));
    });
  }

  OnChanges() {
    this.subscription.push(
      this.searchForm
        .get('search')
        .valueChanges.pipe(
          filter((data) => data.trim().length > 0),
          debounceTime(500),
          switchMap((id: string) => {
            return id
              ? this.cursosService.pesquisarCursos(id.replace(/[\s]/g, ' '))
              : of([]);
          })
        )
        .subscribe((data) => {
          this.result = data
            .map((item) => {
              return { id: item.id, nome: item.nome };
            })
            .slice(0, 3);
        })
    );
  }

  listarCategoria() {
    this.subscription.push(
      this.cursosService.getCursos().subscribe((data) => {
        this.filterCurso(data);
        this.categoria.push(this.cursos.categoria);
        this.cursos.forEach((item) => {
          let find = false;
          this.categoria.forEach((elem) => {
            if (elem === item.categoria) {
              find = true;
            }
          });
          if (!find && item.categoria) {
            this.categoria.push(item.categoria);
          }
        });
      })
    );
  }

  pesquisarCurso() {
    this.loading = true;
    this.subscription.push(
      this.cursosService
        .pesquisarCursos(this.searchForm.get('search').value)
        .subscribe({
          next: (data) => {
            this.cursos = data;
            this.filterCurso(data);
            this.getImg(this.cursos);
            this.getImg(this.cursos_on);
            this.getImg(this.cursos_pre);
            this.getImg(this.cursos_ins);
            this.loading = false;
          },
          error: (error) =>
            this.toastr.error('Ocorreu um erro, por favor tente mais tarde!'),
        })
    );
  }
}
