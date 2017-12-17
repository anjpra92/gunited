import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Http, RequestOptions } from '@angular/http';
import { AppRoutingModule,appRoutingProviders }     from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ChordproComponent } from './chordpro/chordpro.component';
import { SongComponent } from './song/song.component';
import { FormatopComponent } from './formatop/formatop.component';
import { ProfileeditComponent } from './profileedit/profileedit.component';
import { SongbookComponent } from './songbook/songbook.component';
import { FrndgrpComponent } from './frndgrp/frndgrp.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { GroupComponent } from './group/group.component';
import { SongviewComponent } from './songview/songview.component';
//Services
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SongService} from './song.service';
import { FetchusersService} from './fetchusers.service';
import { PlayserviceService} from './playservice.service';
import { FriendgroupService } from './friendgroup.service';
//Misc
import { FileSelectDirective} from 'ng2-file-upload';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatButtonModule, MatToolbarModule, MatIconModule, MatListModule } from '@angular/material';
import * as JSZip from 'jszip';
import 'rxjs/add/operator/map';



export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'id_token',
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    ChordproComponent,
    SongComponent,
    FormatopComponent,
    FileSelectDirective,
    ProfileeditComponent,
    SongbookComponent,
    FrndgrpComponent,
    PlaylistComponent,
    GroupComponent,
    SongviewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    Ng2FilterPipeModule,
    BrowserAnimationsModule,
    MatSidenavModule, MatButtonModule, MatToolbarModule, MatIconModule, MatListModule
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
  appRoutingProviders,
  AuthService,
  AuthGuard,
  SongService,
  FetchusersService,
  PlayserviceService,
  FriendgroupService
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
