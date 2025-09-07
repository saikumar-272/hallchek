import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { AppServices } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../user.mode';
import { ChangeDetectionStrategy } from '@angular/core';

import { filter, single, Subscription } from 'rxjs';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { CaseConvertPipe } from '../case-convert.pipe';
import { AuthService } from '../auth.service';
import { HallCardComponent } from '../hall-card/hall-card.component';
@Component({
  selector: 'app-default',
  imports: [CarouselModule, NgIf, HallCardComponent],
  templateUrl: './default.component.html',
  styleUrl: './default.component.css',
})
export class DefaultComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private appServices = inject(AppServices);
  slides = this.appServices.slides;
  fetching = signal(true);
  hallData: UserData[] = [];
  private authService = inject(AuthService);
  private routeSub!: Subscription;
  ngOnInit(): void {
    this.http
      .get<{ status: string; msg: string; data: UserData[] }>(
        'http://localhost/hallchek/backend/getActiveHallData.php'
      )
      .subscribe((res) => {
        if (res.status == 'empty') {
          alert('No Active Halls Found');
        } else if (res.status == 'success') {
          console.log(res.data);
          this.hallData = res.data;
        }
        this.fetching.set(false);
      });

    console.log(this.authService.defaultCmp());
    this.authService.OnDefaultCmp();
    console.log(this.authService.defaultCmp());
    this.routeSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('Navigated to:', event);
        this.authService.offDefaultCmp();
      });
  }

  // slides = [, ,];

  onLog() {
    this.router.navigate(['/login'], {
      queryParams: { login_type: 'partnerLogin', title: 'Partner Sign-In' },
    });
  }

  userLogin() {
    this.router.navigate(['/login'], {
      queryParams: { login_type: 'userLogin', title: 'Sign-In/Sign-Up' },
    });
  }
}
