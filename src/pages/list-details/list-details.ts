import { PurchaseCreationPage } from '../purchase-creation/purchase-creation';
import { ModalController } from 'ionic-angular/components/modal/modal';
import { PurchaseList } from '../../objects/list';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the ListDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list-details',
  templateUrl: 'list-details.html'
})
export class ListDetailsPage {

  list:PurchaseList;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.list = this.navParams.get('selectedList');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListDetailsPage');
  }

  addPurchase() {
     let modal = this.modalCtrl.create(PurchaseCreationPage, {selectedList: this.list});
     modal.present();
  }

}
