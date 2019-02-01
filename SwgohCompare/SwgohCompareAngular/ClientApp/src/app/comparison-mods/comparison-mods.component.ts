import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { RosterModel } from '../model/RosterModel';
import { MatTableDataSource } from '@angular/material';
import { CommonService } from '../providers/common.service';
import * as modEnums from '../../assets/mod-enums.json';

@Component({
  selector: 'app-comparison-mods',
  templateUrl: './comparison-mods.component.html',
  styleUrls: ['./comparison-mods.component.css']
})
export class ComparisonModsComponent implements OnInit {
  @Input('roster') unitDataInput: RosterModel.Roster[];

  modDataCharOne: RosterModel.Mods[];
  modDataCharTwo: RosterModel.Mods[];
  dataSource = new MatTableDataSource();
  commonService: CommonService;
  charModReturn: ModLookup[];
  

  columnsToDisplay = ['primary','secondary','level','tier','slot','set','pips'];
  constructor(_commonService: CommonService) {
    this.commonService = _commonService;
    this.charModReturn = [];
  }

  ngOnInit() {
    
  }

  ngOnChanges() {
    if (this.unitDataInput) {
      this.charModReturn = new Array(new ModLookup(this.unitDataInput[0].mods, this.unitDataInput[0].playerName), new ModLookup(this.unitDataInput[1].mods, this.unitDataInput[1].playerName));
    }
  }
  private isAPercentage(item: string) {
    if (this.commonService.isAPercentage(item))
      return "percent"
    else
      return "";
  }
  public enumerateModAttributes(item: string) {
    if (modEnums.default[item])
      return modEnums.default[item];
    else
      return "";
  }

  public getTier(tier: number) {
    switch (tier.toString()) {
      case "1":
        return "E";
      case "2":
        return "D";
      case "3":
        return "C";
      case "4":
        return "B";
      case "5":
        return "A";
      case "6":
        return "E";

    }
  }
}

export class ModLookup {
  constructor(public playerMods: RosterModel.Mods[], public playerName: string) { };
}
