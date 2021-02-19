import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoad: boolean = false;

  constructor(
    private ls: LoaderService,
    private cdRef: ChangeDetectorRef  
  ) {}

  ngOnInit(): void {
    this.ls.isLoad.subscribe(data => {
      this.isLoad = data;
      this.cdRef.detectChanges();
    });
  }
}
