import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ALERT_MESSAGES } from './constants/messages';
import { formatDatetime } from './functions/date';
import { MemberAttendance } from './interfaces/member-attendance.interface';
import { Member } from './interfaces/member.interface';
import { MemberService } from './services/member.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  form: FormGroup;
  disabledSubmitButton: true;
  searchResult: Member[] = [];
  noResultsFound: boolean = false;
  dataList: Member[] = [];

  showSuccessAlert: boolean = false;
  successMessage: string = ALERT_MESSAGES.success;
  
  showErrorAlert: boolean = false;
  errorMessage: string = ALERT_MESSAGES.error;

  showLowTemperatureAlert: boolean = false;
  lowTemperatureErrorMessage: string = ALERT_MESSAGES.lowTemperature;

  showHighTemperatureAlert: boolean = false;
  highTemperatureErrorMessage: string = ALERT_MESSAGES.highTemperature;



  get member() { return this.form.get('member'); }
  get dni() { return this.form.get('dni'); }
  get temperature() { return this.form.get('temperature'); }

  constructor(private fb: FormBuilder,
    private memberService: MemberService) { }

  ngOnInit() {
    this.initForm();
    this.getData();
    this.onSearch();
    this.onTemperatureChange();
  }

  initForm() {
    this.form = this.fb.group({
      member: ['', Validators.required],
      dni: ['', Validators.required],
      temperature: ['', [Validators.required, Validators.pattern(/^\d+([.]\d)?$/), Validators.min(34), Validators.max(37.6)]]
    });
    this.form.disable();
  }

  resetForm() {
    this.member.patchValue('');
    this.dni.patchValue('');
    this.temperature.patchValue('');
  }

  getData() {
    this.memberService
      .getAllMembers()
      .subscribe(data => {
        this.dataList = data;
        this.form.enable();
      });
  }

  onSearch() {
    this.member.valueChanges.subscribe((data: string) => {
      this.dni.patchValue('')
      if (data === '' || data.length < 3) {
        return this.searchResult = [];
      }
      this.searchResult = this.dataList.filter((filteredData) => {
        return filteredData.name.toLowerCase().includes(data.toLowerCase());
      });
      this.searchResult.length == 0 ? this.noResultsFound = true : this.noResultsFound = false;
    });
  }

  onOptionSelected(option: Member) {
    this.member.patchValue(option.name);
    this.dni.patchValue(option.dni)
    this.searchResult = [];
  }

  onTemperatureChange() {
    this.temperature
      .valueChanges
      .subscribe(() => {
        if (this.temperature.errors && this.temperature.errors.min) {
          this.showLowTemperatureAlert = true;
          this.showHighTemperatureAlert = false;
        } else if (this.temperature.errors && this.temperature.errors.max) {
          this.showHighTemperatureAlert = true;
          this.showLowTemperatureAlert = false;
        } else {
          this.showLowTemperatureAlert = false;
          this.showHighTemperatureAlert = false;
        }
      });
  }

  onSubmit() {
    const body: MemberAttendance = {
      date: formatDatetime(new Date()),
      name: this.member.value,
      dni: this.dni.value,
      temperature: parseFloat(this.temperature.value)
    }
    this.memberService.addPerson(body).subscribe((response) => {
      if (response.ok) {
        this.showSuccessAlert = true;
        this.dismissSuccessAlert();
      } 
      else {
        this.showErrorAlert = true;
        this.dismissErrorAlert();
      }
    });
    this.resetForm();
  }

  private dismissErrorAlert() {
    setTimeout(() => {
      this.showErrorAlert = false;
    }, 2000);
  }

  private dismissSuccessAlert() {
    setTimeout(() => {
      this.showSuccessAlert = false;
    }, 2000);
  }
}
