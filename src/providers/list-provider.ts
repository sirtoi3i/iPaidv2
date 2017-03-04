import {User} from '../objects/user';
import {Purchase} from '../objects/purchase';
import {PurchaseList} from '../objects/list';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {PouchService} from "../services/pouch.service";

/*
 Generated class for the ListProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ListProvider {

    lists: PurchaseList[] = new Array<PurchaseList>();

    constructor(public http: Http, private ps: PouchService) {
        console.log('Hello ListProvider Provider');
        this.ps.initDB();
    }

    getAllLists() {
        for (var i = 0; i < 10; i++) {
            let myPurchases = new Array<Purchase>();
            let myUsers = new Array<User>();
            for (var c = 0; c < i; c++) {
                myPurchases.push({title: 'purchase_' + c, amount: 12});
                myUsers.push({firstName: 'firstName_' + c, lastName: 'lastName_' + c});
            }
            this.lists.push({name: 'list_' + i, purchases: myPurchases, users: myUsers});
        }
        return Promise.resolve(this.lists);
    }

    addList(list: PurchaseList) {
        this.lists.push(list);
    }

    addPurchase(list: PurchaseList, purchase: Purchase) {
        list.purchases.push(purchase);
    }


}
