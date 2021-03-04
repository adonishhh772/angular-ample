import {AfterViewInit, Component, ElementRef, Renderer2, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements AfterViewInit {
    public screenWidth: any = 1300;
  constructor(private renderer: Renderer2, private elRef: ElementRef) { }

    ngAfterViewInit(): void {
        this.screenWidth = this.elRef.nativeElement.querySelector('.col-md-12').clientWidth;
      // this.screenWidth = window.innerWidth;
  }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.screenWidth = this.elRef.nativeElement.querySelector('.col-md-12').clientWidth;
    }

}
