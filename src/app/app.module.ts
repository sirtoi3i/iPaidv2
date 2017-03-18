import { PouchServiceV2 } from '../services/pouch-service';
import { LoginPage } from '../pages/login/login';
import { PurchaseCreationPage } from '../pages/purchase-creation/purchase-creation';
import { ListProvider } from '../providers/list-provider';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {ListsPage} from '../pages/lists/lists';
import {ListDetailsPage} from '../pages/list-details/list-details';
import {ListCreationPage} from '../pages/list-creation/list-creation';
import {PouchService} from "../services/pouch.service";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListsPage,
    ListDetailsPage,
    ListCreationPage,
    PurchaseCreationPage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListsPage,
    ListDetailsPage,
    ListCreationPage,
    PurchaseCreationPage,
    LoginPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, ListProvider,PouchService, PouchServiceV2]
})
export class AppModule {}
