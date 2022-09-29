import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models/user/user';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-instrutor',
  templateUrl: './instrutor.component.html',
  styleUrls: ['./instrutor.component.scss'],
})
export class InstrutorComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    window.scroll(0, 0);
  }

  ngOnInit(): void {
  }

}
