import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Instrutor } from 'src/app/_models/user/instrutor';
import { InstrutorService } from 'src/app/_services/instrutor.service';

@Component({
  selector: 'app-dados-curso',
  templateUrl: './dados-curso.component.html',
  styleUrls: ['./dados-curso.component.scss']
})
export class DadosCursoComponent implements OnInit {

  submitted = false;
  instrutorForm: FormGroup;
  dadosCurso: FormGroup;
  fileUpload: boolean = false;
  file: File;
  showOther = false;
  isLinear = true;
  instrutor: Instrutor = new Instrutor();
  private subscription: Subscription;
  private toastr: ToastrService

  constructor(private formBuilder: FormBuilder, private instrutorService: InstrutorService,private router: Router) {
    this.instrutorService.currentInstrutor.subscribe({next: (data) => {
      if(data === null){
        this.router.navigate(['/instrutor'])
      }
      else{
        this.instrutor.email = data.email
      }
    }})
  }

  ngOnInit(): void {
    this.instrutorForm = this.formBuilder.group({
      nomeCurso: ['', Validators.required],
      publico_alvo: [''],
      duracao: ['1 a 3 Semanas', Validators.required],
      categoria: ['Administração', Validators.required],
      outra: [''],
    });

    this.dadosCurso =  this.formBuilder.group({
      objectivo: [''],
      requisitos: [''],
      descricao: [''],
    })

    this.subscription = this.instrutorForm.get('categoria').valueChanges.subscribe((value) => {
      if (value === 'Outra') this.showOther = true;
      else this.showOther = false;
    });
  }

  ngOnDestroy(){
    if(this.subscription)
    this.subscription.unsubscribe();
  }

  get f() {
    return this.instrutorForm.controls;
  }

  get g() {
    return this.dadosCurso.controls;
  }

  onUpload(event) {
    this.file = event.target.files[0];
  }

  onSubmit(){
    this.submitted = true;
    if(this.f.categoria.value === 'Outra'){
      this.instrutor.categoria = this.f.outra.value;
    }
    else{
      this.instrutor.categoria = this.f.categoria.value;
    }
    this.instrutor.descricao = this.g.descricao.value;
    this.instrutor.duracao = this.f.duracao.value;
    this.instrutor.nome = this.f.nomeCurso.value;
    this.instrutor.publico_alvo = this.f.publico_alvo.value;
    this.instrutor.objectivos = this.g.objectivo.value;
    this.instrutor.requisitos = this.g.requisitos.value;
    this.instrutorService.dadosCurso(this.instrutor).subscribe({next: (data)=> this.router.navigate(['/instrutor']), error: ()=> {this.toastr.error('Ocorreu um erro'); this.submitted = false}})
  }

}
