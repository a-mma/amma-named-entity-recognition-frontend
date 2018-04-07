import { Component, OnInit, ViewChild } from '@angular/core';
import { TrainingData } from '../shared/models/training-data.model';
import { Entity } from '../shared/models/entity.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingDataService } from '../shared/services/training-data.service';
import { MatTableDataSource, MatSort, MatTableModule } from '@angular/material';
declare var swal: any;
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
  displayedColumns = ['value', 'entity'];
  dataSource = new MatTableDataSource(this.entities);

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
  }

  constructor(private formBuilder: FormBuilder, private trainingDataService: TrainingDataService) { this.createForm(); }

  ngOnInit() {

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
      let entity = new Entity();
      entity.start = this.selectionStart;
      entity.end = this.selectionEnd;
      entity.value = this.trainingDataForm.value.value;
      entity.entity = this.trainingDataForm.value.entity;
      this.entities.push(entity);
      console.log('et', this.entities);
      this.dataSource = new MatTableDataSource(this.entities);
      this.dataSource.sort = this.sort;
      this.resetForm();
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
    this.trainingData = new TrainingData();
  }
  resetForm() {
    this.trainingDataForm.reset({
      selectedText: '',
      entity: 'Person',
      value: ''
    });
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
    })
  }
  submitData() {
    this.trainingData.text = this.value;
    this.trainingData.entities = this.entities;
    if (this.trainingData.entities.length !== 0 && this.trainingData.text !== '') {
      swal('Great', 'Your valuable contribution is added', 'success');
      console.log('data', this.trainingData);
      this.trainingDataService.submitTrainingData(this.trainingData).subscribe(
        response => {
          console.log('response', response);
          this.clearValue();
        },
        error => {

        }
      );
    }
  }
}

export interface Entity {
  start: number;
  end: number;
  value: string;
  entity: string;
}


