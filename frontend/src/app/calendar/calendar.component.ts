// calendar.component.ts

import { DatePipe, NgClass, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserData } from '../user.mode';
import { Router } from '@angular/router';
import { AppServices } from '../app.service';

declare global {
  interface Window {
    bootstrap: any;
  }
}

@Component({
  selector: 'app-calendar',
  imports: [FormsModule, ReactiveFormsModule, NgFor, NgClass, DatePipe],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  userData = signal<UserData[]>([]);
  calendarDays: any[] = [];
  selectedDate: Date | null = null;
  selectedSlots: any[] = [];
  totalSlots: any[] = [];
  selectedSlotId: number | null = null;
  selectedSlotStatus: 'Available' | 'Booked' | null = null;
  private http = inject(HttpClient);
  hall_id: string = '';
  private router = inject(Router);
  groupedDays: { month: string; days: any[] }[] = [];
  private appServices = inject(AppServices);
  form: FormGroup;
  custDataHide = signal(true);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      slotradio: [null],
      customerMobileNo: [null],
      customerName: [null],
      amount: [null],
      advance: [null],
      remarks: [null],
    });

    this.handleStatusChange();
    this.form
      .get('slotradio')
      ?.valueChanges.subscribe(() => this.handleStatusChange());
  }

  handleStatusChange() {
    const status = this.form.get('slotradio')?.value;
    console.log(status);
    if (status) {
      const filteredSlot = this.totalSlots.filter((s) => s.slot_id == status);
      this.selectedSlotId = status;
      this.selectedSlotStatus = filteredSlot[0].status;
    } else {
      this.selectedSlotId = null;
      this.selectedSlotStatus = null;
    }
    let mobileControl = this.form.get('customerMobileNo');
    let customerName = this.form.get('customerName');
    let amount = this.form.get('amount');
    let advance = this.form.get('advance');
    let remarks = this.form.get('remarks');
    console.log(
      this.selectedSlotStatus,
      this.selectedSlotStatus === 'Available'
    );
    if (this.selectedSlotStatus === 'Available') {
      mobileControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]);
      advance?.setValidators([Validators.required]);
      customerName?.setValidators([
        Validators.required,
        Validators.maxLength(20),
      ]);
      amount?.setValidators([Validators.required]);
      this.custDataHide.set(false);
    } else {
      mobileControl?.clearValidators();
      advance?.clearValidators();
      customerName?.clearValidators();
      amount?.clearValidators();
      this.custDataHide.set(true);
      // Not required, but if entered must be 10-digit
      // mobileControl?.setValidators([this.optionalTenDigitValidator]);
    }

    mobileControl?.updateValueAndValidity();
    console.log('value set');
  }

  // Custom validator: only validates if value exists
  optionalTenDigitValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null; // Optional
    return /^\d{10}$/.test(value) ? null : { invalidMobile: true };
  }
  ngOnInit(): void {
    const data = localStorage.getItem('userData');
    if (data) {
      this.userData.set(JSON.parse(data));
      this.hall_id = this.userData()[0].id;
    }
    if (this.hall_id) {
      this.http
        .get<{ status: string; data: {} }>(
          'http://localhost/hallchek/backend/getBokedSlotsWithHallId.php',
          { params: { hall_id: this.hall_id } }
        )
        .subscribe((res) => {
          if (res.status == 'success') {
            // alert(res.status);
            this.generateCalendarDays(res.data);
            this.groupedDays = this.groupByMonth(this.calendarDays);
            console.log(this.groupedDays);
          } else if (res.status == 'empty') {
            this.generateCalendarDays({});
            this.groupedDays = this.groupByMonth(this.calendarDays);
            console.log(this.groupedDays);
          } else {
            alert(res.status);
          }
        });
    }
  }

  groupByMonth(days: any[]) {
    const groups: { [key: string]: any[] } = {};

    days.forEach((day) => {
      const monthKey = day.date.getFullYear() + '-' + (day.date.getMonth() + 1);
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(day);
    });
    console.log(groups);
    return Object.keys(groups).map((key) => ({
      month: key,
      days: groups[key],
    }));
  }

  generateCalendarDays(data: { [key: string]: any }) {
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 5);
    console.log('sixMonthsLater:', sixMonthsLater);
    const lastDay = new Date(
      sixMonthsLater.getFullYear(),
      sixMonthsLater.getMonth() + 1,
      0
    );

    let tomorrow = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1
    );

    console.log(tomorrow);
    let current = tomorrow;
    current.setHours(0, 0, 0, 0);
    while (current <= lastDay) {
      let bookedslots: { [key: string]: any }[] = [];
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');

      const currentDate = `${year}-${month}-${day}`;

      if (currentDate in data) {
        bookedslots = data[currentDate];
        // console.log(bookedslots);
      } else {
      }

      const slots = [
        {
          slot_name: 'Morning',
          slot_id: 1,
          status: bookedslots.some((s) => s['slot_id'] == 1)
            ? 'Booked'
            : 'Available',
        },
        {
          slot_name: 'Evening',
          slot_id: 2,
          status: bookedslots.some((s) => s['slot_id'] == 2)
            ? 'Booked'
            : 'Available',
        },
      ];

      if (slots.every((s) => s.status === 'Available')) {
        var status = 'Available';
      } else if (slots.some((s) => s.status === 'Available')) {
        var status = 'Partial';
      } else {
        var status = 'Booked';
      }

      this.calendarDays.push({
        date: new Date(current),
        slots: slots,
        status: status,
      });

      current.setDate(current.getDate() + 1);
    }
    // console.log(this.calendarDays);
  }

  allowNumber(event: Event) {
    this.appServices.restrictNumeric(event);
  }
  openSlotModal(day: any) {
    this.selectedDate = day.date;
    this.totalSlots = day.slots;
    console.log(this.totalSlots);
    this.selectedSlotId = null;
    // Open Bootstrap modal
    this.form.get('slotradio')?.setValue(null);
    const modal = new window.bootstrap.Modal(
      document.getElementById('slotModal')!
    );
    console.log(modal);
    modal.show();
  }

  bookSlot() {
    console.log(this.form.value);
    console.log(this.form.valid);
    if (this.form.valid) {
      let cnf_msg = '';
      let statustoUpdate = 'booked';

      if (this.selectedSlotStatus == 'Available') {
        cnf_msg = `update as booked ${
          this.selectedSlotId == 1 ? 'Morning' : 'Evening'
        } slot on ${this.selectedDate?.toDateString()}`;
      } else {
        cnf_msg = `update as available ${
          this.selectedSlotId == 1 ? 'Morning' : 'Evening'
        } slot on ${this.selectedDate?.toDateString()}`;
        statustoUpdate = 'available';
      }

      if (confirm(cnf_msg)) {
        this.http
          .post<{
            status: string;
            msg: string;
            error: string;
          }>('http://localhost/hallchek/backend/updateSlotByHallId.php', {
            slot_id: this.selectedSlotId,
            date: `${this.selectedDate?.getFullYear()}-${
              this.selectedDate!.getMonth() + 1
            }-${this.selectedDate?.getDate()}`,
            hall_id: this.hall_id,
            statustoUpdate: statustoUpdate,
            customerData: JSON.stringify(this.form.value),
          })
          .subscribe((res) => {
            if (res.status === 'success') {
              alert(res.msg);
              const modalEl = document.getElementById('slotModal');

              let modal = window.bootstrap.Modal.getInstance(modalEl);
              modal.hide();
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(['/calendar']);
                });
            } else {
              alert(res.error);
            }
          });
      }
    } else {
      alert('Please Enter details');
    }
  }
}
