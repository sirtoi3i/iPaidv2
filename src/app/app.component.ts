import { LoginPage } from '../pages/login/login';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import {ListsPage} from '../pages/lists/lists';
import {ListDetailsPage} from '../pages/list-details/list-details';
import {ListCreationPage} from '../pages/list-creation/list-creation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = ListsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
