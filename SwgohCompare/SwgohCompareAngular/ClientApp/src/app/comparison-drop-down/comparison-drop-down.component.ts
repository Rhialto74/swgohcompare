import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RosterModel } from '../model/RosterModel';


@Component({
  selector: 'app-comparison-drop-down',
  templateUrl: './comparison-drop-down.component.html',
  styleUrls: ['./comparison-drop-down.component.css']
})
export class ComparisonDropDownComponent implements OnInit {

  //Variables
  compControl = new FormControl();
  allyCodeOne = new FormControl();
  allyCodeTwo = new FormControl();
  charDropDown = new FormControl();
  public units: RosterModel.LocalizedUnit[];
  public roster: RosterModel.Roster[];
  filteredUnits: Observable<RosterModel.LocalizedUnit[]>;
  http: HttpClient;
  baseUrl: string;
  

  //Body
  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseU: string) {
    this.http = httpClient;
    this.baseUrl = baseU;
    this.allyCodeOne.setValue(362676873);
    this.allyCodeTwo.setValue(999531726);
      
  }
  displayFn(unit?: RosterModel.LocalizedUnit): string | undefined {
    return unit ? unit.nameKey : undefined;
  }
  private _filter(value: string): RosterModel.LocalizedUnit[] {
    const filterValue = typeof value !== 'undefined' ? value.toLowerCase() : "";
    return this.units.filter(unit => unit.baseId.toLowerCase().includes(filterValue));
  }

  private getDropDownList() {
    let allyCodes: number[] = [this.allyCodeOne.value, this.allyCodeTwo.value];
    this.http.post<RosterModel.LocalizedUnit[]>(this.baseUrl + 'api/Unit/UnitListForPlayers', allyCodes).subscribe(result => {
      this.units = result;

      this.filteredUnits = this.compControl.valueChanges
        .pipe(
        startWith<string | RosterModel.LocalizedUnit>(''),
          map(value => typeof value === 'string' ? value : typeof value === 'undefined' ? "" : value.nameKey),
          map(nameKey => nameKey ? this._filter(nameKey) : this.units.slice())
        );

    }, error => console.error(error));
  }

  private getDataTables() {
    let comparisonInfo: string[] = [this.allyCodeOne.value, this.allyCodeTwo.value, this.compControl.value.baseId];
    
    this.http.post<RosterModel.Roster[]>(this.baseUrl + 'api/Unit/GetUnitInformationForPlayers', comparisonInfo).subscribe(result => {
      this.roster = result;
    }, error => console.error(error));
  }

  ngOnInit(){

  }
}


