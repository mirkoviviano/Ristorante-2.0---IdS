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
import { AngularFirestoreModule } from 'angularfire2/firestore';

// import { FirecloudService } from '../services/firecloud';
import { SignupPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';
import { LogoutPage } from '../pages/logout/logout';
import { RistorantiService } from '../services/ristoranti';
import { CodiceStaffPage } from '../pages/codice-staff/codice-staff';
import { InserisciCodiceStaffPage } from '../pages/inserisci-codice-staff/inserisci-codice-staff';
import { CreaProfiloPage } from '../pages/crea-profilo/crea-profilo';
import { AggiungiRistorantePage } from '../pages/aggiungi-ristorante/aggiungi-ristorante';
import { EffettuaOrdiniPage } from '../pages/effettua-ordini/effettua-ordini';

@NgModule({
	declarations: [
		MyApp,
		HomePage,
		LoginPage,
		SignupPage,
		ProfilePage,
		LogoutPage,
		CodiceStaffPage,
		InserisciCodiceStaffPage,
		CreaProfiloPage,
		AggiungiRistorantePage,
		EffettuaOrdiniPage
	],
	imports: [
		NgxErrorsModule,
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp),
		AgmCoreModule.forRoot(),
		AngularFireModule.initializeApp(FIREBASE_CONFIG),
		AngularFirestoreModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		HomePage,
		LoginPage,
		SignupPage,
		ProfilePage,
		LogoutPage,
		CodiceStaffPage,
		InserisciCodiceStaffPage,
		CreaProfiloPage,
		AggiungiRistorantePage,
		EffettuaOrdiniPage
	],
	providers: [
		StatusBar,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		AngularFireAuth,
		AuthService,
		RistorantiService
		// FirecloudService
	]
})
export class AppModule {
}
