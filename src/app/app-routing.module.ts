import { AgendaComponent } from './components/user/agenda/agenda.component';
import { AuthGuard } from './_helpers/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ListarCursosComponent } from './components/cursos/listar-cursos/listar-cursos.component';
import { CursoComponent } from './components/cursos/curso/curso.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { UserCursoComponent } from './components/user/user-curso/user-curso.component';
import { UserComponent } from './components/user/user.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { BusinessComponent } from './components/business/business.component';
import { PaymentComponent } from './components/payment/payment.component';
import { EnglishComponent } from './components/english/english.component';
import { InstrutorComponent } from './components/instrutor/instrutor.component';
import { DadosPessoaisComponent } from './components/instrutor/dados-pessoais/dados-pessoais.component';
import { DadosCursoComponent } from './components/instrutor/dados-curso/dados-curso.component';
import { EnglishHorarioComponent } from './components/english-horario/english-horario.component';
import { RecuverComponent } from './components/recuver/recuver.component';
import { PassswordComponent } from './components/passsword/passsword.component';
import { ConviteComponent } from './components/user/convite/convite.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { BookingComponent } from './components/booking/booking.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inicio', component: HomeComponent },
  { path: 'cursos', component: ListarCursosComponent },
  { path: 'curso/:id', component: CursoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registo', component: SignUpComponent },
  { path: 'contacto', component: ContactoComponent },
  {
    path: 'inscrever',
    canActivate: [AuthGuard],
    component: PaymentComponent,
  },
  { path: 'unitec-business', component: BusinessComponent },
  {
    path: 'instrutor',
    component: InstrutorComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dados-pessoais' },
      { path: 'dados-pessoais', component: DadosPessoaisComponent },
      { path: 'dados-do-curso', component: DadosCursoComponent },
    ],
  },
  { path: 'language', component: EnglishComponent },
  { path: 'english-horario/:id', component: EnglishHorarioComponent },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'perfil' },
      { path: 'perfil', component: ProfileComponent },
      { path: 'meus-cursos', component: UserCursoComponent },
      { path: 'convite', component: ConviteComponent },
      { path: 'senha', component: ChangePasswordComponent },
      { path: 'agenda', component: AgendaComponent },
    ],
  },
  {
    path: 'marcar-aula',
    component: BookingComponent,
    canActivate: [AuthGuard],
  },
  { path: 'recuperar', component: RecuverComponent },
  { path: 'nova-senha/:token', component: PassswordComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
