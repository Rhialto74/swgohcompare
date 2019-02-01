import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  public isAPercentage(key: string) {
    if (key == 'Potency' || key == 'Tenacity' || key == 'Armor' || key == 'Resistance' || key == 'Physical Critical Chance' || key == 'Critical Damage' || key == 'Special Critical Chance' || key == 'Health Steal')
      return true;
    else
      return false;
  }
}
