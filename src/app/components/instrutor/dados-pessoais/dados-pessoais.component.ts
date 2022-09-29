import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { InstrutorService } from 'src/app/_services/instrutor.service';
import { Instrutor} from 'src/app/_models/user/instrutor';

@Component({
  selector: 'app-dados-pessoais',
  templateUrl: './dados-pessoais.component.html',
  styleUrls: ['./dados-pessoais.component.scss'],
})
export class DadosPessoaisComponent implements OnInit {
  instrutorForm: FormGroup;
  fileUpload: boolean = false;
  file: File;
  fileUploaded = false;
  submitted = false;
  instrutor: Instrutor;
  fileName = 'Carregar Currículo';
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private instrutorService: InstrutorService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.instrutorForm = this.formBuilder.group({
      nome: ['', Validators.required],
      apelido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contacto: ['', Validators.required],
      local: ['', Validators.required],
    });

  }

  onSubmit(): void {
    if(!this.fileUploaded){
      this.toastr.error('Por favor carregue o seu currículo')
      return
    }
    if (this.instrutorForm.valid) {
      let formData = new FormData();
      formData.append('nome', this.f.nome.value);
      formData.append('apelido', this.f.apelido.value);
      formData.append('email', this.f.email.value);
      formData.append('contacto', this.f.contacto.value);
      formData.append('local', this.f.local.value);
      formData.append('documento', this.file);
      this.submitted = true
      this.instrutor = new Instrutor()

      this.subscription = this.instrutorService
        .dadosPessoais(formData)
        .subscribe({
          next: (data) => { this.instrutor.email = data.email; this.instrutorService.changeInstrutor(this.instrutor);this.router.navigate(['/instrutor/dados-do-curso'])},
          error: (e) => {this.toastr.error('ocorreu um erro!'); this.submitted = false },
          complete: () => this.submitted = false
        });
    }
  }

  ngOnDestroy(){
    if(this.subscription)
    this.subscription.unsubscribe();
  }

  get f() {
    return this.instrutorForm.controls;
  }

  onUpload(event) {
    let fileExtension = event.target.files[0].name.replace(/^.*\./, '');
    console.log(fileExtension)
    if(fileExtension !== 'pdf' && fileExtension !== 'doc'){
      this.toastr.error('Formato do documento não suportado')
      this.toastr.error('Apenas .doc ou pdf')
      return
    }
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.fileUploaded = true;
  }
}
