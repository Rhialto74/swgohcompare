import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
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


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ComparisonDropDownComponent,
    ComparisonTableComponent,
    ComparisonStatTableComponent,
    ComparisonModsComponent,
    CustomPercentPipe
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' }
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
