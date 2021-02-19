import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { LoaderService } from '../services/loader.service';
import { UserQuery, UsersService } from '../services/users.service';
import { UserDialogComponent } from '../dialogs/user-dialog/user-dialog.component';

export interface User {
  id: number;
  name: string;
  email: string;
  pass?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'actions'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource([]);

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private us: UsersService,
    private ls: LoaderService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(query?: UserQuery): void {
    this.ls.loaderOn();
    this.us.fetchUsers(query)
      .pipe(take(1))
      .subscribe((data) => {
        this.setDataSource(data);
        this.ls.loaderOff();
      });
  }

  onSortData(data) {
    const { active, direction } = data;
    if (active && direction !== '') {
      this.getUsers({ sortBy: active, direction });
    }
  }

  onClickDelete(user: User): void {
    this.ls.loaderOn();
    this.us.removeUser(user.id)
      .pipe(take(1))
      .subscribe((data) => {
        if (data.result) {
          const arr = [...this.dataSource.data];
          this.dataSource.data = arr.filter(u => +u.id !== data.id);
        }
        this.ls.loaderOff();
      });
  }

  openDialog(user?: User) {
    const dRef = this.dialog.open(UserDialogComponent, {
      data: user || { name: '', email: '' }
    });

    dRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.ls.loaderOn();

        try {
          if (user && user.id) {
            const data = await this.us.updateUser(user.id, result).toPromise();
            const arr = [...this.dataSource.data];
            const idx = arr.findIndex(u => u.id === user.id);
    
            if (~idx) {
              arr[idx] = data;
              this.dataSource.data = arr;
            }
          } else {
            const data = await this.us.createUser(result).toPromise();
            const arr = [...this.dataSource.data];
            arr.push(data);
            this.dataSource.data = arr;
          }
        } catch (err) { 
          alert(err); 
        } finally {
          this.ls.loaderOff();
        }
      }
    });
  }

  private setDataSource(data: User[]): void {
    this.dataSource.data = data;
  }
}
