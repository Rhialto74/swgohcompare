import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ComparisonDropDownComponent } from './comparison-drop-down/comparison-drop-down.component';
import { ComparisonTableComponent } from './comparison-table/comparison-table.component';
import { ComparisonStatTableComponent } from './comparison-stat-table/comparison-stat-table.component';
import { HttpErrorInterceptor } from './providers/http-error.interceptor';
import { ComparisonModsComponent } from './comparison-mods/comparison-mods.component';
import { CustomPercentPipe } from './providers/custompercent.pipe';
import { CreditsComponent } from './credits/credits.component';
import { ComparisonModsMobileComponent } from './comparison-mods-mobile/comparison-mods-mobile.component';
import { MonitoringErrorHandler } from './providers/error.handler';
import { MonitoringService } from './providers/monitoring.service';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ComparisonDropDownComponent,
    ComparisonTableComponent,
    ComparisonStatTableComponent,
    ComparisonModsComponent,
    CustomPercentPipe,
    CreditsComponent,
    ComparisonModsMobileComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'credits', component: CreditsComponent, pathMatch: 'full' }
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    MonitoringService,
    {
      provide: ErrorHandler,
      useClass: MonitoringErrorHandler
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
