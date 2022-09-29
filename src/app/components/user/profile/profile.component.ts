import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserDados } from 'src/app/_models/user/user';
import { UserService } from 'src/app/_services/user.service';
import { Aluno } from 'src/app/_models/user/aluno';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { CursosService } from 'src/app/_services/cursos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  user: User;
  aluno: Aluno = new Aluno();
  file: File;
  fileUpload: boolean = false;
  submitted = false;
  isPago = false;
  isPreenchido = false;
  nomeFoto = 'Carregar foto do documento';
  profileUrl = '';
  profile: File;
  hasProfile = false;
  loadingProfile = false;
  idStatus = 'Foto do documento não submetido';
  totalCursos = 0;
  editable = false;
  primeiroNome = '';
  showPass = false;
  username = '';
  moodleUsername = '';
  moodleSenha = '';
  private subscription: Subscription[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private cursosService: CursosService
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    this.user = helper.decodeToken(
      this.authenticationService.currentUserValue.token
    );

    this.userService.getAluno(this.user.id).subscribe(data => {
      this.moodleUsername = data.AlunoMoodle.username
      this.moodleSenha = data.AlunoMoodle.senha
    });

    this.primeiroNome = this.user.nome.split(' ').shift();

    this.subscription.push(
      this.cursosService.getAlunoCurso(this.user.id).subscribe({
        next: (data) => {
          data.forEach((item) => {
            this.totalCursos++;
            if (item.estado === 'confirmado' && item.tipocurso !== 'presencial') {
              this.showPass = true;
            }
            this.cursosService
              .verificarprimeiropagmento(this.user.id, item.id_curso)
              .subscribe({
                error: (error) => {
                  this.isPago = true;
                },
              });
          });
        },
      })
    );

    this.subscription.push(
      this.userService.getAlunoFoto(this.user.id).subscribe({
        next: (data) => {
          this.profileUrl = data.url;
          if (this.profileUrl !== '') {
            this.hasProfile = true;
          }
        },
        // error: (error) =>{
        // }
      })
    );

    this.setForm();

    this.userForm = this.formBuilder.group({
      nome: [this.user.nome, Validators.required],
      apelido: [this.user.apelido, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      contacto: [this.user.contacto, Validators.required],
      datanasc: [''],
      nacionalidade: [''],
      naturalidade: [''],
      bi: [],
      localemissao: [''],
      dataemissao: [''],
      datavalidade: [''],
      nivelformacao: [''],
      imgbi: [''],
    });
    this.disableAll()
  }

  setForm() {
    this.subscription.push(
      this.userService.getUserInfo(this.user.id).subscribe({
        next: (data) => {
          this.f.datanasc.setValue(data.datanasc);
          this.f.nacionalidade.setValue(data.nacionalidade);
          this.f.naturalidade.setValue(data.naturalidade);
          this.f.bi.setValue(data.bi);
          this.f.localemissao.setValue(data.localemissao);
          this.f.dataemissao.setValue(data.dataemissao);
          this.f.datavalidade.setValue(data.datavalidade);
          this.f.nivelformacao.setValue(data.nivelformacao);
          this.fileUpload = true;
          this.idStatus = 'Submetido';

          this.disableAll();
        },
        error: () => {
          this.isPreenchido = true;
        },
      })
    );
  }

  noEdit() {
    this.setForm();
    this.disableAll();
    this.editable = false
  }

  ngOnDestroy() {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  get f() {
    return this.userForm.controls;
  }

  onUpload(event) {
    this.file = event.target.files[0];
    this.nomeFoto = this.file.name;
    this.onSubmit();
    // this.toastr.info()
  }

  onUploadProfile(event) {
    this.loadingProfile = true;

    this.profile = event.target.files[0];

    if (this.hasProfile) {
      let formData_2 = new FormData();
      formData_2.append('aluno_id', '' + this.user.id);
      formData_2.append('foto', this.profile);
      this.userService.userFoto(formData_2).subscribe({
        next: (data) => {
          this.profileUrl = data.url;
          this.loadingProfile = false;
        },
        error: () => {
          this.toastr.error('Foto de perfil não atualizada!');
          this.loadingProfile = false;
        },
      });
    } else {
      let formData_2 = new FormData();
      formData_2.append('id', '' + this.user.id);
      formData_2.append('foto', this.profile);
      this.userService.userNewFoto(formData_2).subscribe({
        next: (data) => {
          this.profileUrl = data.url;
          this.loadingProfile = false;
        },
        error: () => {
          this.toastr.error('Foto de perfil não atualizada!');
          this.loadingProfile = false;
        },
      });
    }
  }

  editContent() {
    this.editable = true
    this.enableAll()
  }

  disableAll() {
    this.f.datanasc.disable();
    this.f.nacionalidade.disable();
    this.f.naturalidade.disable();
    this.f.bi.disable();
    this.f.localemissao.disable();
    this.f.dataemissao.disable();
    this.f.datavalidade.disable();
    this.f.nivelformacao.disable();
    this.userForm.get('nome').disable();
    this.userForm.get('apelido').disable();
  }

  enableAll() {
    this.f.datanasc.enable();
    this.f.nacionalidade.enable();
    this.f.naturalidade.enable();
    this.f.bi.enable();
    this.f.localemissao.enable();
    this.f.dataemissao.enable();
    this.f.datavalidade.enable();
    this.f.nivelformacao.enable();
    this.userForm.get('nome').enable();
    this.userForm.get('apelido').enable();
  }

  onSubmit() {
    this.submitted = true;
    if (this.isPreenchido) {
      if (this.file) {
        let formData = new FormData();
        formData.append('emailaluno', this.user.email);
        formData.append('datanasc', this.f.datanasc.value);
        formData.append('nacionalidade', this.f.nacionalidade.value);
        formData.append('naturalidade', this.f.naturalidade.value);
        formData.append('bi', this.f.bi.value);
        formData.append('localemissao', this.f.localemissao.value);
        formData.append('dataemissao', this.f.dataemissao.value);
        formData.append('datavalidade', this.f.datavalidade.value);
        formData.append('nivelformacao', this.f.nivelformacao.value);
        formData.append('imgbi', this.file);

        this.userService.gravarNewInfo(formData).subscribe({
          next: () => {
            this.idStatus = 'Submetido';
            this.toastr.success('Dados gravados com sucesso!');
            this.submitted = false;
            this.isPreenchido = false;
            this.editable = false;
          },
          error: () => {
            this.toastr.error('Ocorreu um erro!');
            this.submitted = false;
          },
        });
      } else {
        this.toastr.error(
          'Por favor carregue a foto do seu documento de identificação'
        );
      }
    } else {
      let dados: UserDados = new UserDados();
      dados.email = this.user.email;
      dados.nome = this.f.nome.value;
      dados.apelido = this.f.apelido.value;
      dados.datanasc = this.f.datanasc.value;
      dados.nacionalidade = this.f.nacionalidade.value;
      dados.naturalidade = this.f.naturalidade.value;
      dados.bi = this.f.bi.value;
      dados.localemissao = this.f.localemissao.value;
      dados.dataemissao = this.f.dataemissao.value;
      dados.datavalidade = this.f.datavalidade.value;
      dados.nivelformacao = this.f.nivelformacao.value;

      this.subscription.push(
        this.userService.gravarUserInfo(dados).subscribe({
          next: (data) => {
            this.toastr.success('Dados gravados com sucesso!');
            this.submitted = false;
            this.editable = false;
          },
          error: (error) => {
            this.toastr.error('Ocorreu um erro!');
            this.submitted = false;
          },
        })
      );
    }
  }
}
