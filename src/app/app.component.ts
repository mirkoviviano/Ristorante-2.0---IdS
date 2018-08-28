import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';

import { App, MenuController, Nav, Platform } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth';

import { ProfilePage } from '../pages/profile/profile';
import { SignupPage } from '../pages/signup/signup';
import { Events } from 'ionic-angular';
import { LogoutPage } from '../pages/logout/logout';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	pages;
	rootPage;
	wallets: any;
	private app;
	private platform;
	private menu: MenuController;

	@ViewChild(Nav) nav: Nav;

	constructor(public events: Events, app: App, platform: Platform,
		menu: MenuController,
		private statusBar: StatusBar,
		private auth: AuthService,
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
		//Listener se utente è loggato o no
		events.subscribe('user:logged', () => {
			this.logged();
		});
		events.subscribe('user:notLogged', () => {
			this.notLogged();
		});
	}
	logged() {
		this.pages = []
		this.pages = [
			{ title: 'Home', component: HomePage },
			{ title: 'Logout', component: LogoutPage },

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


	initializeApp() {
		this.auth.afAuth.authState.subscribe(data => {
			if (data && data.email && data.uid) {
				this.rootPage = HomePage;

				/** Wallets */

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