import {Injectable, ApplicationRef} from '@angular/core';
import * as PouchDB from 'pouchdb';
import { Http} from "@angular/http";


@Injectable()
export class ListService {

    localUserDB: any;

    constructor(private http: Http, private ref: ApplicationRef) {
        this.localUserDB = new PouchDB('michel');
        this.syncListDB('michel');
    }

    createList(listName:string) {
        new PouchDB(listName);
        this.localUserDB.post({listName: listName});
    }  


    getListDB(listName:string) {
       return new PouchDB(listName);
    }

    syncListDB(listName: string) {
        let options = {
            live: true,
            retry: true
        }
        // create _security doc
        return PouchDB.sync(listName, 'http://localhost:5984/' + listName, options);
    }

    getUserDB() {
        return this.localUserDB;
    }

}