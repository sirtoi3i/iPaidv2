import {PurchaseList} from '../objects/list';
import {Injectable, ApplicationRef} from '@angular/core';
import * as PouchDB from 'pouchdb';
import {Http} from "@angular/http";
import {PouchServiceV2} from "./pouch-service";


@Injectable()
export class ListService {


    constructor(private http: Http, private ref: ApplicationRef, public pouchService: PouchServiceV2) {

    }

    createList(list: PurchaseList) {

        let listName = list.name;

        //CREATE Local DB
        new PouchDB(listName);
        //CREATE Remote DB
        this.pouchService.createDBwithAdmin(listName);

        //Save DB in Private DB
        this.pouchService.privDBinstance.post({listName: listName});

        console.log(list);
        // add notification
        for (let user of list.users) {
            this.pouchService.notify(user.firstName, listName);
        }
    }

    getUserDB() {
        return this.pouchService.privDBinstance;
    }


    getListDB(listName: string) {
        return new PouchDB(listName);
    }


}