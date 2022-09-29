import { ModalModule } from './_modal/modal.module';
import { MaterialModule } from './material-module';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavigationDirective } from './_directive/navigation.directive';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { ListarCursosComponent } from './components/cursos/listar-cursos/listar-cursos.component';
import { CursoComponent } from './components/cursos/curso/curso.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UserComponent } from './components/user/user.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { UserCursoComponent } from './components/user/user-curso/user-curso.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PaymentComponent } from './components/payment/payment.component';
import { BusinessComponent } from './components/business/business.component';
import { EnglishComponent } from './components/english/english.component';
import { InstrutorComponent } from './components/instrutor/instrutor.component';
import { DadosPessoaisComponent } from './components/instrutor/dados-pessoais/dados-pessoais.component';
import { DadosCursoComponent } from './components/instrutor/dados-curso/dados-curso.component';
import { EnglishHorarioComponent } from './components/english-horario/english-horario.component';
import { RecuverComponent } from './components/recuver/recuver.component';
import { PassswordComponent } from './components/passsword/passsword.component';
import { ConviteComponent } from './components/user/convite/convite.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { GoogleAnalyticsService } from './_services/google-analytics.service';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BookingComponent } from './components/booking/booking.component';
import { AgendaComponent } from './components/user/agenda/agenda.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NavigationDirective,
    HomeComponent,
    FooterComponent,
    CursosComponent,
    ListarCursosComponent,
    CursoComponent,
    LoginComponent,
    SignUpComponent,
    UserComponent,
    ProfileComponent,
    UserCursoComponent,
    ContactoComponent,
    PaymentComponent,
    BusinessComponent,
    EnglishComponent,
    InstrutorComponent,
    DadosPessoaisComponent,
    DadosCursoComponent,
    EnglishHorarioComponent,
    RecuverComponent,
    PassswordComponent,
    ConviteComponent,
    ChangePasswordComponent,
    BookingComponent,
    AgendaComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    ModalModule,
    SlickCarouselModule,

    // NgxMaterialTimepickerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    GoogleAnalyticsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
