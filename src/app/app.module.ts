import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule, MatToolbarModule,
  MatChipsModule, MatOptionModule, MatGridListModule,
  MatProgressBarModule, MatSliderModule, MatSlideToggleModule,
  MatMenuModule, MatDialogModule, MatSnackBarModule, MatSelectModule,
  MatInputModule, MatSidenavModule, MatCardModule, MatIconModule,
  MatRadioModule, MatProgressSpinnerModule, MatTabsModule, MatListModule, MatTableModule
} from '@angular/material';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TrainingDataService } from './services/training-data.service';
import { RecaptchaModule } from 'angular-google-recaptcha';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule,
    MatChipsModule, MatOptionModule, MatGridListModule,
    MatProgressBarModule, MatSliderModule, MatSlideToggleModule,
    MatMenuModule, MatDialogModule, MatSnackBarModule, MatSelectModule,
    MatInputModule, MatSidenavModule, MatCardModule, MatIconModule,
    MatRadioModule, MatProgressSpinnerModule, MatTabsModule, MatListModule, MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule.forRoot({
      siteKey: '6LeOPlcUAAAAAMqAJTxfqGMrkeH0SH60c5TXrWg7',
  })
  ],
  providers: [TrainingDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
