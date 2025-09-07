import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatNativeDateModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  MatAutocompleteModule,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HallAvailabilityModel } from '../user.mode';
import { CaseConvertPipe } from '../case-convert.pipe';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-user-home',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    NgFor,
    ReactiveFormsModule,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteModule,
    AsyncPipe,
    CaseConvertPipe,
    DatePipe,
    NgClass,
    NgIf,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],

  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css',
})
export class UserHomeComponent implements OnInit {
  minDate: Date = new Date(); // today
  maxDate: Date = new Date();
  myControl = new FormControl<
    { filter_display: string; filter_value: string } | string
  >('', { validators: [Validators.required] });

  private http = inject(HttpClient);
  fetching = signal(true);
  loading = signal(false);
  gridEnable = signal(false);
  private cdr = inject(ChangeDetectorRef);
  slots = [
    { slot_id: 1, slot_name: 'Morning' },
    { slot_id: 2, slot_name: 'Evening' },
  ];
  filteredOptions!: Observable<
    { filter_display: string; filter_value: string }[]
  >;

  hallData: { filter_display: string; filter_value: string }[] = [];
  selectedDate: Date = new Date();
  form = new FormGroup({
    selectedDate: new FormControl(new Date(), {
      validators: [Validators.required],
    }),
    searchValue: this.myControl,
    slot_id: new FormControl('', { validators: [Validators.required] }),
  });

  AvailableHallData: HallAvailabilityModel[] = [];

  ngOnInit(): void {
    this.fetching.set(true);

    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 5);
    console.log('sixMonthsLater:', sixMonthsLater);
    const lastDay = new Date(
      sixMonthsLater.getFullYear(),
      sixMonthsLater.getMonth() + 1,
      0
    );
    this.maxDate = lastDay;

    this.http
      .get<{
        status: string;
        msg: string;
        data: { filter_display: string; filter_value: string }[];
      }>('http://localhost/hallchek/backend/getHallNameAddressData.php')
      .subscribe((res) => {
        if (res.status == 'empty') {
          alert('No Active Halls Found');
        } else if (res.status == 'success') {
          console.log(res.data);
          this.hallData = res.data;
        }
        this.fetching.set(false);
      });
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string'
          ? this._filter(value)
          : this._filter(value?.filter_display || '')
      )
    );
  }

  displayFn(hall: any): string {
    return hall && hall.filter_display ? hall.filter_display : '';
  }
  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.hallData.filter((option) =>
      option.filter_display.toLowerCase().includes(filterValue)
    );
  }

  Onsubmit() {
    if (this.form.valid && this.form.touched && this.form.dirty) {
      this.loading.set(true);
      // below assignment of form data to const variable will make ignore the type script restictions for clarification replace formValues vairable with this.form.value
      const formValues = this.form.value;

      // Convert selectedDate to a string if needed

      const enteredDate = formValues.selectedDate
        ? new Date(formValues.selectedDate)
        : new Date();

      const yyyy = enteredDate.getFullYear();
      const mm = String(enteredDate.getMonth() + 1).padStart(2, '0');
      const dd = String(enteredDate.getDate()).padStart(2, '0');

      const requiredDate = `${yyyy}-${mm}-${dd}`;

      // Handle hall name (searchValue) - extract the value if it's an object
      const hallName =
        typeof formValues.searchValue === 'string'
          ? formValues.searchValue
          : formValues.searchValue?.filter_display || '';
      const hallId =
        typeof formValues.searchValue != 'string'
          ? formValues.searchValue?.filter_value || ''
          : '';

      const slot_id = formValues.slot_id || '';

      const params = {
        requiredDate,
        hallId,
        slot_id,
        hallName,
      };
      // console.log(params);
      this.http
        .get<{ status: string; msg: string; data: HallAvailabilityModel[] }>(
          'http://localhost/hallchek/backend/getHallAvailabiltyBysearch.php',
          { params }
        )
        .subscribe((response) => {
          this.loading.set(false);
          this.gridEnable.set(true);
          if (response.status == 'success') {
            console.log(response.data);
            this.AvailableHallData = response.data;
            this.cdr.detectChanges(); // Only if UI is not updating
          } else if (response.status == 'empty') {
            alert('No Hall Available for Your Slot');
          } else {
            alert(response.msg);
          }
        });
    }
  }
  trackByFilterValue(index: number, item: any) {
    return item.filter_value;
  }
}
