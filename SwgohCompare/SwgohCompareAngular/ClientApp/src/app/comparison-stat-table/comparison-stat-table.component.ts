import { Component, OnInit, Input, Inject } from '@angular/core';
import { RosterModel } from '../model/RosterModel';

@Component({
  selector: 'app-comparison-stat-table',
  templateUrl: './comparison-stat-table.component.html',
  styleUrls: ['./comparison-stat-table.component.css']
})
export class ComparisonStatTableComponent implements OnInit {


  @Input('unitdata') unitDataInput: RosterModel.UnitData[];
  objectKeys = Object.keys;
  mapper: mapStatLookup[];
  players: string[];

  columnsToDisplay = ['statName', 'statValueP1', 'statValueP2'];

  constructor() {
    this.mapper = [];
    this.players = [];
  }

  ngOnInit() {
    
  }

  public isAPercentage(key: string) {
    if (key == 'Potency' || key == 'Tenacity' || key == 'Armor' || key == 'Resistance' || key == 'Physical Critical Chance' || key == 'Critical Damage' || key == 'Special Critical Chance')
      return true;
    else
      return false;
  }

  public isGreater(currentItem: number, otherItem: number) {
    if (currentItem > otherItem) {
      return true;
    }
  }

  public getLookupsForComparison() {
    this.mapper = [];
    for (let item of this.unitDataInput) {
      for (let key of this.objectKeys(item.stats.final)) {
        var found = this.mapper.find(function(element) {
          return element.statName == key;
        });
        if (found) {
          found.statValueP2 = item.stats.final[key];

          if (!this.players[1])
            this.players[1] = item.unit.player;
        }
        else {
          if (!this.players[0])
            this.players[0] = item.unit.player;

          this.mapper.push(new mapStatLookup(key, item.stats.final[key], null));
        }
      }
    }
    return this.mapper;
  }
}
export class mapStatLookup {
  constructor(public statName: string, public statValueP1: number, public statValueP2: number) { };
}

