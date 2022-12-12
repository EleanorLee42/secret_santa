import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

interface MiniPerson {
  Name: string,
  id: string
}

interface Group {
  Name: string,
  joinCode: string,
  numPeople: number,
  id: string,
  People: MiniPerson[],
  date?: string
}
interface MiniGroup {
  GifteeName: string,
  GifteeID: string,
  GroupID: string
}
interface Person {
  Groups: MiniGroup[],
  Interests: string,
  Name: string,
  PhoneNumber: string,
  Token: string,
  email: string,
  id: string,
}


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
  userID: string;
  private groupCollection: AngularFirestoreCollection<Group> = this.db.collection<Group>('/Groups');
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
    let userDoc = await this.db.collection<Person>('/People').ref.doc(this.userID).get();
    this.user = {
      Groups: userDoc.get("Groups"),
      Interests: userDoc.get("Interests"),
      Name: userDoc.get("Name"),
      PhoneNumber: userDoc.get("PhoneNumber"),
      Token: userDoc.get("Token"),
      email: userDoc.get("email"),
      id: userDoc.id
    }
    let groupIds: string[] = [];
    this.user.Groups.forEach((group: MiniGroup) => groupIds.push(group.GroupID));
    let dateFormatting = { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" } as const;
    let groupSub = await this.db.collection<Group>('/Groups').ref.get();
    this.groups = groupSub.docs.map((doc) => {
      return {
        Name: doc.get("Name"),
        joinCode: doc.get("joinCode"),
        numPeople: doc.get("numPeople"),
        People: doc.get("People"),
        description: doc.get("description"),
        date: new Date(doc.get("date")).toLocaleString('en-US', dateFormatting),
        id: doc.id
      };
    });
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
