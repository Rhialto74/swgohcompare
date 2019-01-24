import { Component, OnInit, Inject, isDevMode } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RosterModel } from '../model/RosterModel';
import { GearModel } from '../model/GearModel';
import { forEach } from '@angular/router/src/utils/collection';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { UnitService } from '../providers/unit.service';


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
  allyPreviousCodeOne = new FormControl();
  allyPreviousCodeTwo = new FormControl();
  
  public units: RosterModel.LocalizedUnit[];
  public roster: RosterModel.Roster[];
  public unitData: RosterModel.UnitData[];
  public tiers: RosterModel.UnitTierList[];
  filteredUnits: Observable<RosterModel.LocalizedUnit[]>;
  allgear: GearModel.Gear[];
  
  gearitem: GearModel.Gear;
  charCompare: RosterModel.CharacterGear[] = [];
  playerNames: string[];
  showProgress: boolean;
  showProgressStepThree: boolean;
  objectKeys = Object.keys;

  unitSvc: UnitService;

  //Stepper
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  matStepper: MatStepper;
  stepperIndex: number;
  objectMapper: RosterModel.MapObjectLookup[];
  players: string[];
  storedKeys: Subject<string[]>;

  //Main body
  constructor(private _formBuilder: FormBuilder, unitService: UnitService) {
    this.unitSvc = unitService;
    this.storedKeys = new Subject<string[]>();
    //if (isDevMode()) {
    //  this.allyCodeOne.setValue(362676873);
    //  this.allyCodeTwo.setValue(999531726);
    //}
    this.players = [];

    

    this.unitSvc.GetAllGear().subscribe(result => {
      this.allgear = result;
    });
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

    this.allyPreviousCodeOne.valueChanges.subscribe(val => {
      this.allyCodeOne.setValue(val);
    });

    this.allyPreviousCodeTwo.valueChanges.subscribe(val => {
      this.allyCodeTwo.setValue(val);
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
    localStorage.setItem(this.allyCodeOne.value, this.allyCodeOne.value);
    localStorage.setItem(this.allyCodeTwo.value, this.allyCodeTwo.value);
    let allyCodes: number[] = [this.allyCodeOne.value, this.allyCodeTwo.value];
    this.units = null;
    this.unitSvc.GetUnitsForDropDownList(allyCodes).subscribe(result => {
      this.showProgress = false;
      this.units = result;

      this.filteredUnits = this.compControl.valueChanges
        .pipe(
        startWith<string | RosterModel.LocalizedUnit>(''),
          map(value => typeof value === 'string' ? value : typeof value === 'undefined' ? "" : value.nameKey),
          map(nameKey => nameKey ? this._filter(nameKey) : this.units.slice())
        );

    });
  }

  //Populates the Comparison Table Data
  public getDataTables() {

    //Move us to the next step
    document.getElementById('registerNextStep').click();

    //The comparison info is the two player ally codes and the baseId of the unit selected
    let comparisonInfo: string[] = [this.allyCodeOne.value, this.allyCodeTwo.value, this.compControl.value.baseId];

    //Display the progress animation for this step
    this.showProgressStepThree = true;

    //Call the service for the data and populate the fields
    this.unitSvc.GetComparisonTableData(comparisonInfo).subscribe(result => {
      this.roster = result.rosterList;
      this.unitData = result.unitStatList;
      this.roster[0].playerName = result.playerNames[0];
      this.roster[1].playerName = result.playerNames[1];
      this.tiers = result.unitInfo;
      this.populateGear();
      this.showProgressStepThree = false;
    });
  }
  
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

  public allStorage() {
    
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
    }

    return values;
  }

  public storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch (e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0;
    }
  }
}


