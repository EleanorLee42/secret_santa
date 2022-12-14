import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Group, MiniGroup, MiniPerson, Person } from 'src/app/interfaces';
import { DataServiceService } from '../../services/dataService/data-service.service';

@Component({
  selector: 'app-public-groups',
  templateUrl: './public-groups.page.html',
  styleUrls: ['./public-groups.page.scss'],
})
export class PublicGroupsPage implements OnInit {
  userID: string;
  public groups: Group[] | undefined; // Current group
  user: Person;
  // messaging = getMessaging(initializeApp(environment.firebase));

  constructor(
    private route: ActivatedRoute,
    private afMessaging: AngularFireMessaging,
    private authService: AuthService,
    private db: AngularFirestore,
    private toastCtrl: ToastController,
    private router: Router,
    private dataService: DataServiceService,
  ) {
    this.listenForMessages();
  }

  async ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
    this.user = await this.dataService.getUser(this.userID);
    // let groupIds: string[] = [];
    // this.user.Groups.forEach((group: MiniGroup) => groupIds.push(group.GroupID));
    this.groups = await this.dataService.getAllGroups();
    this.groups = this.groups.filter((group: Group) => group.isPublic && (group.numPeople > group.People.length))
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