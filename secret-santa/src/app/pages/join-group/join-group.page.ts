import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { updateCurrentUser } from 'firebase/auth';
import { Group, MiniGroup, MiniPerson, Person } from 'src/app/interfaces';
import { DataServiceService } from '../../services/dataService/data-service.service';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.page.html',
  styleUrls: ['./join-group.page.scss'],
})
export class JoinGroupPage implements OnInit {
  userID: string;
  code: string;
  groups: Group[];
  nickname: string;
  user: Person;

  constructor(private db: AngularFirestore,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private afMessaging: AngularFireMessaging,
    private toastCtrl: ToastController,
    private dataService: DataServiceService) { this.listenForMessages(); }

  async ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
    this.user = await this.dataService.getUser();
    this.nickname = this.user.Name
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
      if (group.People.length < group.numPeople) {
        group.People.push({ Name: this.user.Name, id: this.user.id, nickname: this.nickname });
        this.user.Groups.push({ GifteeName: "", GifteeID: "", GroupID: group.id });
        this.db.collection<Person>('/People').doc(this.userID).update(this.user);
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
