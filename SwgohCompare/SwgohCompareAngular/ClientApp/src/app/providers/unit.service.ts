import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RosterModel } from '../model/RosterModel';
import { GearModel } from '../model/GearModel'
import { AbilityModel } from '../model/AbilityModel'


@Injectable({
  providedIn: 'root'
})
export class UnitService {

  http: HttpClient;
  baseUrl: string;

  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseU: string) {
    this.http = httpClient;
    this.baseUrl = baseU;
  }
  public GetUnitsForDropDownList(allyCodes: number[]): Observable<RosterModel.LocalizedUnit[]> {
    return this.http.post<RosterModel.LocalizedUnit[]>(this.baseUrl + 'api/Unit/UnitListForPlayers', allyCodes);
  }

  public GetComparisonTableData(comparisonInfo: string[]) {
    return this.http.post<RosterModel.PlayerInformation>(this.baseUrl + 'api/Unit/GetUnitInformationForPlayers', comparisonInfo)
  }
  public GetAllGear() {
    return this.http.get<GearModel.Gear[]>(this.baseUrl + 'api/Gear/GetAllGear')
  }
  public GetAllAbilities() {
    return this.http.get<AbilityModel.Ability[]>(this.baseUrl + 'api/Gear/GetAllAbilities')
  }
}
