import { PurchaseList } from '../../objects/list';
import { ListProvider } from '../../providers/list-provider';
import { Purchase } from '../../objects/purchase';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the PurchaseCreation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-purchase-creation',
  templateUrl: 'purchase-creation.html'
})
export class PurchaseCreationPage {

  list:PurchaseList;
  purchase:Purchase = {title:'',amount:0}

  constructor(public navCtrl: NavController, public navParams: NavParams, public listProvider: ListProvider, private viewCtrl: ViewController) {
     this.list = this.navParams.get('selectedList');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PurchaseCreationPage');
  }

  save() {
    this.listProvider.addPurchase(this.list, this.purchase);
    this.viewCtrl.dismiss();
  }

}
