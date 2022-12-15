import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ToastController } from '@ionic/angular';
import { MiniGroup, Person } from 'src/app/interfaces';
import { DataServiceService } from '../../services/dataService/data-service.service';

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.page.html',
  styleUrls: ['./person-view.page.scss'],
})
export class PersonViewPage implements OnInit {
  ispartner: boolean;
  userID: string;
  groupID: string;
  personID: string;
  person: Person;

  constructor(private route: ActivatedRoute,
    private afMessaging: AngularFireMessaging,
    private toastCtrl: ToastController,
    private dataService: DataServiceService) { this.listenForMessages(); }

  async ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('uid')); //gets userID from route parameter
    this.personID = String(this.route.snapshot.paramMap.get('id')); //gets personID from route parameter
    this.groupID = String(this.route.snapshot.paramMap.get('gid')); //gets groupID from route parameter

    this.person = await this.dataService.getOnePerson(this.personID);
    let user = await this.dataService.getUser();
    let userGroupIndex = user.Groups.findIndex((element: MiniGroup) => element.GroupID === this.groupID);
    this.ispartner = (user.Groups[userGroupIndex].GifteeID === this.person.id); //checks if this person is the user's giftee
  }

  listenForMessages = async () => {
    // Based on https://devdactic.com/ionic-pwa-web-push
    this.afMessaging.messages.subscribe(async (msg: any) => {
      const toast = await this.toastCtrl.create({
        header: msg.notification.title,
        message: msg.notification.body,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          }
        ]
      });

      await toast.present();
    });
  }

}
