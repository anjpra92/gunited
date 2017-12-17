import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ChordproComponent } from './chordpro/chordpro.component';
import { FrndgrpComponent } from './frndgrp/frndgrp.component';
import { ProfileeditComponent} from './profileedit/profileedit.component';
import { SongbookComponent} from './songbook/songbook.component';
import { GroupComponent} from './group/group.component';
import { SongviewComponent } from './songview/songview.component';

const routes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path:'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'convert',
    component: ChordproComponent
    // data: { shouldDetach: true}
  },
  {
    path:'convert/:id',
    component: ChordproComponent,
    // data: { shouldDetach: true}
  },
  {
    path:'editProfile',
    component: ProfileeditComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'songbook',
    component: SongbookComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'friendsgroup',
    component: FrndgrpComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'group',
    component: GroupComponent,
    canActivate: [AuthGuard]
  },
  <any>{
    path:'songview/:id/:call',
    component: SongviewComponent,
    fullscreen:true,
    canActivate: [AuthGuard]
  }
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})


export class AppRoutingModule {}
export const appRoutingProviders: any[] = [];