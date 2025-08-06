import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-incident-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incident-event.component.html',
  styleUrl: './incident-event.component.scss'
})
export class IncidentEventComponent {
  @Input() alertLevel: 'critical' | 'medium' | 'low' = 'low';
  @Input() number: number = 1; // Numero visualizzato nel cerchio

  get alertColor(): string {
    switch (this.alertLevel) {
      case 'critical':
        return '#E53935'; // Rosso
      case 'medium':
        return '#FBC02D'; // Giallo
      case 'low':
        return '#43A047'; // Verde
      default:
        return '#BDBDBD'; // Grigio fallback
    }
  }

}
