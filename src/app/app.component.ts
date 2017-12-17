import { Component} from '@angular/core';
import { AuthService } from './auth.service'
import {AuthHttp} from 'angular2-jwt';
import { ViewEncapsulation,Renderer,Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'app';

  constructor(private auth:AuthService,private authHttp: AuthHttp )
  {

  }
}
