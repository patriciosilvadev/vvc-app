import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'vvc-template-generic',
  templateUrl: './template-generic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateGenericComponent {

  @Input() message;
  @Output() action = new EventEmitter();
  @ViewChild('carousel') container: ElementRef;

  scrollRight(){
    this.container.nativeElement.scrollLeft = this.container.nativeElement.scrollLeft + 260;
  }

  scrollLeft(){
    this.container.nativeElement.scrollLeft = this.container.nativeElement.scrollLeft - 260;
  }

  defaultAction(elem){
    if (elem.default_action) this.action.emit(elem.default_action);
  }
}
