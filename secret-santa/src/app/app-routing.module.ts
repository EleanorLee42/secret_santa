import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

// TODO: figure out auth guards (code as is was doing smthn funky)
// unauthorized users redirected to home
// code from https://devdactic.com/ionic-firebase-auth-upload
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['user-home']);
// authorized users redirected to user-home
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    // ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '',
    // loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    // ...canActivate(redirectLoggedInToHome)
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    // path: 'user-home',
    path: 'user-home/:id',
    loadChildren: () => import('./pages/user-home/user-home.module').then(m => m.UserHomePageModule)
  },
  // {
  //   path: 'create-profile',
  //   loadChildren: () => import('./pages/create-profile/create-profile.module').then(m => m.CreateProfilePageModule)
  // },
  {
    path: 'create-profile/:id',
    loadChildren: () => import('./pages/create-profile/create-profile.module').then(m => m.CreateProfilePageModule)
  },
  {
    path: 'group-view/:id/:uid',
    loadChildren: () => import('./pages/group-view/group-view.module').then(m => m.GroupViewPageModule)
  },
  {
    path: 'person-view/:id/:gid/:uid',
    loadChildren: () => import('./pages/person-view/person-view.module').then(m => m.PersonViewPageModule)
  },
  {
    path: 'edit-profile/:id',
    loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'new-group/:id',
    loadChildren: () => import('./pages/new-group/new-group.module').then(m => m.NewGroupPageModule)
  },
  {
    path: 'create-group/:id',
    loadChildren: () => import('./pages/create-group/create-group.module').then(m => m.CreateGroupPageModule)
  },
  {
    path: 'join-group/:id',
    loadChildren: () => import('./pages/join-group/join-group.module').then(m => m.JoinGroupPageModule)
  },
  {
    path: 'public-groups/:id',
    loadChildren: () => import('./pages/public-groups/public-groups.module').then(m => m.PublicGroupsPageModule)
  },
  {
    path: 'public-group-view/:id/:uid',
    loadChildren: () => import('./pages/public-group-view/public-group-view.module').then(m => m.PublicGroupViewPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
