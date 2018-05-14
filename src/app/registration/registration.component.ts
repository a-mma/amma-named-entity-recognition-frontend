import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserRegistrationService } from '../services/user-registration.service';
declare var swal: any;
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  available = false;
  hashValue = '';
  showHash = false;
  registrationForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<RegistrationComponent>,
    private fb: FormBuilder,
    private userRegistrationService: UserRegistrationService) { }

  ngOnInit() {
    this.createForm();
    this.generateHash();
  }
  createForm() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(6)]],
      hashValue: ['']
    });
  }
  checkUsernameAvailability() {
    if (this.registrationForm.valid) {
      this.userRegistrationService.isUsernameAvailable(this.registrationForm.value.username).subscribe(
        (response: any) => {
          this.available = response.exists ? false : true;
        },
        error => { }
      );
    }
  }

  addUser() {
    if (this.registrationForm.valid && this.available) {
      this.userRegistrationService.createUser(this.registrationForm.value.username, this.generateHash()).subscribe(
        response => {

          this.showHash = true;
          swal({
            title: 'Success',
            text: 'Username registered!. Please save your hash value for future use. Thanks',
            type: 'success',
            timer: 10000
          });
          this.registrationForm.reset();
        },
        error => {

        }
      );
    }
  }

  generateHash() {
    const hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    this.hashValue = hash;
    return hash;
  }

  onNoClick(): void {
    this.registrationForm.reset();
    this.showHash = false;
    this.dialogRef.close();
  }
}
