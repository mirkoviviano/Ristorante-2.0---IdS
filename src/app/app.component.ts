import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';

import { App, MenuController, Nav, Platform } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { ProfilePage } from '../pages/profile/profile';
import { SignupPage } from '../pages/signup/signup';
import { Events } from 'ionic-angular';
import { LogoutPage } from '../pages/logout/logout';
import { CodiceStaffPage } from '../pages/codice-staff/codice-staff';
import { AggiungiRistorantePage } from '../pages/aggiungi-ristorante/aggiungi-ristorante';
import { VisualizzaRistorantiPage } from '../pages/visualizza-ristoranti/visualizza-ristoranti';
import { VisualizzaOrdiniPage } from '../pages/visualizza-ordini/visualizza-ordini';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	pages;
	rootPage;
	profile: any;

	private app;
	private platform;
	private menu: MenuController;
 
	@ViewChild(Nav) nav: Nav;

	constructor(public events: Events, app: App, platform: Platform,
		menu: MenuController,
		private statusBar: StatusBar,
		private auth: AuthService,
		public db: AngularFirestore
	) {
		this.menu = menu;
		this.app = app;
		this.platform = platform;
		this.initializeApp();

		// set our app's pages
		this.pages = [
			{ title: 'Home', component: HomePage, },
			{ title: 'Login', component: LoginPage, },
			{ title: 'Signup', component: SignupPage, },
			{ title: 'Profile', component: ProfilePage, }
		];
		//Listener se utente è loggato o no o direttore
		events.subscribe('user:logged', () => {
			this.logged();
		});
		events.subscribe('user:notLogged', () => {
			this.notLogged();
		});
		events.subscribe('user:isDirettore', () => {
			this.isDirettore();
		});
		events.subscribe('user:isCameriere', () => {
			this.isCameriere();
		});
	}
	logged() {
		this.pages = []
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'Profilo', component: ProfilePage },
			{ title: 'Aggiungi ristorante', component: AggiungiRistorantePage },
			{ title: 'Logout', component: LogoutPage }
		];

	}
	notLogged() {
		this.pages = []
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'Login', component: LoginPage },
			{ title: 'Signup', component: SignupPage, },
		];
	}

	isDirettore() {
		this.pages = []
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'Profilo', component: ProfilePage },
			{ title: 'Codice Staff', component: CodiceStaffPage },
			{ title: 'Aggiungi ristorante', component: AggiungiRistorantePage },
			{ title: 'Visualizza ristoranti', component: VisualizzaRistorantiPage },
			{ title: 'Logout', component: LogoutPage }
		];
	}

	isCameriere(){
		this.pages = []
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'Profilo', component: ProfilePage },
			{ title: 'Visualizza ordini', component: VisualizzaOrdiniPage },
			{ title: 'Logout', component: LogoutPage }
		];
	}


	initializeApp() {
		this.auth.afAuth.authState.subscribe(data => {
			if (data && data.email && data.uid) {
				// this.profile = this.db.collection('profiles').doc(data.uid).update({
				// 	'ruolo': 'USER',
				// 	'email': data.email
				// });
				this.rootPage = HomePage;
			} else {
				this.rootPage = LoginPage;
			}
		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}
}
interface Profilo{
	fName: string; 
	lName: string;
	email: string; 
	ruolo: string; 
}