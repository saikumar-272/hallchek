import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppServices } from '../app.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CaseConvertPipe } from '../case-convert.pipe';

function equalValues(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmpassword = control.get('confirmpassword')?.value;
  if (password == confirmpassword) {
    return null;
  }
  return { passwordsNotEqual: true };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, CaseConvertPipe],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  // constructor(private http: HttpClient) {}   ********** constuctor method
  private http = inject(HttpClient);
  private appServices = inject(AppServices);
  private router = inject(Router);
  state_store: { state_code: string; state_name: string }[] = [];
  district_store: { district_code: string; district_name: string }[] = [];
  mandal_store: { mandal_code: string; mandal_name: string }[] = [];

  form = new FormGroup({
    fullName: new FormControl('', {
      validators: [Validators.required],
    }),
    mobileNumber: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
      ],
    }),
    gender: new FormControl<'male' | 'female' | 'trans'>('male', {
      validators: [Validators.required],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [
            Validators.required,
            Validators.maxLength(20),
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
            ),
          ],
        }),
        confirmpassword: new FormControl('', {
          validators: [
            Validators.required,
            Validators.maxLength(20),
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
            ),
          ],
        }),
      },
      { validators: [equalValues] }
    ),
    hallname: new FormControl('', { validators: [Validators.required] }),
    hallType: new FormControl<'nonac' | 'ac'>('nonac', {
      validators: [Validators.required],
    }),
    hallCapacity: new FormControl('', { validators: [Validators.required] }),
    parkingArea: new FormControl('', { validators: [Validators.required] }),
    hallAddress: new FormControl('', { validators: [Validators.required] }),
    state: new FormControl('', { validators: [Validators.required] }),
    district: new FormControl('', { validators: [Validators.required] }),
    mandal: new FormControl('', { validators: [Validators.required] }),
    pincode: new FormControl('', { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.http
      .get<{
        msg: string;
        status: string;
        data: { state_code: string; state_name: string }[];
      }>('http://localhost/hallchek/backend/getStateData.php')
      .subscribe((res) => {
        if (res.status == 'success') {
          this.state_store = res.data;
        } else {
        }
      });
  }
  onSubmit() {
    // this.ConsoleCheckErr();
    if (this.form.valid && this.form.touched) {
      const finalObj = this.appServices.flattenObject(this.form.value);
      // console.log(finalObj);
      this.http
        .post<{ msg: string; status: string } | any>(
          'http://localhost/hallchek/backend/sign_up.php',
          finalObj
        )
        .subscribe((res) => {
          if (res.status == 'success') {
            res.msg ? alert(res.msg) : alert('An Unknown Error Occured');

            this.router.navigate(['/login']);
          } else {
            res.msg ? alert(res.msg) : alert('An Unknown Error Occured');
          }
        });
    }
  }

  loadMandal(event: any) {
    console.log(event.target.value);
    if (event.target.value) {
      this.mandal_store = [];

      this.http
        .get<{
          msg: string;
          status: string;
          data: { mandal_code: string; mandal_name: string }[];
        }>('http://localhost/hallchek/backend/getMandalData.php', {
          params: {
            district_code: event.target.value,
          },
        })
        .subscribe((res) => {
          if (res.status === 'success') {
            this.mandal_store = res.data;
          } else {
            this.mandal_store = [];
            console.error('Failed to load Mandals:', res.msg);
          }
        });
    }
  }
  loadDist(event: any) {
    console.log(event.target.value);
    if (event.target.value) {
      console.log('sfs');

      this.district_store = [];
      this.mandal_store = [];
      this.http
        .get<{
          msg: string;
          status: string;
          data: { district_code: string; district_name: string }[];
        }>('http://localhost/hallchek/backend/getDistrictData.php', {
          params: {
            state_code: event.target.value,
          },
        })
        .subscribe((res) => {
          if (res.status === 'success') {
            this.district_store = res.data;
          } else {
            this.district_store = [];
            console.error('Failed to load districts:', res.msg);
          }
        });
    }
  }

  allowNumber(event: Event) {
    this.appServices.restrictNumeric(event);
  }
  ConsoleCheckErr() {
    console.log('Form Valid:', this.form.valid);
    console.log('Form Value:', this.form.value);
    console.log('Form Errors:');
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);

      if (control instanceof FormControl) {
        console.log(`${key}:`, control.errors);
      }

      // If it's a nested FormGroup (like passwords)
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((innerKey) => {
          const innerControl = control.get(innerKey);
          console.log(`${key}.${innerKey}:`, innerControl?.errors);
        });

        // Also check group-level errors (like confirm password match)
        console.log(`${key} group errors:`, control.errors);
      }
    });
  }
}
