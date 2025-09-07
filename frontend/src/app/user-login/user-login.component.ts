import { Component, inject } from '@angular/core';
import { AppServices } from '../app.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../shared.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  imports: [ReactiveFormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
})
export class UserLoginComponent {
  private appServices = inject(AppServices);
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private router = inject(Router);
  private authServices = inject(AuthService);

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
    if (this.form.valid && this.form.touched && this.form.dirty) {
      this.http
        .post<{ status: string; msg: string; user_type: string; userData: [] }>(
          'http://localhost/hallchek/backend/userLogin.php',
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
            if (res.user_type == '3') {
              this.router.navigate(['/user-home']);
            }
          } else {
            alert(res.msg);
          }
        });
    }
  }
}
