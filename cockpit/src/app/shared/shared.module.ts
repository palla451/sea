import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, TranslocoModule],
  exports: [CommonModule, FormsModule, TranslocoModule],
})
export class SharedModule {}
