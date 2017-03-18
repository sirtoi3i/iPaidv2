import { ListService } from '../services/list-service';
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

    //lists: PurchaseList[] = new Array<PurchaseList>();
     lists;


    constructor(public http: Http, private ps: PouchService, private listService: ListService) {
        console.log('Hello ListProvider Provider');
        this.ps.initDB();
    }

    getAllLists() {

        if (!this.lists) {
            let localUserDB = this.listService.getUserDB();
            console.log('start loading lists from db...');
            localUserDB.allDocs({include_docs: true}).then(docs => {
                this.lists = docs.rows.map(row => {
                    console.log(row.doc);
                    return {title: row.doc.listName, purchases: new Array<Purchase>(), users: new Array<User>()};
                });
                 // Listen for changes on the database.
                //localUserDB.changes({live: true, since: 'now', include_docs: true}).on('change', this.onDatabaseChange);                
                console.log(this.lists);
                return this.lists;
            });
        } else {
            // Return cached data as a promise
            return Promise.resolve(this.lists);
        }

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

   /* private onDatabaseChange = (change) => {

        var index = this.findIndex(this._lists, change.id);
        var birthday = this._lists[index];

        if (change.deleted) {
            if (birthday) {
                this._lists.splice(index, 1); // delete
            }
        } else {

            if (birthday && birthday._id === change.id) {
                this._lists[index] = change.doc; // update
            } else {
                console.debug(JSON.stringify(change.doc));
                this._lists.push(change.doc); // insert
                this.ref.tick();
            }
        }
    }*/

    addList(list: PurchaseList) {
       this.listService.createList(list.name);
       let sync = this.listService.syncListDB(list.name);
       sync.cancel();
      //  this.lists.push(list);
    }

    addPurchase(list: PurchaseList, purchase: Purchase) {
        let localListDB = this.listService.getListDB(list.name);
        localListDB.post(purchase);
        this.listService.syncListDB(list.name);
        list.purchases.push(purchase);
    }


}
