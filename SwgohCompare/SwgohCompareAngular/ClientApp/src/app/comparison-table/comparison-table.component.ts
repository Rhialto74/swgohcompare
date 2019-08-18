import { Component, OnInit, Input, Inject } from '@angular/core';
import { RosterModel } from '../model/RosterModel';
import { AbilityModel } from '../model/AbilityModel';
import { UnitService } from '../providers/unit.service';


@Component({
  selector: 'app-comparison-table',
  templateUrl: './comparison-table.component.html',
  styleUrls: ['./comparison-table.component.css']
})
export class ComparisonTableComponent implements OnInit {

  playerNames: string[];
  @Input('roster') rosterInput: RosterModel.Roster[];
  allabils: AbilityModel.Ability[];
  abilitem: AbilityModel.Ability;
  
  columnsToDisplay = ['playerName', 'rarity', 'level'];

  constructor(unitService: UnitService) {
    unitService.GetAllAbilities().subscribe(result => {
      this.allabils = result;
    });
  }
  
  ngOnInit() {
  }

  sortSkills(prop: string, items: string[]) {
    const sorted = items.sort(function (a, b) {
      //Contract always comes last and there is only one
      if (a[prop].includes("contract"))
        return 1;
      if (b[prop].includes("contract"))
        return -1;

      //Basic always comes first and there is only one
      if (a[prop].includes("basic")) {
        return -1;
      }
      if (b[prop].includes("basic")) {
        return 1;
      }

      //Order specials according to number
      if (a[prop].includes("special") && b[prop].includes("special")) {
        var firstPropNum = a[prop].slice(-2);
        var secondPropNum = b[prop].slice(-2);
        return firstPropNum > secondPropNum ? 1 : firstPropNum === secondPropNum ? 0 : -1;
      }

      //Order uniques according to number
      if (a[prop].includes("unique") && b[prop].includes("unique")) {
        var firstPropNum = a[prop].slice(-2);
        var secondPropNum = b[prop].slice(-2);
        return firstPropNum > secondPropNum ? 1 : firstPropNum === secondPropNum ? 0 : -1;
      }

      //Leader comes before uniques, but after basics and specials
      if (a[prop].includes("leader") && b[prop].includes("unique"))
        return -1;

      if (a[prop].includes("unique") && b[prop].includes("leader"))
        return 1;

      if (a[prop].includes("leader") && b[prop].includes("special"))
        return 1;

      if (a[prop].includes("special") && b[prop].includes("leader"))
        return -1;

      //Specials go before uniques
      if (a[prop].includes("special") && b[prop].includes["unique"])
        return -1;

      if (a[prop].includes("unique") && b[prop].includes["special"])
        return 1;

    });
    return sorted;
  }
  getPlayerNames(item: number) {
    if (this.rosterInput) {
      return this.rosterInput[0].playerName;
    }
  }
  //Composes the image urls for the abilities
  public getAbilityImages(abilId: string) {
    if (this.allabils) {
      this.abilitem = this.allabils.find(function (item) {
        return item.base_id == abilId;
      });
      return "assets/images/abilities/" + this.abilitem.base_id + ".png";
    }
    else {
      return "";
    }
  }

  public getAbilityType(abilId: string) {
    if (abilId.includes("basic")) {
      return "Basic"
    }
    if (abilId.includes("special")) {
      return "Special"
    }
    if (abilId.includes("unique")) {
      return "Unique"
    }
    if (abilId.includes("leader")) {
      return "Leader"
    }
    if (abilId.includes("contract")) {
      return "Contract"
    }
  }
 
}


