
import { ListProvider } from '../../providers/list-provider';
import { User } from '../../objects/user';
import { Purchase } from '../../objects/purchase';
import { PurchaseList } from '../../objects/list';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the ListCreation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-creation',
  templateUrl: 'list-creation.html'
})
export class ListCreationPage {

  list:PurchaseList = {name:'',purchases: new Array<Purchase>(),users: new Array<User>()};

  constructor(public navCtrl: NavController, public navParams: NavParams, public listProvider: ListProvider, private viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListCreationPage');
  }

  save() {
     this.listProvider.addList(this.list);
     this.viewCtrl.dismiss();
  }

  addUser(name:any) {
     this.list.users.push({firstName:name,lastName:''});
  }

}
