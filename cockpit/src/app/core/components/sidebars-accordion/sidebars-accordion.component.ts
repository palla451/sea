import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebars-accordion',
  imports: [],
  templateUrl: './sidebars-accordion.component.html',
  styleUrl: './sidebars-accordion.component.scss'
})
export class SidebarsAccordionComponent {
  @Input() title: string = 'Event';
  @Input() subtitle: string = 'Incident';
  @Input() isOpen: boolean = false;
  @Input() showSearch: boolean = true;

  toggleAccordion() {
    this.isOpen = !this.isOpen;
  }
}
