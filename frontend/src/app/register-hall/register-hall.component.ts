import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
  output,
} from '@angular/core';
import { UserService } from '../shared.service';
import { UserData } from '../user.mode';
import { AppServices } from '../app.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-hall',
  imports: [ReactiveFormsModule],
  templateUrl: './register-hall.component.html',
  styleUrl: './register-hall.component.css',
})
export class RegisterHallComponent implements OnInit {
  // user = input<UserData>();
  @Input({ required: true }) user!: UserData;
  @Output() close = new EventEmitter<void>();
  private appServices = inject(AppServices);
  private http = inject(HttpClient);
  private router = inject(Router);
  acceptanceFile?: File;
  hallImageFile?: File;
  onChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.name == 'acceptance_file') {
      if (input.files && input.files.length) {
        this.acceptanceFile = input.files[0];
        console.log(this.acceptanceFile);
      }
    } else {
      if (input.files && input.files.length) {
        this.hallImageFile = input.files[0];
        console.log(this.hallImageFile);
      }
    }
  }
  form = inject(FormBuilder).group({
    fullName: new FormControl('', { validators: [Validators.required] }),
    mobileNumber: new FormControl('', { validators: [Validators.required] }),
    gender: new FormControl('', { validators: [Validators.required] }),
    hallname: new FormControl('', { validators: [Validators.required] }),
    hallType: new FormControl('', { validators: [Validators.required] }),
    hallCapacity: new FormControl('', { validators: [Validators.required] }),
    hallAddress: new FormControl('', { validators: [Validators.required] }),
    parkingArea: new FormControl('', { validators: [Validators.required] }),
    pincode: new FormControl('', { validators: [Validators.required] }),
    hallCategory: new FormControl('', { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    // console.log(this.user);
    this.form.patchValue({
      fullName: this.user.fullName,
      mobileNumber: this.user.mobileNumber,
      gender: this.user.gender,
      hallname: this.user.hallname,
      hallType: this.user.hallType,
      hallCapacity: this.user.hallCapacity,
      parkingArea: this.user.parkingArea,
      hallAddress: this.user.hallAddress,
      pincode: this.user.pincode,
    });
  }

  onSubmit() {
    console.log(this.form.valid, this.form.touched, this.form.dirty);
    // this.ConsoleCheckErr();
    if (this.form.valid && this.form.touched && this.form.dirty) {
      const formData = new FormData();

      // Add all fields from your FormGroup
      Object.entries(this.form.value).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      // Add your files
      if (this.acceptanceFile) {
        formData.append('acceptance_file', this.acceptanceFile);
      }

      if (this.hallImageFile) {
        formData.append('imageFile', this.hallImageFile);
      }

      // Send FormData (not JSON!)
      this.http
        .post<{ msg: string; status: string }>(
          'http://localhost/hallchek/backend/registerHall.php',
          formData
        )
        .subscribe((res) => {
          console.log(res);
          if (res.status == 'success') {
            res.msg ? alert(res.msg) : alert('An Unknown Error Occurred');
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/home']);
              });
          } else {
            res.msg ? alert(res.msg) : alert('An Unknown Error Occurred');
          }
        });
    }
  }
  onCancel() {
    this.close.emit();
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
