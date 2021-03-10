import {AfterViewInit, Component, ElementRef, HostListener, Renderer2} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {

    title = 'Ample Education';
    icon = 'dashboard';
    text = 'Dashboard';
    menuIcon = 'close';
    hidden = false;
    mailIcon = 'mail';
    menuTile = '';
    active = '';
    show = '';
    openSearch = '';
    isMiddleResolution = true;
    menu = [{icon: 'dashboard', text: 'Dashboard'}, {icon: '', text: ''}];
    panelOpenState = false;

    constructor(private router: Router, private renderer: Renderer2, private elRef: ElementRef) {
        this.router.navigate(['dashboard']);
    }

    ngAfterViewInit() {
        const el = this.elRef.nativeElement.querySelector('.menu_item');
        this.renderer.addClass(el, 'selected_side_nav');
        if (window.innerWidth < 600){
            this.isMiddleResolution = false;
            this.active = '';
        }else{
            this.openSearch = '';
            this.isMiddleResolution = true;
        }

        this.renderer.listen('window', 'click', (e: Event) => {
            let profile = this.elRef.nativeElement.querySelector('.profile');
            let dropdown = this.elRef.nativeElement.querySelector('.dropdown-menu');
            /**
             * Only run when toggleButton is not clicked
             * If we don't check this, all clicks (even on the toggle button) gets into this
             * section which in the result we might never see the menu open!
             * And the menu itself is checked here, and it's where we check just outside of
             * the menu and button the condition abbove must close the menu
             */
            if (!profile.contains(e.target) && !dropdown.contains(e.target)) {
                this.show = '';
            }
        });
    }

    toggleNav(drawer: any) {
        if (drawer._opened === true){
            this.menuIcon = 'menu';
            drawer.close();
        }else{
            this.menuIcon = 'close';
            drawer.open();
        }

    }

    changeRoute(e: any, bTitle: string, bIcon: string, title: string, link: string, icon: string) {
        let menuText: any;
        const el = this.elRef.nativeElement.querySelectorAll('.menu_item');
        el.forEach((cl: any) => {
            this.renderer.removeClass(cl, 'selected_side_nav');
        });

        if (e.target.className !== 'menu_item') {
            this.menu[0].text = title;
            this.menu[0].icon = icon;
            this.menu[1].text = bTitle;
            this.menu[1].icon = bIcon;
        } else {
            this.menu[0].text = title;
            this.menu[0].icon = icon;
            this.menu[1].text = bTitle;
            this.menu[1].icon = bIcon;
        }

        if (e.target.className.includes('mat-list-item-content')) {
            if (e.target.offsetParent.offsetParent.className.includes('menu_item_accordian')) {
                this.menu[0].text = bTitle;
                this.menu[0].icon = bIcon;
                this.menu[1].text = title;
                this.menu[1].icon = icon;
            }
        } else {
            if (e.target.offsetParent.offsetParent.offsetParent.className.includes('menu_item_accordian')) {
                this.menu[0].text = bTitle;
                this.menu[0].icon = bIcon;
                this.menu[1].text = title;
                this.menu[1].icon = icon;

            }
        }


        if (e.target.className !== 'mat-list-item-content') {
            if (!e.target.parentElement.parentElement.className.includes('selected_side_nav')) {
                e.target.parentElement.parentElement.className += ' selected_side_nav';
            } else {
                e.target.parentElement.parentElement.className = e.target.parentElement.parentElement.className.replace(' selected_side_nav', '');
            }
        } else {
            if (!e.target.parentElement.className.includes('selected_side_nav')) {
                e.target.parentElement.className += ' selected_side_nav';
            } else {
                e.target.parentElement.className = e.target.parentElement.className.replace(' selected_side_nav', '');
            }
        }

        this.router.navigateByUrl(link);

    }

    toggleBadgeVisibility(){
        this.hidden = true;
        this.menuTile = 'Notifications';
    }

    openMail(){
        this.menuTile = 'Email';
        this.mailIcon = 'drafts';
    }

    searchTrigger(){
        if (this.isMiddleResolution){
            this.active = 'active';
        }

    }

    closeSearch(){
        this.active = '';
    }

    @HostListener('window:resize')
    onWindowResize() {
        if (window.innerWidth < 600){
            this.isMiddleResolution = false;
            this.active = '';
        }else{
            this.openSearch = '';
            this.isMiddleResolution = true;
        }
        // console.log(window.innerWidth);
    }


    toggleSearchBar(){
        if (this.openSearch == ''){
            this.openSearch = 'open';
        }else{
            this.openSearch = '';
        }

    }

    toggleProfile(){
        if (this.show == ''){
            this.show = 'show';
        }else{
            this.show = '';
        }
    }

}
