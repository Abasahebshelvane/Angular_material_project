import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private firebase: AngularFireDatabase, private datePipe: DatePipe) { }

  employeeList: AngularFireList<any>;

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    address: new FormControl(''),
    gender: new FormControl(''),
    birthDate: new FormControl(''),
    isPermanent: new FormControl(false)
  });

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      fullName: '',
      email: '',
      address: '',
      gender: '',
      birthDate: '',
      isPermanent: false
    });
  }


  getEmployees() {
    this.employeeList = this.firebase.list('employees');
    return this.employeeList.snapshotChanges();
  }

  insertEmployee(employee) {
    this.employeeList.push({
      fullName: employee.fullName,
      email: employee.email,
      address: employee.address,
      gender: employee.gender,
      birthDate: employee.birthDate == "" ? "" : this.datePipe.transform(employee.birthDate, 'yyyy-MM-dd'),
      isPermanent: employee.isPermanent
    });
  }
 
  updateEmployee(employee) {
    this.employeeList.update(employee.$key,
      {
        fullName: employee.fullName,
        email: employee.email,
        address: employee.address,
        gender: employee.gender,
        birthDate: employee.birthDate == "" ? "" : this.datePipe.transform(employee.birthDate, 'yyyy-MM-dd'),
        isPermanent: employee.isPermanent
      });
  }

  deleteEmployee($key: string) {
    this.employeeList.remove($key);
  }
  populateForm(employee) {
    this.form.setValue(_.omit(employee,'employeeName'));
  }
}
