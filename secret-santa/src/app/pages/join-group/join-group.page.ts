import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { updateCurrentUser } from 'firebase/auth';
import { Group, MiniGroup, MiniPerson, Person } from 'src/app/interfaces';
import { DataServiceService } from 'src/app/services/dataService/data-service.service';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.page.html',
  styleUrls: ['./join-group.page.scss'],
})
export class JoinGroupPage implements OnInit {
  userID: string;
  code: string;
  groups: Group[];

  constructor(private db: AngularFirestore,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private afMessaging: AngularFireMessaging,
    private toastCtrl: ToastController,
    private dataService: DataServiceService) { this.listenForMessages(); }

  ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
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

  async joinGroup() {
    this.groups = await this.dataService.getAllGroups();
    let codes: string[] = [];
    this.groups.forEach(group => { codes.push(group.joinCode) });
    let groupIndex = codes.findIndex(gCode => this.code === gCode);
    if (groupIndex !== -1) {
      let group = this.groups[groupIndex];
      let user = await this.dataService.getUser();
      if (group.People.length < group.numPeople) {
        group.People.push({ Name: user.Name, id: user.id });
        user.Groups.push({ GifteeName: "", GifteeID: "", GroupID: group.id });
        this.db.collection<Person>('/People').doc(this.userID).update(user);
        this.db.collection<Group>('/Groups').doc(group.id).update(group);
        this.router.navigate(['/group-view', group.id, this.userID]);
      } else {
        const alert = await this.alertCtrl.create({
          header: "Sorry, that group is already full.",
          buttons: ['OK']
        });

        await alert.present();
      }
    } else {
      const alert = await this.alertCtrl.create({
        header: "Oops! That's not a valid code.",
        buttons: ['OK']
      });

      await alert.present();
    }
  }

}
