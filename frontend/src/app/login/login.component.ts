import { Component, inject, OnInit, signal } from '@angular/core';
import { AppServices } from '../app.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { UserService } from '../shared.service';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private authServices = inject(AuthService);
  private appServices = inject(AppServices);
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  login_type: 'partnerLogin' | 'userLogin' = 'userLogin';
  title: string = 'Sign-In / Sign-Up';
  invaldSubmit = signal(false);
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['login_type']) {
        this.login_type = params['login_type'];
      }
      if (params['title']) {
        this.title = params['title'];
      }
    });
  }

  form = new FormGroup({
    mobileNumber: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/),
      ],
    }),
  });

  allowNumber(event: any) {
    return this.appServices.restrictNumeric(event);
  }
  onSubmit() {
    console.log(this.form.invalid, this.form.touched, this.form.dirty);
    let url = 'http://localhost/hallchek/backend/userLogin.php';

    if (this.login_type == 'partnerLogin') {
      url = 'http://localhost/hallchek/backend/login.php';
    } else {
      url = 'http://localhost/hallchek/backend/userLogin.php';
    }
    if (this.form.valid && this.form.touched && this.form.dirty) {
      this.http
        .post<{ status: string; msg: string; user_type: string; userData: [] }>(
          url,
          {
            mobileNumber: this.form.value.mobileNumber,
            password: this.form.value.password,
          }
        )
        .subscribe((res) => {
          console.log(res.userData);
          if (res.status === 'success') {
            // alert(res.msg);
            this.userService.setMobile(
              this.form.value.mobileNumber ? this.form.value.mobileNumber : ''
            );
            this.authServices.login(
              this.form.value.mobileNumber ? this.form.value.mobileNumber : '',
              res.userData
            );
            if (res.user_type == '1') {
              this.router.navigate(['/home']);
            } else if (res.user_type == '2') {
              this.router.navigate(['/main']);
            } else if (res.user_type == '3') {
              this.router.navigate(['/user-home']);
            }
          } else {
            alert(res.msg);
          }
        });
    } else {
      alert('Invalid Credentials');
    }
  }
}
