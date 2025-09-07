import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserData } from '../user.mode';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialogue/edit-dialogue.component';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements AfterViewInit, OnInit {
  public dialog = new MatDialog();
  displayedColumns: string[] = [
    'fullName',
    'mobileNumber',
    'hallname',
    'hallType',
    'hallCapacity',
    'parkingArea',
    'hallAddress',
    'pincode',
    'action',
  ];
  dataSource = new MatTableDataSource<UserData>();
  private http = inject(HttpClient);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  fetching = signal(true);

  editRow(row: UserData) {
    row.isEdit = true;
  }

  OnUpdate(row: UserData) {
    row.isEdit = false;
    console.log('Selected', row);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      panelClass: 'custom-dialog-panel',
      width: '50%',
      data: { ...row }, // Pass a copy of the row data
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.dataSource.data.findIndex(
          (item) => item.id === result.id
        );
        if (index !== -1) {
          this.dataSource.data[index] = result;
          this.dataSource.data = [...this.dataSource.data]; // refresh
        }
      }
    });
  }

  cancelEdit(row: UserData) {
    row.isEdit = false;
  }

  ngOnInit(): void {
    this.http
      .get<{ status: string; msg: string; data: UserData[] }>(
        'http://localhost/hallchek/backend/getPendingHallData.php'
      )
      .subscribe((res) => {
        if (res.status == 'empty') {
          alert('No pending Halls for registration');
        } else if (res.status == 'success') {
          console.log(res.data);
          this.dataSource.data = res.data; // ✅ just update the data
        }
        this.fetching.set(false);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
