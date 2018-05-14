import { Component, OnInit, ViewChild } from '@angular/core';
import { TrainingData } from '../shared/models/training-data.model';
import { Entity } from '../shared/models/entity.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TrainingDataService } from '../services/training-data.service';
import { MatTableDataSource, MatSort, MatTableModule } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RegistrationComponent } from '../registration/registration.component';
import { UserRegistrationService } from '../services/user-registration.service';
declare var swal: any;
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  value = '';
  selectedText = '';
  selectionStart = 0;
  selectionEnd = 0;
  selected = 'Person';
  trainingData = new TrainingData();
  trainingDataForm: FormGroup;
  entities: Entity[];
  displayedColumns = ['value', 'entity', 'selectedText', 'start', 'end', 'no'];
  entityDataTable = [];
  dataSource = new MatTableDataSource(this.entityDataTable);
  myRecaptcha = new FormControl(false);
  highlightIndexes = [];
  currentUsername = '';
  usernameSet = false;
  yPos = 0;
  @ViewChild(MatSort) sort: MatSort;
  formErrors = {
    'selectedText': '',
    'entity': '',
    'value': ''
  };

  validationMessages = {
    'selectedText': {
      'required': 'Please select a text.',
      'minlength': 'Selected text must be at least 2 characters long.'
    },
    'entity': {
      'required': 'Please select a category.'
    },
    'value': {
      'required': 'Entity value is required.',
      'minlength': 'Entity value must be at least 2 characters long.'
    },
  };

  constructor(private formBuilder: FormBuilder, private trainingDataService: TrainingDataService, public dialog: MatDialog,
    private userRegistrationService: UserRegistrationService) { this.createForm(); }

  ngOnInit() {
    document.getElementById('text-area').addEventListener('scroll', (event: any) => {
      this.yPos = event.target.scrollTop;
    });
  }
  createForm() {
    this.trainingDataForm = this.formBuilder.group(
      {
        selectedText: ['', [Validators.required, Validators.minLength(2)]],
        entity: [this.selected, Validators.required],
        value: ['', [Validators.required, Validators.minLength(2)]],
      }
    );

    this.trainingDataForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.trainingDataForm) { return; }
    const form = this.trainingDataForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  getData(data: HTMLInputElement) {
    this.selectionStart = data.selectionStart;
    this.selectionEnd = data.selectionEnd;
    this.selectedText = data.value.substring(this.selectionStart, this.selectionEnd);
  }

  addData() {
    if (this.trainingDataForm.valid) {
      const entity = new Entity();
      const entityDataTableEntry: any = {};
      entity.start = entityDataTableEntry.start = this.selectionStart;
      entity.end = entityDataTableEntry.end = this.selectionEnd;
      entity.value = entityDataTableEntry.value = this.trainingDataForm.value.value;
      entity.entity = entityDataTableEntry.entity = this.trainingDataForm.value.entity;
      this.entities.push(entity);
      entityDataTableEntry.selectedText = this.selectedText;
      entityDataTableEntry.position = this.entityDataTable.length;

      this.entityDataTable.push(entityDataTableEntry);

      this.dataSource = new MatTableDataSource(this.entityDataTable);
      this.dataSource.sort = this.sort;
      this.setHighlight();
      this.resetForm();
      document.getElementById('text-area').scroll(0, this.yPos);
    }
  }

  resetValue(changedValue: HTMLInputElement) {
    this.value = changedValue.value;
    this.entities = [];
    this.trainingData = new TrainingData();
  }

  clearValue() {
    this.value = '';
    this.dumpData();
  }

  dumpData() {
    this.resetForm();
    this.entities = [];
    this.entityDataTable = [];
    this.trainingData = new TrainingData();
    this.highlightIndexes = [];
    this.setHighlight();
  }
  resetForm() {
    this.trainingDataForm.reset({
      selectedText: '',
      entity: 'Person',
      value: ''
    });
  }

  watch(evt: any) {

  }

  confirmSubmit() {
    swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.submitData();
      }
    });
  }

  submitData() {
    this.trainingData.uname = this.currentUsername === '' ? 'anonymous' : this.currentUsername;
    this.trainingData.text = this.value;
    this.trainingData.entities = this.entities;
    if (this.trainingData.entities.length !== 0 && this.trainingData.text !== '' && this.myRecaptcha.value === true) {

      this.trainingDataService.submitTrainingData(this.trainingData).subscribe(
        response => {
          this.clearValue();
          swal('Great', 'Your valuable contribution is added', 'success');
        },
        error => {
          swal('Oops!', 'Something went wrong', 'error');
        }
      );
    }
  }

  removeElement(index: number) {
    this.entityDataTable.splice(index, 1);
    this.entities.splice(index, 1);
    this.entityDataTable.forEach((element, arrayIndex) => {
      element.position = arrayIndex;
    });
    this.dataSource = new MatTableDataSource(this.entityDataTable);
    this.dataSource.sort = this.sort;
  }

  onScriptLoad() {

  }

  onScriptError() {

  }

  setHighlight() {
    this.entityDataTable.forEach((element) => {
      let val = [];
      val.push(element.start);
      val.push(element.end);
      this.highlightIndexes.push(val);
      val = [];
    });
    $('.highlight-text').highlightWithinTextarea({
      highlight: this.highlightIndexes
    });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(RegistrationComponent, {
      width: '50%',
      height: '40%'
    });
  }

  setUsername() {
    if (this.currentUsername !== '' && !this.usernameSet) {
      this.userRegistrationService.isUsernameAvailable(this.currentUsername).subscribe((response: any) => {
        this.currentUsername = response.exists ? this.currentUsername : '';
        if (!response.exists) {
          swal('Hmmm', 'Username not found. Please join.', 'warning');
        }
        else {
          swal('Great', 'Please proceed to tagging.', 'success');
          this.usernameSet = true;
        }
      },
        error => {

        });
    }
  }

  clearUsername() {
    this.currentUsername = '';
    this.usernameSet = false;
  }
}


export interface EntityDataTable {
  start: number;
  end: number;
  value: string;
  entity: string;
  selectedText: string;
  position: number;
}