import { GoogleAnalyticsService } from './../../_services/google-analytics.service';
// import { ModalService } from '../../_modal/modal.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import SwiperCore, { Navigation, Controller } from 'swiper';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { ComentService } from './../../_services/coment.service';
import { CursosService } from './../../_services/cursos.service';
import { Comentario } from './../../_models/user/coment';
import { Curso } from 'src/app/_models/user/curso';

// install Swiper components
SwiperCore.use([Navigation, Controller]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  cursos: any[];
  cursosN: any[];
  loading: boolean = true;
  loadingN: boolean = true;
  searchForm: FormGroup;
  coment: Comentario[];
  result: any;
  private subscription: Subscription[] = [];

  constructor(
    private cursosService: CursosService,
    private router: Router,
    private formBuilder: FormBuilder,
    private comentService: ComentService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      search: '',
    });

    setTimeout(() => {
      this.openModal('Promotion');
    }, 2000);

    this.subscription.push(
      this.cursosService.getCursos().subscribe({
        next: (data) => {
          this.cursos = data.slice(0, 8);
          this.cursosN = data.reverse().slice(0, 4);
          this.cursos.forEach((item) => {
            const novo = {
              votos: 0,
            };
            Object.assign(item, novo);
            this.subscription.push(
              this.cursosService.getVotos(item.id).subscribe((data) => {
                item.votos = data;
              })
            );
          });
        },
        error: (error) => {},
        complete: () => (this.loading = false),
      })
    );

    this.OnChanges();

    this.subscription.push(
      this.comentService
        .getComentario()
        .subscribe((data) => (this.coment = data))
    );
  }

  emitEvent(curso: Curso) {
    this.googleAnalyticsService.eventEmitter(
      'click',
      curso.nome,
      curso.tipocurso,
      'click'
    );
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  OnChanges() {
    this.subscription.push(
      this.searchForm
        .get('search')
        .valueChanges.pipe(
          filter((data) => data.trim().length > 0),
          debounceTime(500),
          switchMap((id: string) => {
            // console.log('trim', id.replace(/[\s]/g, ''));
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
            .slice(0, 5);
        })
    );
  }

  openModal(id: string) {
    // this.modalService.open(id);
  }

  closeModal(id: string) {
    // this.modalService.close(id);
  }

  pesquisarCurso(): void {
    this.router.navigate(['/cursos'], {
      queryParams: { pesquisar: '' + this.searchForm.get('search').value },
    });
  }

  slides = [{ img: '/assets/img/WEB PROMOTION.jpg' }];
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 10000,
    pauseOnFocus: false,
    pauseOnHover: false,
  };

  slideConfig2 = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 10000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  addSlide() {
    this.slides.push({ img: 'http://placehold.it/350x150/777777' });
  }
}
