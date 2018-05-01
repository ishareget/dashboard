import { Component, OnInit } from '@angular/core';
import animateScrollTo from 'animated-scroll-to';

declare let jquery: any;
declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    this.scrollShow();
    this.scrollMove();
  }

  public scrollShow() {
    // $(document).scroll(function () {
    //   let scrollDistance = $(this).scrollTop();
    //   if (scrollDistance > 100) {
    //     $('.scroll-to-top').fadeIn();
    //   } else {
    //     $('.scroll-to-top').fadeOut();
    //   }
    // });
  }

  public scrollMove() {
    // $(document).on('click', 'a.scroll-to-top', function (event) {
    //   let $anchor = $(this);
    //   $('html, body').stop().animate({
    //     scrollTop: ($($anchor.attr('href')).offset().top)
    //   }, 1000, 'easeInOutExpo');
    //   event.preventDefault();
    // });
  }

  public scrolltop() {
    animateScrollTo(0);
  }

}
