import { AgmCoreModule } from '@agm/core';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { LoginPage } from '../pages/login/login'; 
import { AuthService } from '../services/auth';
// import { FirecloudService } from '../services/firecloud';
import { SignupPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		LoginPage,
		SignupPage,
		ProfilePage
	],
	imports: [
		NgxErrorsModule,
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp),
		AgmCoreModule.forRoot(),
		AngularFireModule.initializeApp(FIREBASE_CONFIG),
		AngularFireAuthModule
		
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		LoginPage,
		SignupPage,
		ProfilePage
	],
	providers: [
		StatusBar,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		AngularFireAuth,
		AuthService,
		// FirecloudService
	]
})
export class AppModule {
}