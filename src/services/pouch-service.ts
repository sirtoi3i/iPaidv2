import {Injectable, ApplicationRef} from '@angular/core';
import * as PouchDB from 'pouchdb';
import { Http} from "@angular/http";

@Injectable()
export class PouchServiceV2 {
    constructor(private http: Http, private ref: ApplicationRef) {


    }



    registerUser(){

        this.connectToUserDB();
        this.connectToUserDB();


    }





    initUser(username:string) {
        let usersDB = new PouchDB('http://localhost:5984/_users');
        let userId = 'org.couchdb.user:' + username;
        let user = {
            name: username,
            password: username,
            roles: [],
            type: 'user',
            _id: userId
        };

        usersDB.get(userId).then(function (user) {
                // user already exsists
            }).catch(function (err) {
                // create user if not exist
                usersDB.post(user).then(
                a => {
                    console.log(a);
                    new PouchDB('http://localhost:5984/' + username), {
                        auth: {
                            username: username,
                            password: username
                        }
                    };
                }, b => {
                    console.log(b);
                });
            });
    }

  
}