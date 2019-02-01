import { Pipe, PipeTransform } from '@angular/core';
/*
 * Formats the value as a percentage depending on the key
*/
@Pipe({name: 'customPercent'})
export class CustomPercentPipe implements PipeTransform {
  transform(value: number, key: string): string {
    if (key == 'Potency' || key == 'Tenacity' || key == 'Armor' || key == 'Resistance' || key == 'Physical Critical Chance' || key == 'Critical Damage' || key == 'Special Critical Chance' || key == 'Health Steal' || key == 'Critical Chance' || key == 'Protection Pct' || key == 'Accuracy' || key == 'Offense Pct' || key == 'Defense Pct' || key == 'Health Pct' )
      return value.toString() + '%';
    else
      return value.toString();
  }
}
