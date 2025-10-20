import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qr-generator',
  standalone: false,
  templateUrl: './qr-generator.html',
  styleUrls: ['./qr-generator.scss']
})
export class QrGenerator {
  iosLink = 'https://apps.apple.com/us/app/varroc-connect/id1194939452';
  androidLink = 'https://play.google.com/store/apps/details?id=com.cariq.mobility.cariqdriven&hl=en_IN';
  qrImage = '';
  redirectUrl = '';
  loading = false;

  constructor(private http: HttpClient) { }

  generate() {
    if (!this.iosLink || !this.androidLink) {
      alert('Please enter both links');
      return;
    }
    this.loading = true;
    this.http.post<any>('http://localhost:3000/api/generate', { iosLink: this.iosLink, androidLink: this.androidLink })
      .subscribe({
        next: res => {
          this.qrImage = res.qrUrl;        // ✅ fixed key name
          this.redirectUrl = res.redirectUrl;
          this.loading = false;
          console.log('✅ QR generated successfully:', res);
        },
        error: err => {
          console.error(err);
          alert('Error generating QR');
          this.loading = false;
        }
      });
  }
}
