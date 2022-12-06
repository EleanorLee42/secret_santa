import { Component } from '@angular/core';

/* This looks like part of Val's notification work
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { LocalNotifications } from '@capacitor/local-notifications'
*/

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  /* Old project had this (more notification stuff):
  export class HomePage implements OnInit {
  ngOnInit() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register()
        PushNotifications.addListener('registration', async ({ value }) => {
          let androidToken = value; // this is token for Android use this token
        });
      } else {
        alert('No Permission for Notifications!')
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        alert('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
        this.doLocalNotif(notification);
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
  private doLocalNotif(notification: any) {
    LocalNotifications.schedule({
      notifications: [
        {
          title: notification.title,
          body: notification.body,
          id: Date.now(),
          attachments: [
            {
              id: 'site',
              url: notification.data.imageUrl,
            },
          ],
          actionTypeId: '',
        },
      ],
    });
  }
  */

}
