import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared.service';
import { routes } from '../app.routes';
import { RegisterHallComponent } from '../register-hall/register-hall.component';
import { UserData } from '../user.mode';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-home',
  imports: [RegisterHallComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private authServices = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private htttp = inject(HttpClient);
  userData = signal<UserData[]>([]);
  fetching = signal(true);
  isUpdate = signal(false);
  private router = inject(Router);
  private userService = inject(UserService);
  ngOnInit(): void {
    // const mobileNumber = this.activatedRoute.snapshot.paramMap.get('mobileNo');
    const mobileNumber = computed(() => this.authServices.isLoggedIn());
    if (mobileNumber()) {
      const data = localStorage.getItem('userData');
      if (data) {
        this.userData.set(JSON.parse(data));
        this.fetching.set(false);
      }
      // this.http
      //   .post<{ status: string; msg: string; data: UserData[] }>(
      //     'http://localhost/hallchek/backend/getUserData.php',
      //     {
      //       mobileNumber: mobileNumber,
      //     }
      //   )
      //   .subscribe((res) => {
      //     if (res.status == 'success') {
      //       console.log(res.data[0]);
      //       this.userData.set(res.data);
      //     } else {
      //       // this.userData.set('Something went wrong please try again later');
      //       // this.userData.set(res.msg);
      //     }
      //     this.fetching.set(false);
      //   });
    } else {
      alert('session expired pleae try again later');
      this.router.navigate(['/login']);
      this.fetching.set(false);
    }
  }

  isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  openUpdateModal() {
    this.isUpdate.set(true);
  }

  onCloseAddTask() {
    this.isUpdate.set(false);
  }
  openCalander() {
    this.router.navigate(['/calendar']);
  }
}
