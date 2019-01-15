import { Component, OnInit, Input, Inject } from '@angular/core';
import { RosterModel } from '../model/RosterModel';

@Component({
  selector: 'app-comparison-table',
  templateUrl: './comparison-table.component.html',
  styleUrls: ['./comparison-table.component.css']
})
export class ComparisonTableComponent implements OnInit {
  playerNames: string[];
  @Input('roster') rosterInput: RosterModel.Roster[];
    
  columnsToDisplay = ['playerName', 'rarity', 'level'];

  constructor() {
    
  }
  
  ngOnInit() {
  }

  sortSkills(prop: string, items: string[]) {
    const sorted = items.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
    // asc/desc
    //if (prop.charAt(0) === '-') { sorted.reverse(); }
    return sorted;
  }
  getPlayerNames(item: number) {
    if (this.rosterInput) {
      return this.rosterInput[0].playerName;
    }
  }
}


