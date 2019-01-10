import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RosterModel } from '../model/RosterModel';
import { GearModel } from '../model/GearModel';


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
  allgear: GearModel.Gear[];

  gearitem: GearModel.Gear;

  charCompareOne: RosterModel.CharacterGear;
  charCompareTwo: RosterModel.CharacterGear;
  

  //Body
  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseU: string) {
    this.http = httpClient;
    this.baseUrl = baseU;
    this.allyCodeOne.setValue(362676873);
    this.allyCodeTwo.setValue(999531726);

    this.http.get<GearModel.Gear[]>(this.baseUrl + 'api/Gear/GetAllGear').subscribe(result => {
      this.allgear = result;
    }, error => console.error(error));
  }
  ngOnInit() {
    this.charCompareOne = new RosterModel.CharacterGear();
    this.charCompareTwo = new RosterModel.CharacterGear();
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
      this.populateGear();
    }, error => console.error(error));
  }

  private populateGear() {
    var count = 0;
    
    for (let rosteritem of this.roster) {
      if (count == 0) {
        for (let i = 0; i < 6; i++) {
          if (rosteritem.equipped[i]) {
            if (rosteritem.equipped[i].slot == i.toString()) {
              this.charCompareOne.gearSlots[i] = new RosterModel.GearDetails(rosteritem.equipped[i].nameKey, this.getImageUrl(rosteritem.equipped[i].equipmentId));
            }
            else {
              this.charCompareOne.gearSlots[i-1] = new RosterModel.GearDetails("Empty" + [i-1], "");
              this.charCompareOne.gearSlots[i] = new RosterModel.GearDetails(rosteritem.equipped[i].nameKey, this.getImageUrl(rosteritem.equipped[i].equipmentId));
            }
          }
          else {
            this.charCompareOne.gearSlots[i] = new RosterModel.GearDetails("Empty" + [i], "");
          }
        }
        this.roster[count].character = this.charCompareOne;
        count++;
      }
      else {
        for (let i = 0; i < 6; i++) {
          if (rosteritem.equipped[i]) {
            if (rosteritem.equipped[i].slot == i.toString()) {
              this.charCompareTwo.gearSlots[i] = new RosterModel.GearDetails(rosteritem.equipped[i].nameKey, this.getImageUrl(rosteritem.equipped[i].equipmentId));
            }
            else {
              this.charCompareTwo.gearSlots[i-1] = new RosterModel.GearDetails("Empty" + [i-1], "");
              this.charCompareOne.gearSlots[i] = new RosterModel.GearDetails(rosteritem.equipped[i].nameKey, this.getImageUrl(rosteritem.equipped[i].equipmentId));
            }
          }
          else {
            this.charCompareTwo.gearSlots[i] = new RosterModel.GearDetails("Empty" + [i], "");
          }
        }
        this.roster[count].character = this.charCompareTwo;
      }
    }
  }
  getImageUrl(gearid: string) {
    this.gearitem = this.allgear.find(function (item) {
      return item.base_id == gearid;
    });
    var lastSlash = this.gearitem.image.lastIndexOf('/') + 1;
    return "assets/images/" + this.gearitem.image.substring(lastSlash);
  }
  
}


