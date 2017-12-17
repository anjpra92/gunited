import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { AUTH_PROVIDERS } from 'angular2-jwt';
import { ConFile } from './conf_file'

declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  options = {
  theme:
  {
    // logo: 'https://gunited-app-aprabha7.c9users.io/api/uploads/serverpic/logolock.png',
    logo: ConFile.imgURL+'logolock.png',
    primaryColor: '#31324F'
  },
  languageDictionary:
  {
    title: "Login To Guitar Away!"
  },
  auth:
  {
      redirect: true,
      // redirectUrl: 'https://gunited-app-aprabha7.c9users.io/',
      redirectUrl: ConFile.reDirectURL,
      responseType: 'token',
      params:{
        scope: 'openid offline_access',
        device: 'Chrome browser'
      }
  }
  };
  lock = new Auth0Lock('fnWRCu7bqkyACgzLbpuFevkkoL7cO6mN', 'gunited.auth0.com', this.options);

  userProfile: any;
  loggedIn:Boolean = false;

  constructor() 
  {
    console.log('Inside auth constructor');
    // Add callback for the Lock `authenticated` event
    this.lock.on("authenticated", (authResult) => 
    {
      console.log('authresult object:',authResult);
      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('refreshToken', authResult.refreshToken);
      // Fetch profile information
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => 
      {
        if (error) 
        {
          // Handle error
          alert(error);
          console.log(error);
          return;
        }
        localStorage.setItem('profile', JSON.stringify(profile));
        this.userProfile = profile;
        this.loggedIn = true;
      });
    });
  }

  public login()
  {
    // Call the show method to display the widget.
    console.log('Inside login');
    this.lock.show(this.options);
  }

  public authenticated() {
    return this.loggedIn;
  }

  public logout() {
    // Remove token from localStorage
    this.loggedIn = false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }

}
