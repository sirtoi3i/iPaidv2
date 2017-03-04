import {Injectable, ApplicationRef} from '@angular/core';
import * as PouchDB from 'pouchdb';
import {Observable} from "rxjs";
import {RequestOptions, RequestMethod, Http, Headers, Request} from "@angular/http";


@Injectable()
export class PouchService {
    constructor(private http: Http, private ref: ApplicationRef) {
    }

    private _db;
    private _dbs = [];
    private _lists;


    initDB() {

        let username = "Kulle2";
        let userDB = new PouchDB('http://localhost:5984/_users');
        let userId = 'org.couchdb.user:' + username;
        let user = {
            name: username,
            password: username,
            roles: [],
            type: 'user',
            _id: userId
        };
        userDB.post(user).then(
            a => {
                this.createDBs(username);

            }, b => {
                this.createDBs(username);
            });

    }


    randomWriteToDB() {
        let ticks: number = 0;
        let timer = Observable.timer(4000, 1000);

        timer.subscribe(t => {
            console.log(ticks)
            console.log(this._dbs[ticks]);
            //this._dbs[ticks].post({Name: ticks});
            ticks++;
            if (ticks > 1)
                ticks = 0;
        });

    }

    initDBWithPW() {
        let dbName: string = "bd10"
        this._db = new PouchDB(dbName);

        console.log(JSON.stringify(this._db));


        let browser: string = "";
        if (this._db.__opts.adapter == "idb") {
            browser = "chrome";

        } else {
            browser = "safari";
        }

        browser = "chrome";
        console.log("I AM " + browser);

        let options = {
            live: true,
            retry: true,
            continuous: true,
            auth: {
                username: browser,
                password: browser
            }
        };
        PouchDB.sync(dbName, 'http://localhost:5984/' + dbName, options);


    }

    add(birthday) {
        return this._db.post(birthday);
    }

    update(birthday) {
        return this._db.put(birthday);
    }

    delete(birthday) {
        return this._db.remove(birthday);
    }

    getAll() {

        if (!this._lists) {
            return this._dbs[0].allDocs({include_docs: true})
                .then(docs => {

                    // Each row has a .doc object and we just want to send an
                    // array of birthday objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.


                    this._lists = docs.rows.map(row => {
                        // Dates are not automatically converted from a string.
                        return row.doc;
                    });

                    // Listen for changes on the database.
                    this._db.changes({live: true, since: 'now', include_docs: true})
                        .on('change', this.onDatabaseChange);

                    return this._lists;
                });
        } else {
            // Return cached data as a promise
            return Promise.resolve(this._lists);
        }
    }

    private onDatabaseChange = (change) => {

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
    }

// Binary search, the array is by default sorted by _id.
    private
    findIndex(array, id) {
        var low = 0, high = array.length, mid;
        while (low < high) {
            mid = (low + high) >>> 1;
            array[mid]._id < id ? low = mid + 1 : high = mid
        }
        return low;
    }

    private createDBs(username: string) {
        for (let i = 0; i < 1; i++) {


            let dbName: string = "a" + i

            let sec = {
                _id: "_security",
                members: {
                    names: [
                        username
                    ]
                }
            }

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let url = 'http://localhost:5984/' + dbName + "/_security";


            this.http.put(url, sec, {headers: headers}).map(res => res.json()).subscribe(
                data => {

                    this._dbs.push(new PouchDB(dbName));


                    let options = {
                        live: true,
                        retry: true,
                        auth: {
                            username: username,
                            password: username
                        }
                    };
                    PouchDB.sync(dbName, 'http://localhost:5984/' + dbName, options);
                    console.log("CREATED AND SYNCED: " + JSON.stringify(this._dbs[i]));

                    this._dbs[i].changes({live: true, since: 'now', include_docs: true})
                        .on('change', this.onDatabaseChange);
                },
                err => {
                    // Log errors if any
                    console.log(err);
                });
            ;


        }
    }
}