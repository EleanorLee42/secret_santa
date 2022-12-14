import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Group, MiniGroup, MiniPerson, Person } from 'src/app/interfaces';
import { DataServiceService } from 'src/app/services/dataService/data-service.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
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
    this.requestPermission();
    this.listenForMessages();
  }

  async logout() {
    await this.authService.logoutUser();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  requestPermission() {
    // Based on https://devdactic.com/ionic-pwa-web-push
    return this.afMessaging.requestToken
      .subscribe(
        (token) => {
          if (!token) {
            token = "";
          }
          // console.log('Permission granted! Save to the server!', token);
          this.db.collection<Person>('/People').doc(this.userID).update({ "Token": token! });
        },
        (error) => { console.error(error); },
      );
  }
  gifteeName(groupID: string): string {
    let i = this.user.Groups.findIndex((group: MiniGroup) => group.GroupID === groupID);
    return this.user.Groups[i].GifteeName;
  }

  async ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
    this.user = await this.dataService.getUser(this.userID);
    let groupIds: string[] = [];
    this.user.Groups.forEach((group: MiniGroup) => groupIds.push(group.GroupID));
    this.groups = await this.dataService.getAllGroups();
    this.groups = this.groups.filter((group: Group) => groupIds.includes(group.id))
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
