import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  title: string = '';
  submitTxt: string = '';
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<User>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const { id } = this.data;
    this.title = id ? `Update user "${this.data.name}"` : 'Create user';
    this.submitTxt = id ? 'Update' : 'Create';

    this.createFormGroup();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  private createFormGroup(): void {
    const { name = '', email = '', id } = this.data;

    this.form = this.fb.group({
      name: [name, [Validators.required]],
      email: [email, [Validators.required, Validators.email]],
    });

    if (!id) {
      const pattern = /(?=^.{5,32}$)(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%*()_+^&]*$/;
      this.form.addControl('pass', new FormControl(
        '', 
        [
          Validators.required, 
          Validators.minLength(5), 
          Validators.pattern(pattern)
        ]
      ));
    }
  }
}
