import { Component, OnInit, Input, Inject } from '@angular/core';
import { RosterModel } from '../model/RosterModel';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-comparison-table',
  templateUrl: './comparison-table.component.html',
  styleUrls: ['./comparison-table.component.css']
})
export class ComparisonTableComponent implements OnInit {
  
  @Input('roster') rosterInput: RosterModel.Roster[];
    
  columnsToDisplay = ['playerName','nameKey', 'rarity', 'level', 'gear', 'skills', 'character'];

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
  
}


