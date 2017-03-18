import {Injectable, ApplicationRef} from '@angular/core';
import * as PouchDB from 'pouchdb';
import {Http, Headers} from "@angular/http";


@Injectable()
export class PouchServiceV2 {


    readonly HOST: string = "http://localhost:5984/";
    readonly USERDB: string = "_users";
    readonly NOTIFICATIONDB: string = "notification";

    readonly USERIDPrefix: string = 'org.couchdb.user:';
    readonly SECURITY: string = "/_security";
    readonly ADMIN: string = "admin";

    private identiy: string;
    private usersDB;
    private userId;
    private notiDB;


    public privDBinstance;
    private options;
    private adminOptions = {
        live: false,
        retry: false,
        auth: {
            username: this.ADMIN,
            password: this.ADMIN
        }
    };


    constructor(private http: Http, private ref: ApplicationRef) {


        //this.privDBinstance.post({title: "BlUB"})

    }

    clear() {
        this.privDBinstance.destroy().then(
            succ => {
                console.log(succ);
                console.log("CLEARED");
            },
            err => {
                console.log(err);
            });
    }

    registerUser(username: string) {

        this.identiy = username.toLowerCase();

        this.options = {
            live: true,
            retry: true,
            since: 'now',
            include_docs: true,
            auth: {
                username: this.identiy,
                password: this.identiy
            }
        };
        this.privDBinstance = new PouchDB(this.identiy);
        this.userId = this.USERIDPrefix + this.identiy;
        this.usersDB = new PouchDB(this.HOST + this.USERDB, this.adminOptions);
        this.initUser();


    }

    public initNoti() {
        this.notiDB = new PouchDB(this.NOTIFICATIONDB);
        let remoteNotiDB = new PouchDB(this.HOST + this.NOTIFICATIONDB);
        this.syncToDBwithUser(this.NOTIFICATIONDB);
        remoteNotiDB.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', change => {


            if (change.doc.toUser == this.identiy) {
                alert("Interessiert mich brennend!!!");
                this.privDBinstance.post({listName: change.doc.listName});

            } else {
                alert("Interessiert mich n Scheiß");
            }

        }).on('complete', function (info) {
            // changes() was canceled
        }).on('error', function (err) {
            console.log(err);
        });
    }

    public notify(toBeNotified: string, listName: string) {

        this.notiDB.post({fromUser: this.identiy, toUser: toBeNotified, listName: listName})
    }

    private initUser() {


        this.usersDB.get(this.userId).then(
            succ => {
                console.log(succ);
                console.log("User already Existent - All good");
                this.createDBwithAdmin(this.identiy);
            },
            err => {
                console.log(err);
                this.createUser();

            });
    }

    private createUser() {
        let user = {
            name: this.identiy,
            password: this.identiy,
            roles: [],
            type: 'user',
            _id: this.userId
        };
        console.log("User NOT Existent - Need to Create");
        this.usersDB.post(user).then(
            succ => {
                console.log(succ);
                this.initUser();
            },
            err => {
                console.log(err);
            });

    }


    public createDBwithAdmin(dbname: string) {

        console.log("createPrivateDB");


        let sync = PouchDB.replicate(dbname, this.HOST + dbname, this.adminOptions)
            .on('change', function (info) {
                // handle change
                console.info("change" + info)
            }).on('paused', function (err) {
                // replication paused (e.g. replication up to date, user went offline)
                console.error("paused", err)
            }).on('active', function () {
                // replicate resumed (e.g. new changes replicating, user went back online)
                console.error("active")
            }).on('denied', function (err) {
                // a document failed to replicate (e.g. due to permissions)
                console.error("denied" + err)
            }).on('complete', i => {
                // handle complete
                console.info("complete" + i);
                this.secureDBwithAdmin(dbname);
                this.syncToDBwithUser(dbname);
            }).on('error', function (err) {
                console.error("error" + err)
            });


    }


    private syncToDBwithUser(dbname: string) {
        console.log("syncToPrivateDB");
        let sync = PouchDB.sync(dbname, this.HOST + dbname, this.options)
            .on('change', function (info) {
                // handle change
                console.info("change" + info)
            }).on('paused', function (err) {
                // replication paused (e.g. replication up to date, user went offline)
                console.error("paused", err)
            }).on('active', function () {
                // replicate resumed (e.g. new changes replicating, user went back online)
                console.error("active")
            }).on('denied', function (err) {
                // a document failed to replicate (e.g. due to permissions)
                console.error("complete" + err)
            }).on('complete', function (info) {
                // handle complete
                console.info("complete" + info)
            }).on('error', function (err) {
                console.error("error" + err)
            });
    }

    private secureDBwithAdmin(dbname: string) {

        let sec = {
            _id: "_security",
            admins: {
                names: [
                    this.ADMIN
                ],
                roles: []
            },
            members: {
                names: [
                    this.identiy
                ],
                roles: []
            }
        }

        let headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(this.ADMIN + ":" + this.ADMIN));
        headers.append('Content-Type', 'application/json');
        let url = this.HOST + dbname + this.SECURITY;


        this.http.put(url, sec, {headers: headers}).map(res => res.json()).subscribe(
            data => {
                console.info("Secured DB");
                console.info(data);
            },
            err => {
                // Log errors if any
                console.log(err);
            });
        ;


    }
}