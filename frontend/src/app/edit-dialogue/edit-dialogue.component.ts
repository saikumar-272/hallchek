// edit-dialog.component.ts
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './edit-dialogue.component.html',
  styleUrl: './edit-dialogue.component.css',
  // encapsulation: ViewEncapsulation.None,
})
export class EditDialogComponent {
  acceptFile!: File;
  HallImage!: File;
  private http = inject(HttpClient);
  router = inject(Router);
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  form = inject(FormBuilder).group({
    fullName: new FormControl('', { validators: [Validators.required] }),
    mobileNumber: new FormControl('', { validators: [Validators.required] }),
    hallname: new FormControl('', { validators: [Validators.required] }),
    hallType: new FormControl('', { validators: [Validators.required] }),
    hallCapacity: new FormControl('', { validators: [Validators.required] }),
    hallAddress: new FormControl('', { validators: [Validators.required] }),
    parkingArea: new FormControl('', { validators: [Validators.required] }),
    hallCategory: new FormControl('', { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    // console.log(this.data);
    this.form.patchValue({
      fullName: this.data.fullName,
      mobileNumber: this.data.mobileNumber,
      hallname: this.data.hallname,
      hallType: this.data.hallType,
      hallCapacity: this.data.hallCapacity,
      parkingArea: this.data.parkingArea,
      hallAddress: this.data.hallAddress,
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log(input.name, input.name == 'acceptFile');
    if (input.files && input.files.length > 0) {
      if (input.name == 'acceptFile') {
        this.acceptFile = input.files[0];
      } else if (input.name == 'HallImage') {
        this.HallImage = input.files[0];
      }
    }
  }

  onSave() {
    if (!this.HallImage) {
      alert('please upload hall image');
      return;
    }
    if (!this.acceptFile) {
      alert('please upload acceptance file');
      return;
    }
    console.log(this.form.valid, this.form.touched, this.form.dirty);
    this.ConsoleCheckErr();
    if (this.form.valid) {
      const formData = new FormData();
      Object.entries(this.form.value).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      formData.append('acceptFile', this.acceptFile);
      formData.append('HallImage', this.HallImage);

      console.log(formData);
      console.log(this.data);

      // Send FormData (not JSON!)
      this.http
        .post<{ msg: string; status: string }>(
          'http://localhost/hallchek/backend/registerHallTable.php',
          formData
        )
        .subscribe((res) => {
          console.log(res);
          if (res.status == 'success') {
            res.msg ? alert(res.msg) : alert('An Unknown Error Occurred');
            this.dialogRef.close();
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/main']);
              });
          } else {
            res.msg ? alert(res.msg) : alert('An Unknown Error Occurred');
          }
        });
    }
    // this.dialogRef.close(this.data); // Return updated data
  }

  onCancel() {
    this.dialogRef.close();
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
