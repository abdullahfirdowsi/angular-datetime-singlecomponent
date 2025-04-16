import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  currentDateTime: Date = new Date();
  selectedTimezone: string;
  timezones: string[] = [];
  formattedDateTime: string = '';
  
  // System timezone information
  localTimezone: string;
  localOffset: string;
  systemInfo: {
    timezone: string;
    offset: string;
    region: string;
  };

  constructor() {
    // Get system timezone information
    this.systemInfo = this.getSystemTimezoneInfo();
    this.localTimezone = this.systemInfo.timezone;
    this.localOffset = this.systemInfo.offset;
    
    // Initially set selected timezone to local timezone
    this.selectedTimezone = this.localTimezone;
  }

  ngOnInit() {
    this.timezones = this.getTimezones();
    this.formatDateTime();
    
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  // Get detailed system timezone information
  // private getSystemTimezoneInfo() {
  //   const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  //   const date = new Date();
    
  //   // Get timezone offset in hours and minutes
  //   const offset = date.getTimezoneOffset();
  //   const hours = Math.abs(Math.floor(offset / 60));
  //   const minutes = Math.abs(offset % 60);
  //   const offsetString = `UTC${offset <= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
  //   // Get region from timezone
  //   const region = timezone.split('/')[0];

  //   return {
  //     timezone: timezone,
  //     offset: offsetString,
  //     region: region
  //   };
  // }

  private getSystemTimezoneInfo() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date();
  
    // Negate the offset to correctly handle UTC+ offsets
    const offset = -date.getTimezoneOffset(); // Fix: Negate the offset
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
  
    // Format the offset string with the correct sign
    const offsetString = `UTC${offset >= 0 ? '+' : '-'}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
    // Get region from timezone
    const region = timezone.split('/')[0];
  
    return {
      timezone: timezone,
      offset: offsetString,
      region: region
    };
  }

  updateDateTime() {
    this.currentDateTime = new Date();
    this.formatDateTime();
  }

  formatDateTime() {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: this.selectedTimezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'long' // Changed to 'long' for more detailed timezone info
    };

    this.formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(this.currentDateTime);
  }

  onTimezoneChange() {
    this.formatDateTime();
  }

  private getTimezones(): string[] {
    return Intl.supportedValuesOf('timeZone');
  }

  // Helper method to check if current timezone is system timezone
  isLocalTimezone(): boolean {
    return this.selectedTimezone === this.localTimezone;
  }
}