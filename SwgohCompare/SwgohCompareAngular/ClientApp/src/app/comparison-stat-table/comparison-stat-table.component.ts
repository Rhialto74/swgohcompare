import { Component, OnInit, Input, Inject } from '@angular/core';
import { RosterModel } from '../model/RosterModel';
import { CommonService } from '../providers/common.service';

@Component({
  selector: 'app-comparison-stat-table',
  templateUrl: './comparison-stat-table.component.html',
  styleUrls: ['./comparison-stat-table.component.css']
})
export class ComparisonStatTableComponent implements OnInit {


  @Input('unitdata') unitDataInput: RosterModel.UnitData[];
  objectKeys = Object.keys;
  mapper: mapStatLookup[];
  commonService: CommonService;
  players: string[];

  columnsToDisplay = ['statName', 'statValueP1', 'statValueP2'];

  constructor(_commonService: CommonService) {
    this.mapper = [];
    this.players = [];
    this.commonService = _commonService;
  }

  ngOnInit() {
    
  }
  ngOnChanges() {
    if (this.unitDataInput)
      this.getLookupsForComparison();
  }

  private isAPercentage(item: string) {
    return this.commonService.isAPercentage(item);
  }

  public isGreater(currentItem: number, otherItem: number) {
    if (currentItem > otherItem) {
      return true;
    }
  }

  //Parse the stats and create an array of MapStatLookups for each player
  public getLookupsForComparison() {
    this.mapper = [];
    for (let item of this.unitDataInput) {
      for (let key of this.objectKeys(item.stats.final)) {
        var found = this.mapper.find(function(element) {
          return element.statName == key;
        });
        if (found) {
          found.statValueP2 = item.stats.final[key];

          if (item.stats.mods[key])
            found.statModValueP2 = item.stats.mods[key]

          if (!this.players[1])
            this.players[1] = item.unit.player;
        }
        else {
          if (!this.players[0])
            this.players[0] = item.unit.player;

          if (item.stats.mods[key]) {
            this.mapper.push(new mapStatLookup(key, item.stats.final[key], item.stats.mods[key], null, null));
          }
          else {
            this.mapper.push(new mapStatLookup(key, item.stats.final[key], null, null, null));
          }
          
        }
      }
    }
  }
}
export class mapStatLookup {
  constructor(public statName: string, public statValueP1: number, public statModValueP1: number, public statValueP2: number, public statModValueP2: number) { };
}

