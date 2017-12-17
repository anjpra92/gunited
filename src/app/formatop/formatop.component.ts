import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { CustomFormat } from '../customformat';

@Component({
  selector: 'app-formatop',
  templateUrl: './formatop.component.html',
  styleUrls: ['./formatop.component.css']
})
export class FormatopComponent implements OnInit {

  @Output() 
  emitEvent = new EventEmitter();
  cusForm:CustomFormat = {};
  tFonts = ["Times New Roman","Georgia","Lucida Sans Unicode"];
  cFonts = ["Times New Roman","Georgia","Lucida Sans Unicode"];
  tabFonts = ["Courier", "Courier New", "Lucida Console", "Monaco", "Consolas", "Inconsolata"];
  sizes = ["12","14","16","18","20","22","24"]

  constructor() { }

  ngOnInit() {
  }

  test()
  {
   this.emitEvent.emit(this.cusForm);
  }

}
