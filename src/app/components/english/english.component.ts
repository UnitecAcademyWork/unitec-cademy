import { first, Subscription, take } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso } from 'src/app/_models/user/curso';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CursosService } from 'src/app/_services/cursos.service';

import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-english',
  templateUrl: './english.component.html',
  styleUrls: ['./english.component.scss'],
})
export class EnglishComponent implements OnInit, OnDestroy {
  private ingles_35: Curso;
  private curso_46: Curso;
  private curso_56: Curso;
  private curso_57: Curso;
  private curso_58: Curso;
  private mandarim_63: Curso;
  private mandarim_60: Curso;
  private mandarim_83: Curso;
  private portugues_62: Curso;
  private portugues_61: Curso;
  private portugues_109: Curso;
  private frances_64: Curso;
  private frances_59: Curso;
  private frances_82: Curso;
  private ingles_79: Curso;
  private kids_66: Curso;
  private kids_65: Curso;
  private kids_85: Curso;
  private kids_84: Curso;
  private subscription: Subscription[] = [];
  cont = 0;
  enumList = ['Inglês', 'Francês', 'Mandarim', 'Português', 'Kids (Inglês)'];
  selected: any;

  constructor(
    private userService: UserService,
    private cursosService: CursosService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selected = this.enumList[0];
    this.userService.changeClass('english');
    this.subscription.push(
      this.cursosService
        .getCurso(46)
        .pipe(take(1))
        .subscribe({ next: (data) => ((this.curso_46 = data), this.cont++) })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(35)
        .pipe(take(1))
        .subscribe({ next: (data) => ((this.ingles_35 = data), this.cont++) })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(56)
        .subscribe({ next: (data) => ((this.curso_56 = data), this.cont++) })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(57)
        .pipe(first())
        .subscribe({ next: (data) => ((this.curso_57 = data), this.cont++) })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(79)
        .pipe(first())
        .subscribe({ next: (data) => ((this.ingles_79 = data), this.cont++) })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(58)
        .pipe(first())
        .subscribe({ next: (data) => ((this.curso_58 = data), this.cont++) })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(63)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.mandarim_63 = data;
            this.cont++;
          },
        })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(60)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.mandarim_60 = data;
            this.cont++;
          },
        })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(65)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.kids_65 = data;
            this.cont++;
          },
        })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(66)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.kids_66 = data;
            this.cont++;
          },
        })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(61)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.portugues_61 = data;
            this.cont++;
          },
        })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(62)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.portugues_62 = data;
            this.cont++;
          },
        })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(64)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.frances_64 = data;
            this.cont++;
          },
        })
    );
    this.subscription.push(
      this.cursosService
        .getCurso(59)
        .pipe(first())
        .subscribe({
          next: (data) => {
            this.frances_59 = data;
            this.cont++;
          },
        })
    );

    this.cursosService
      .getCurso(84)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.kids_84 = data;
          this.cont++;
        },
      });

    this.cursosService
      .getCurso(85)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.kids_85 = data;
          this.cont++;
        },
      });

    this.cursosService
      .getCurso(109)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.portugues_109 = data;
          this.cont++;
        },
      });
    this.cursosService
      .getCurso(83)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.mandarim_83 = data;
          this.cont++;
        },
      });
    this.cursosService
      .getCurso(82)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.frances_82 = data;
          this.cont++;
        },
      });
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  matricular(curso): void {
    this.cursosService.changeCurso(curso);
    if (this.authenticationService.currentUserValue) {
      this.cursosService.changePayed(false),
        this.router.navigate(['/inscrever']);
    } else {
      this.router.navigate(['/registo']);
    }
  }

  h30_selected() {
    this.cursosService.changeCurso(this.curso_56);
    this.router.navigate(['/english-horario/pratico_I']);
  }

  h45_selected() {
    this.cursosService.changeCurso(this.curso_57);
    this.router.navigate(['/english-horario/pratico_II']);
  }

  h450_selected() {
    this.cursosService.changeCurso(this.curso_58);
    this.router.navigate(['/english-horario/pratico_II']);
  }

  matricular_h30() {
    this.cursosService.changeCurso(this.curso_56);
    if (this.authenticationService.currentUserValue) {
      this.cursosService.changePayed(false),
        this.router.navigate(['/inscrever']);
    } else {
      this.router.navigate(['/registo']);
    }
  }

  onSelect(curso: Curso) {
    this.cursosService.changeCurso(curso);
    if (this.authenticationService.currentUserValue) {
      this.cursosService.changePayed(false),
        this.router.navigate(['/inscrever']);
    } else {
      this.router.navigate(['/registo']);
    }
  }

  onSelectList(item: any) {
    this.selected = item;
  }

  // contents = ""; // model used for textarea
  // addBulletText(event) {
  //   var keycode = (event.keyCode ? event.keyCode : event.which);
  //   if (keycode == '13') {
  //     this.contents += '• '
  //   }

  //   if (this.contents.substr(this.contents.length - 1) == '\n') {
  //     this.contents = this.contents.substring(0, this.contents.length - 1);
  //   }
  // }

  // mytextOnFocus() {
  //   this.contents += '• ';
  // }
}
