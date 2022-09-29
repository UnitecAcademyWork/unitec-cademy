import { ToastrService } from 'ngx-toastr';
import { ContactoService } from './_services/contacto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'unitec-frontend';
  @ViewChild('contacto') contact: ElementRef<HTMLElement>;
  @ViewChild('formRef') formRef: ElementRef<HTMLElement>;
  @ViewChild(FooterComponent, { read: ElementRef })
  private footerRef: ElementRef<HTMLElement>;
  form: FormGroup;
  submitted = false;
  loading = false;
  ex = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private contactoService: ContactoService,
    private toaster: ToastrService
  ) {}

  ngOnInit() {
    this.setUpAnalytics();

    this.form = this.formBuilder.group({
      contact: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  @HostListener('window:scroll', ['$event'])
  showOff(event) {
    let contactY = this.contact.nativeElement.getBoundingClientRect().y;
    let footerY = this.footerRef.nativeElement.getBoundingClientRect().y;
    if (626 >= Math.round(footerY)) {
      this.contact.nativeElement.style.position = 'sticky';
      this.contact.nativeElement.style.left = '70%';
    }
  }

  ngAfterViewInit(): void {
    this.contactoService.exemplo().subscribe({
      next: (data) => {
        console.log(data);
        this.ex = data;
      },
    });
  }

  setUpAnalytics() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-G38FFC6G6G', {
          page_path: event.urlAfterRedirects,
        });
      });
  }

  get f() {
    return this.form.controls;
  }

  showForm() {
    this.formRef.nativeElement.style.display = 'block';
  }

  removeForm() {
    this.formRef.nativeElement.style.display = 'none';
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this.contactoService
      .help(this.f.contact.value, this.f.message.value)
      .subscribe({
        next: (data) => {
          this.submitted = false;
          this.loading = false;
          this.toaster.success('Mensagem enviada');
          this.form.reset();
        },
        error: () => {
          this.submitted = false;
          this.loading = false;
          this.toaster.info('Ocorreu um erro');
        },
      });
  }
}
