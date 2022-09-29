import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ContactoService } from './../../_services/contacto.service';
import { Contacto } from './../../_models/user/contacto';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
})
export class ContactoComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  submitted = false;
  contacto: Contacto = new Contacto();
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private contactoService: ContactoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      emailrementente: ['', [Validators.email, Validators.required]],
      assunto: ['', Validators.required],
      mensagem: ['', Validators.required],
    });
  }

  ngOnDestroy(){
    if(this.subscription)
    this.subscription.unsubscribe();
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitted = true;
      this.contacto.mensagem = this.f.mensagem.value;
      this.contacto.assunto = this.f.assunto.value;
      this.contacto.emailrementente = this.f.emailrementente.value;

      this.subscription = this.contactoService.sendMail(this.contacto).subscribe({
        next: () => {
          this.submitted = false;
          this.contactForm.reset();
          this.toastr.success(
            'Mensagem enviada com sucesso! a nossa equipe ira contacta-lo brevemente'
          );
        },
        error: () => {
          this.toastr.error('Ocorreu um erro');
          this.submitted = false;
        }
      });
    }
  }
}
