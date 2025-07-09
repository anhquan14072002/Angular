import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dialog-view',
  imports: [Dialog, ButtonModule, InputTextModule],
  templateUrl: './dialog-view.component.html',
  styleUrls: ['./dialog-view.component.css']
})
export class DialogViewComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  onVisibleChange(newValue: boolean) {
    console.log(newValue);

    this.visibleChange.emit(newValue);
  }

   closeDialog() {
    this.onVisibleChange(false);
  }

  saveDialog(){
    this.onVisibleChange(false)
  }
}