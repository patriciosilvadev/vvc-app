import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DataCollection} from '../core/core.interfaces';

@Component({
  selector: 'vvc-initial-data',
  templateUrl: './initial-data.component.html'
})
export class InitialDataComponent implements OnInit {

  @Input() dataCollection: DataCollection;
  @Output() datasubmit = new EventEmitter();
  @Output() abandon = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
