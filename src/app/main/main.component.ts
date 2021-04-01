import {AfterViewInit, Component, ElementRef, HostListener, Renderer2, OnInit} from '@angular/core';
import {NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../Services/auth.service';


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit, OnInit {
    private readonly apiUrl = `${environment.apiUrl}`;
    // title = '';
    title = 'Ample Education';
    icon = 'dashboard';
    text = 'Dashboard';
    menuIcon = 'close';
    hidden = false;
    myStyles: any;
    openLiApplication = false;
    openLiBranch = false;
    hasShrunk = false;
    menuTile = '';
    started = false;
    agentCount = 0;
    active = '';
    errorMessage = '';
    branchCount = 0;
    profile: any = [];
    column = 'col-md-4';
    show = '';
    openSearch = '';
    isMiddleResolution = true;
    menu = [{icon: 'dashboard', text: 'Dashboard'}, {icon: '', text: ''}];
    panelOpenState = false;

    constructor(private authService: AuthService, private router: Router, private renderer: Renderer2, private elRef: ElementRef, private http: HttpClient) {
        this.router.navigate(['dashboard']);
        this.getBranch();
        this.getAgent();
        this.router.events.subscribe(val => {
            if (val instanceof NavigationStart) {
                this.started = true;
                switch (val.url) {
                    case '/profile-details':
                        this.menu[0].text = 'Profile Details';
                        this.menu[0].icon = 'groups';
                        this.menu[1].text = '';
                        this.menu[1].icon = '';
                        break;

                    case '/branch/add':
                        const selected = this.elRef.nativeElement.querySelector('.selected_side_nav').nextSibling;
                        if (selected.nextSibling !== null) {
                            const el = this.elRef.nativeElement.querySelectorAll('.menu_item');
                            el.forEach((cl: any) => {
                                this.renderer.removeClass(cl, 'selected_side_nav');
                            });
                            this.renderer.addClass(selected, 'selected_side_nav');
                            this.menu[0].text = 'Branch Manager';
                            this.menu[0].icon = 'account_tree';
                            this.menu[1].text = 'Add Branch';
                            this.menu[1].icon = 'add_circle';
                        }
                        break;

                    case '/branch/all':
                        this.menu[0].text = 'Branch Manager';
                        this.menu[0].icon = 'account_tree';
                        this.menu[1].text = 'All Branches';
                        this.menu[1].icon = 'view_list';
                        break;
                    case '/agent/add':
                        const selectedAgent = this.elRef.nativeElement.querySelector('.selected_side_nav').nextSibling;
                        if (selectedAgent.nextSibling !== null) {
                            const el = this.elRef.nativeElement.querySelectorAll('.menu_item');
                            el.forEach((cl: any) => {
                                this.renderer.removeClass(cl, 'selected_side_nav');
                            });
                            this.renderer.addClass(selectedAgent, 'selected_side_nav');
                            this.menu[0].text = 'Agent';
                            this.menu[0].icon = 'support_agent';
                            this.menu[1].text = 'Add Agent';
                            this.menu[1].icon = 'add_circle';
                        }
                        break;
                    case '/agent/all':
                        this.menu[0].text = 'Agents';
                        this.menu[0].icon = 'support_agent';
                        this.menu[1].text = 'All Agents';
                        this.menu[1].icon = 'view_list';
                        break;
                    case '/agent/view':
                        this.menu[0].text = 'Agents';
                        this.menu[0].icon = 'support_agent';
                        this.menu[1].text = 'Agent';
                        this.menu[1].icon = 'remove_red_eye';
                        break;
                }
                // Show loading indicator
            }

            if (val instanceof NavigationEnd) {
                this.started = false;
                // Hide loading indicator
            }

            if (val instanceof NavigationError) {
                // Hide loading indicator

                // Present error to user
            }
        });
    }

    ngAfterViewInit() {
        const el = this.elRef.nativeElement.querySelector('.menu_item');
        this.renderer.addClass(el, 'selected_side_nav');
        if (window.innerWidth < 1000) {
            this.isMiddleResolution = false;
            this.active = '';
        } else {
            this.openSearch = '';
            this.isMiddleResolution = true;
        }

        this.renderer.listen('window', 'click', (e: Event) => {
            let profile = this.elRef.nativeElement.querySelector('.profile');
            let dropdown = this.elRef.nativeElement.querySelector('.dropdown-menu');
            let mobileSearch = this.elRef.nativeElement.querySelector('.search-icon');
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

            if (!mobileSearch.contains(e.target)) {
                this.openSearch = '';
            }
        });

    }


    toggleNav(drawer: any) {
        let el = drawer._elementRef.nativeElement;
        let _el = this.elRef.nativeElement.querySelector('.drawer_content');
        let __el = this.elRef.nativeElement.querySelectorAll('.menu_title');
        let __el_ = this.elRef.nativeElement.querySelectorAll('.menu_badge');
        let __el__ = this.elRef.nativeElement.querySelectorAll('.mat-expansion-indicator');
        if (!drawer._elementRef.nativeElement.className.includes('side_nav_close')) {
            this.title = '';
            this.hasShrunk = true;
            this.renderer.addClass(el, 'side_nav_close');
            this.renderer.setStyle(_el, 'width', '96%');
            __el.forEach((object: any) => {
                this.renderer.setStyle(object, 'display', 'none');
            });

            __el_.forEach((object: any) => {
                this.renderer.setStyle(object, 'display', 'none');
            });

            __el__.forEach((object: any) => {
                this.renderer.setStyle(object, 'display', 'none');
            });
            this.menuIcon = 'menu';
            this.column = 'col-md-5';

        } else {
            this.title = 'Ample Education';
            this.hasShrunk = false;
            this.renderer.removeClass(el, 'side_nav_close');
            this.renderer.setStyle(_el, 'width', '83%');
            __el.forEach((object: any) => {
                this.renderer.setStyle(object, 'display', 'block');
            });

            __el_.forEach((object: any) => {
                this.renderer.setStyle(object, 'display', 'block');
            });

            __el__.forEach((object: any) => {
                this.renderer.setStyle(object, 'display', 'block');
            });
            this.menuIcon = 'close';
            this.column = 'col-md-4';
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

        if (link !== '') {
            this.router.navigateByUrl(link);
        }


    }

    toggleBadgeVisibility() {
        this.hidden = true;
        this.menuTile = 'Notifications';
    }

    openMail() {
        this.menuTile = 'Events';
    }

    searchTrigger() {
        if (this.isMiddleResolution) {
            this.active = 'active';
        }

    }

    closeSearch() {
        this.active = '';
    }

    @HostListener('window:resize')
    onWindowResize() {
        if (window.innerWidth < 1000) {
            this.isMiddleResolution = false;
            this.active = '';
        } else {
            this.openSearch = '';
            this.isMiddleResolution = true;
        }

        this.myStyles = {height: window.innerHeight + 'px'};
        // console.log(window.innerWidth);
    }


    toggleSearchBar() {
        if (this.openSearch === '') {
            this.openSearch = 'open';
        } else {
            this.openSearch = '';
        }

    }

    toggleProfile(): any {
        if (this.show === '') {
            this.getUsers();
            let _pel = this.elRef.nativeElement.querySelector('.dropdown-menu-right');
            if (this.hasShrunk) {
                this.renderer.setStyle(_pel, 'left', '69.5%');
            } else {
                this.renderer.setStyle(_pel, 'left', '56.5%');
            }
        } else {
            this.show = '';
        }
    }

    getUsers(): any {
        this.http.get<any>(this.apiUrl + 'users/' + this.authService.userId).subscribe({
            next: data => {
                this.show = 'show';
                this.profile = data.data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    getBranch(): any {
        this.http.get<any>(this.apiUrl + 'branch/').subscribe({
            next: data => {
                this.branchCount = data.data.length;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    getAgent(): any {
        this.http.get<any>(this.apiUrl + 'agent/').subscribe({
            next: data => {
                this.agentCount = data.data.length;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    ngOnInit(): void {
        this.myStyles = {height: window.innerHeight + 'px'};
    }

}
