import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';

import { App, MenuController, Nav, Platform } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth';
import { ProfilePage } from '../pages/profile/profile';
import { FirecloudService } from '../services/firecloud';

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

	constructor(app: App, platform: Platform,
		menu: MenuController,
		private statusBar: StatusBar,
		private auth: AuthService,
		private fireC: FirecloudService
	) {
		this.menu = menu;
		this.app = app;
		this.platform = platform;
		this.initializeApp();

		// set our app's pages
		this.pages = [
			{ title: 'Home', component: HomePage, icon: 'home' }
		];
	}

	initializeApp() {
		this.auth.afAuth.authState.subscribe(data => {
			if(data && data.email && data.uid){
				this.rootPage = HomePage;

				/** Wallets */

			} else {
				this.rootPage = LoginPage;
			}
		});
	}

	login() {
		this.menu.close();
		this.auth.signOut();
		this.nav.setRoot(LoginPage);
	}

	logout() {
		this.menu.close();
		this.auth.signOut();
		this.nav.setRoot(HomePage);
	}

	profile(){
		this.menu.close();
		this.nav.push(ProfilePage);
	}


	openWallet(wallet) {
		this.menu.close();
		this.nav.setRoot(HomePage, {data: wallet});
	}
}