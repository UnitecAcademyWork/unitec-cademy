import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ContactoService } from './../../_services/contacto.service';
import { Business } from './../../_models/user/business';
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
})
export class BusinessComponent implements OnInit, OnDestroy {
  businessForm: FormGroup;
  submitted = false;
  business = new Business();
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private contactoServico: ContactoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.businessForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      empresa: ['', Validators.required],
      mensagem: ['', Validators.required],
    });
  }

  ngOnDestroy(){
    if(this.subscription)
    this.subscription.unsubscribe();
  }

  get f() {
    return this.businessForm.controls;
  }

  onSubmit() {
    if (this.businessForm.valid) {
      this.submitted = true;
      this.business.email = this.f.email.value;
      this.business.empresa = this.f.empresa.value;
      this.business.mensagem = this.f.empresa.value;
      this.business.nome = this.f.nome.value;
      this.business.telefone = this.f.telefone.value;

      this.subscription = this.contactoServico
        .sendBusiness(this.business)
        .subscribe({
          next: (data) => {
            this.submitted = false;
            this.businessForm.reset();
            this.toastr.success('email enviado com sucesso');
          },
          error: (error) => {
            this.toastr.error('Ocorreu um erro');
            this.submitted = false;
          },
        });
    }
  }
}
