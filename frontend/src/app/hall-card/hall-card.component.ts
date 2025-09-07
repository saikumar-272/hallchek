import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CaseConvertPipe } from '../case-convert.pipe';

import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
  MatCardHeader,
} from '@angular/material/card';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { UserData } from '../user.mode';

@Component({
  selector: 'app-hall-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    NgForOf,
    NgFor,
    CaseConvertPipe,
  ],
  templateUrl: './hall-card.component.html',
  styleUrl: './hall-card.component.css',
})
export class HallCardComponent {
  @Input() HallData: UserData[] = [];
  @Output() select = new EventEmitter();

  login(event: unknown) {
    this.select.emit(event);
  }
}
