import {ListService} from '../services/list-service';
import {User} from '../objects/user';
import {Purchase} from '../objects/purchase';
import {PurchaseList} from '../objects/list';
import {Injectable, ApplicationRef} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {PouchService} from "../services/pouch.service";
import {PouchServiceV2} from "../services/pouch-service";

/*
 Generated class for the ListProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class ListProvider {

    //lists: PurchaseList[] = new Array<PurchaseList>();
    lists;


    constructor(public http: Http, private listService: ListService, private ref: ApplicationRef) {
        console.log('Hello ListProvider Provider');

    }

    getAllLists() {


        console.log('start loading lists from db...');
        this.listService.pouchService.privDBinstance.allDocs({include_docs: true}).then(
            docs => {
                this.lists = docs.rows.map(row => {
                    console.log(row.doc);
                    return {title: row.doc.listName, purchases: new Array<Purchase>(), users: new Array<User>()};
                });

            });

        this.listService.pouchService.privDBinstance.changes({live: true, since: 'now', include_docs: true})
            .on('change', this.onDatabaseChange);

        /* for (var i = 0; i < 10; i++) {
         let myPurchases = new Array<Purchase>();
         let myUsers = new Array<User>();
         for (var c = 0; c < i; c++) {
         myPurchases.push({title: 'purchase_' + c, amount: 12});
         myUsers.push({firstName: 'firstName_' + c, lastName: 'lastName_' + c});
         }
         this.lists.push({name: 'list_' + i, purchases: myPurchases, users: myUsers});
         }*/

        //this.lists.push({name: listName, purchases: new Array<Purchase>(), users: new Array<User>()});
    }

    private onDatabaseChange = (change) => {
        this.lists.push({title: change.doc.listName, purchases: new Array<Purchase>(), users: new Array<User>()});
        this.ref.tick();
    }

    addList(list: PurchaseList) {
        this.listService.createList(list);
    }

    addPurchase(list: PurchaseList, purchase: Purchase) {
        let localListDB = this.listService.getListDB(list.name);
        localListDB.post(purchase);
        //this.listService.syncListDB(list.name);
        list.purchases.push(purchase);
    }


}
