import { Component, OnInit, Inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RosterModel } from '../model/RosterModel';
import { GearModel } from '../model/GearModel';
import { forEach } from '@angular/router/src/utils/collection';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';


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
  public unitData: RosterModel.UnitData[];
  public tiers: RosterModel.UnitTierList[];
  filteredUnits: Observable<RosterModel.LocalizedUnit[]>;
  http: HttpClient;
  baseUrl: string;
  allgear: GearModel.Gear[];
  gearitem: GearModel.Gear;
  charCompare: RosterModel.CharacterGear[] = [];
  playerNames: string[];
  showProgress: boolean;
  showProgressStepThree: boolean;
  objectKeys = Object.keys;

  //Stepper
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  matStepper: MatStepper;
  stepperIndex: number;
  objectMapper: RosterModel.MapObjectLookup[];
  players: string[];
  

  //Body
  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseU: string, private _formBuilder: FormBuilder) {
    this.http = httpClient;
    this.baseUrl = baseU;

    if (isDevMode()) {
      this.allyCodeOne.setValue(362676873);
      this.allyCodeTwo.setValue(999531726);
    }
    this.players = [];
        

    this.http.get<GearModel.Gear[]>(this.baseUrl + 'api/Gear/GetAllGear').subscribe(result => {
      this.allgear = result;
    }, error => console.error(error));
  }
  ngOnInit() {
    this.stepperIndex = 0;
    this.showProgress = false;
    this.showProgressStepThree = false;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  //Displays the name of the unit selected in the dropdown box
  displayFn(unit?: RosterModel.LocalizedUnit): string | undefined {
    return unit ? unit.nameKey : undefined;
  }

  //Filters the dropdown list
  private _filter(value: string): RosterModel.LocalizedUnit[] {
    const filterValue = typeof value !== 'undefined' ? value.toLowerCase() : "";
    return this.units.filter(unit => unit.baseId.toLowerCase().includes(filterValue));
  }

  //Populates the dropdown list
  public getDropDownList() {
    this.showProgress = true;
    let allyCodes: number[] = [this.allyCodeOne.value, this.allyCodeTwo.value];
    this.units = null;
    this.http.post<RosterModel.LocalizedUnit[]>(this.baseUrl + 'api/Unit/UnitListForPlayers', allyCodes).subscribe(result => {
      this.showProgress = false;
      this.units = result;

      this.filteredUnits = this.compControl.valueChanges
        .pipe(
        startWith<string | RosterModel.LocalizedUnit>(''),
          map(value => typeof value === 'string' ? value : typeof value === 'undefined' ? "" : value.nameKey),
          map(nameKey => nameKey ? this._filter(nameKey) : this.units.slice())
        );

    }, error => console.error(error));
  }

  //Populates the Comparison Table Data
  public getDataTables() {
    document.getElementById('registerNextStep').click();
    let comparisonInfo: string[] = [this.allyCodeOne.value, this.allyCodeTwo.value, this.compControl.value.baseId];
    this.showProgressStepThree = true;
    this.http.post<RosterModel.PlayerInformation>(this.baseUrl + 'api/Unit/GetUnitInformationForPlayers', comparisonInfo).subscribe(result => {
      this.roster = result.rosterList;
      this.unitData = result.unitStatList;
      this.roster[0].playerName = result.playerNames[0];
      this.roster[1].playerName = result.playerNames[1];
      this.tiers = result.unitInfo;
      this.populateGear();
      //this.getMainLookupsForComparison();
      this.showProgressStepThree = false;
    }, error => console.error(error));
  }


  //public getMainLookupsForComparison() {
  //  this.objectMapper = [];
  //  for (let item of this.roster) {
  //    for (let key of this.objectKeys(item)) {
  //      var found = this.objectMapper.find(function (element) {
  //        return element.statName == key;
  //      });
  //      if (found) {
  //        found.statValueP2 = item[key];
  //        if (!found.players[1])
  //          found.players[1] = item.playerName;
  //      }
  //      else {
  //        if (!this.players[0])
  //          this.players[0] = item.playerName;

  //        this.objectMapper.push(new RosterModel.MapObjectLookup(key, item[key], null, this.players));
  //      }
  //    }
  //  }
  //}

  //Determines which gear should be highlighted as equipped.
  public populateGear() {
    var count = 0;
    this.charCompare[0] = new RosterModel.CharacterGear();
    this.charCompare[1] = new RosterModel.CharacterGear();
    
    for (let rosteritem of this.roster) {
      var gearLayout = this.tiers.find(function (element) {
        return element.tier == rosteritem.gear;
      });
      for (let item of rosteritem.equipped) {
        this.charCompare[count].gearSlots[Number(item.slot)] = new RosterModel.GearDetails(item.nameKey, this.getImageUrl(item.equipmentId), Number(item.slot), true);
      }
      for (let i = 0; i < 6; i++) {
        if (!this.charCompare[count].gearSlots[i]) {
          this.charCompare[count].gearSlots[i] = new RosterModel.GearDetails(this.getImageName(gearLayout.equipmentSetList[i]), this.getImageUrl(gearLayout.equipmentSetList[i]), i, false);
        }
      }
      this.roster[count].character = this.charCompare[count];
      count++;
    }
  }

  //Composes the image urls for the gear pieces
  public getImageUrl(gearid: string) {
    this.gearitem = this.allgear.find(function (item) {
      return item.base_id == gearid;
    });
    var lastSlash = this.gearitem.image.lastIndexOf('/') + 1;
    return "assets/images/" + this.gearitem.image.substring(lastSlash);
  }

  //Extracts the image name from the list
  public getImageName(gearid: string) {
    this.gearitem = this.allgear.find(function (item) {
      return item.base_id == gearid;
    });
    return this.gearitem.name;
  }

  public setCompControlValue() {
    this.compControl.setValue('');
  }
}


