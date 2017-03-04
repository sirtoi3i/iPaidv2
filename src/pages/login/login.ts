import { PouchServiceV2 } from '../../services/pouch-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  username:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public pouchService:PouchServiceV2) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
      this.pouchService.initUser(this.username);
  }

}
