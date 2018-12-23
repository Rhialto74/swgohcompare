import { Component, OnInit, Input } from '@angular/core';
import { RosterModel } from '../model/RosterModel';

@Component({
  selector: 'app-comparison-table',
  templateUrl: './comparison-table.component.html',
  styleUrls: ['./comparison-table.component.css']
})
export class ComparisonTableComponent implements OnInit {
  @Input('roster') rosterDisplay: RosterModel.Roster;
  columnsToDisplay = ['nameKey', 'rarity', 'level', 'gear', 'skills'];
  constructor() { }
  
  ngOnInit() {
  }

}
