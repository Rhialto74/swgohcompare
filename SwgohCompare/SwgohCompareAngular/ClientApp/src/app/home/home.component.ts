import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
}

interface LocalizedUnits {
  nameKey: string;
  forceAlignment: number;
  combatType: number;
  descKey: string;
  baseId: string;
}
