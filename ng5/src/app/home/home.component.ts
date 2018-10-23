import { Component, OnInit } from '@angular/core';
import { trigger, style, transition,animate, keyframes, query, stagger } from '@angular/animations';
import { DataService } from "../data.service"; //Agregada

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations:[
      
    trigger("goals", [
      transition("* => *", [
        
        query(":enter", style({ opacity: 0 }), {optional: true}),

        query(":enter", stagger("300ms", [
          animate(".6s ease-in", keyframes([
            style({ opacity: 0 , transform: "translateY(-75%)", offset: 0 }),
            style({ opacity:.5 , transform: "translateY(35px)", offset:.3 }),
            style({ opacity: 1 , transform: "translateY(0)", offset: 1 })
          ]))
        ]), {optional: true}),

        query(":leave", stagger("300ms", [
          animate(".6s ease-in", keyframes([
            style({ opacity: 1 , transform: "translateY(0)", offset: 0 }),
            style({ opacity:.5 , transform: "translateY(35px)", offset:.3 }),
            style({ opacity: 0 , transform: "translateY(-75%)", offset: 1 })
          ]))
        ]), {optional: true})

      ])
    ])
  ]
})

export class HomeComponent implements OnInit {

  itemCount: number;
  btnAdd: string = "Add item";
  text: string = "";

  textArray: string[] = [];

  constructor(private _data: DataService) { }

  ngOnInit() {
    this._data.goal.subscribe( res => this.textArray = res);
    this.itemCount = this.textArray.length;

    this._data.changeGoal(this.textArray);
  }

  addItem(){
    this.textArray.push(this.text);
    this.text = "";
    this.itemCount = this.textArray.length;

    this._data.changeGoal(this.textArray);
  }

  removeItem(i){
    this.textArray.splice(i, 1);
    this.itemCount --;

    this._data.changeGoal(this.textArray);
  }

}
