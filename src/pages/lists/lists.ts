import { ListProvider } from '../../providers/list-provider';
import { ModalController } from 'ionic-angular/components/modal/modal';
import { User } from '../../objects/user';
import { ListDetailsPage } from '../list-details/list-details';
import { ListCreationPage } from '../list-creation/list-creation';
import { PurchaseList } from '../../objects/list';
import { Purchase } from '../../objects/purchase';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


/*
  Generated class for the Lists page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-lists',
  templateUrl: 'lists.html'
})
export class ListsPage {

  lists:PurchaseList[] = new Array<PurchaseList>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public listProvider: ListProvider) {}

  ionViewDidLoad() {
    this.listProvider.getAllLists().then((data) => {
      this.lists = data;
    });
  }

  listSelected(list:PurchaseList) {
    this.navCtrl.push(ListDetailsPage,{selectedList: list});
  }

  addList() {
     let modal = this.modalCtrl.create(ListCreationPage);
     modal.present();
  }

}
