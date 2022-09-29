import { UserService } from 'src/app/_services/user.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/_models/user/user';

import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User;
  isLogged = false;
  isLoggedIn$: Observable<boolean>;
  headerColor = '';
  imgSrc = '';
  private subscription: Subscription[] = [];
  @ViewChild('hamburger') hamburger: ElementRef;

  constructor(
    private auth: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscription.push(
      this.userService.currentClassName.subscribe(
        (data) => (this.headerColor = data)
      )
    );
    this.subscription.push(
      this.auth.isLoggedIn.subscribe((data) => (this.isLogged = data))
    );
    const helper = new JwtHelperService();
    if (this.auth.currentUserValue !== null) {
      this.user = helper.decodeToken(this.auth.currentUserValue.token);
      this.userService.getAlunoFoto(this.user.id).subscribe({
        next: (data) => {
            this.imgSrc = data.url;
        },
        error: (error) => {

        }
      });
      this.isLogged = true;
    }
  }

  ngOnDestroy() {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  toggleClass() {
    this.hamburger.nativeElement.classList.toggle('is-active');
  }

  changeHeader(className) {
    this.userService.changeClass(className);
  }
}
