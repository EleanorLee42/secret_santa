import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'group-banner',
  templateUrl: './group-banner.component.html',
  styleUrls: ['./group-banner.component.scss'],
})
export class GroupBannerComponent implements OnInit {

  constructor( private router: Router ) { }

  /* goToGroupView is called when a group-banner is clicked.
     It uses the injected router to navigate to the group-view page.
  */
  goToGroupView() {
    // navigation with a button from https://www.folkstalk.com/2022/09/button-click-navigate-to-another-page-angular-with-code-examples-2.html
    this.router.navigateByUrl('/group-view');
  }

  ngOnInit() {}

}
