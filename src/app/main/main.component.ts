import {AfterViewInit, Component, ElementRef, HostListener, Renderer2, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationError, NavigationExtras, NavigationStart, Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../Services/auth.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatMenuTrigger} from '@angular/material/menu';
import {ApplicationTypeService} from '../Services/application-type.service';


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit, OnInit {
    private readonly apiUrl = `${environment.apiUrl}`;
    // title = '';
    title = 'Myunistudy';
    icon = 'dashboard';
    text = 'Dashboard';
    menuIcon = 'close';
    branchName = localStorage.getItem('userBranch');
    branchId = '';
    searchText = '';
    hasClient = '';
    myStyles: any;
    openLiApplication = false;
    openLiBranch = false;
    hasShrunk = false;
    menuTile = '';
    isSuperAdmin = true;
    isAdmin = false;
    showResult = false;
    isClient = false;
    isAdmission = false;
    isManager = false;
    isAgent = false;
    started = false;
    agentCount = 0;
    contactCount = 0;
    reminderCount = 0;
    reminder: any[] = [];
    instituteCount = 0;
    tasksCount = 0;
    assignedClientCount = 0;
    tasks: any[] = [];
    contacts: any[] = [];
    searchContacts: any[] = [];
    assigne: any[] = [];
    itemData: any[] = [];
    active = '';
    applicationTracker: any[] = [];
    errorMessage = '';
    branchCount = 0;
    profile: any = [];
    column = 'col-md-4';
    show = '';
    openSearch = '';
    isMiddleResolution = true;
    menu = [{icon: 'dashboard', text: 'Dashboard'}, {icon: '', text: ''}];
    panelOpenState = false;
    panelOpenStateOther = false;
    panelOpenStateTracker = false;
    @ViewChild('taskMenuTrigger') taskTrigger!: MatMenuTrigger;
    @ViewChild('assigneeMenuTrigger') assignTrigger!: MatMenuTrigger;
    @ViewChild('reminderMenuTrigger') remindTrigger!: MatMenuTrigger;

    constructor(private authService: AuthService,
                private applicationService: ApplicationTypeService,
                public route: ActivatedRoute,
                private router: Router, private renderer: Renderer2, private elRef: ElementRef, private http: HttpClient) {
        this.router.navigate(['dashboard']);
        this.checkRoles();
        this.getReminder('');
        this.getBranchByName();
        if (this.isSuperAdmin || this.isAdmin) {
            this.getBranch();
            this.getAgent();
            this.getAssignedStatus('');
            this.getTasks('');
            this.getInstitute();
            this.getContacts();
            this.getApplicationStat();
        } else if (this.isManager) {
            this.getAgent();
            this.getAssignedStatus('');
            this.getTasks('');
            this.getInstitute();
            this.getContacts();
            this.getApplicationStat();
        } else if (this.isAgent) {
            this.getTasks('');
            this.getAssignedStatus('');
            this.getInstitute();
            this.getContacts();
            this.getApplicationStat();
        }
        this.router.events.subscribe(val => {
            if (val instanceof NavigationStart) {
                const finalUrl = val.url.split('?');
                this.started = true;
                switch (finalUrl[0]) {
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
                    case '/institute/add':
                        const selectedInst = this.elRef.nativeElement.querySelector('.selected_side_nav').nextSibling;
                        if (selectedInst.nextSibling !== null) {
                            const el = this.elRef.nativeElement.querySelectorAll('.menu_item');
                            el.forEach((cl: any) => {
                                this.renderer.removeClass(cl, 'selected_side_nav');
                            });
                            this.renderer.addClass(selectedInst, 'selected_side_nav');
                            this.menu[0].text = 'Institutes';
                            this.menu[0].icon = 'foundation';
                            this.menu[1].text = 'Add Institute';
                            this.menu[1].icon = 'add_circle';
                        }
                        break;

                    case '/institute/all':
                        this.menu[0].text = 'Institutes';
                        this.menu[0].icon = 'foundation';
                        this.menu[1].text = 'All Institute';
                        this.menu[1].icon = 'view_list';
                        break;
                    case '/contacts/add':
                        const selectedCont = this.elRef.nativeElement.querySelector('.selected_side_nav').nextSibling;
                        if (selectedCont.nextSibling !== null) {
                            const el = this.elRef.nativeElement.querySelectorAll('.menu_item');
                            el.forEach((cl: any) => {
                                this.renderer.removeClass(cl, 'selected_side_nav');
                            });
                            this.renderer.addClass(selectedCont, 'selected_side_nav');
                            this.menu[0].text = 'All Contacts';
                            this.menu[0].icon = 'people';
                            this.menu[1].text = 'Add Contact';
                            this.menu[1].icon = 'add_circle';
                        }
                        break;
                    case '/contacts/all':
                        this.menu[0].text = 'All Contacts';
                        this.menu[0].icon = 'people';
                        this.menu[1].text = 'View All';
                        this.menu[1].icon = 'view_list';
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
                    case '/leads/add':
                        const addLeads = this.elRef.nativeElement.querySelector('.add_leads');
                        const elem = this.elRef.nativeElement.querySelectorAll('.menu_item');
                        elem.forEach((cl: any) => {
                            this.renderer.removeClass(cl, 'selected_side_nav');
                        });
                        this.renderer.addClass(addLeads, 'selected_side_nav');
                        this.menu[0].text = 'Leads Manager';
                        this.menu[0].icon = 'groups';
                        this.menu[1].text = 'Add Leads';
                        this.menu[1].icon = 'add_circle';
                        break;
                    case '/application/add':
                        const addApplication = this.elRef.nativeElement.querySelector('.add_application');
                        const elemApplication = this.elRef.nativeElement.querySelectorAll('.menu_item');
                        elemApplication.forEach((cl: any) => {
                            this.renderer.removeClass(cl, 'selected_side_nav');
                        });
                        this.renderer.addClass(addApplication, 'selected_side_nav');
                        this.menu[0].text = 'Application';
                        this.menu[0].icon = 'school';
                        this.menu[1].text = 'Add Application';
                        this.menu[1].icon = 'add_circle';
                        break;
                    case '/leads':
                        const viewLeads = this.elRef.nativeElement.querySelector('.view_leads');
                        const view = this.elRef.nativeElement.querySelectorAll('.menu_item');
                        view.forEach((cl: any) => {
                            this.renderer.removeClass(cl, 'selected_side_nav');
                        });
                        this.renderer.addClass(viewLeads, 'selected_side_nav');
                        this.menu[0].text = 'Leads Manager';
                        this.menu[0].icon = 'groups';
                        this.menu[1].text = '';
                        this.menu[1].icon = '';
                        break;
                    case '/application':
                        const application = this.elRef.nativeElement.querySelector('.view_application');
                        const app = this.elRef.nativeElement.querySelectorAll('.menu_item');
                        app.forEach((cl: any) => {
                            this.renderer.removeClass(cl, 'selected_side_nav');
                        });
                        this.renderer.addClass(application, 'selected_side_nav');
                        this.menu[0].text = 'Application Manager';
                        this.menu[0].icon = 'school';
                        this.menu[1].text = '';
                        this.menu[1].icon = '';
                        break;
                    case '/leads/tracker':
                        const trackLeads = this.elRef.nativeElement.querySelector('.track_leads');
                        const track = this.elRef.nativeElement.querySelectorAll('.menu_item');
                        track.forEach((cl: any) => {
                            this.renderer.removeClass(cl, 'selected_side_nav');
                        });
                        this.renderer.addClass(trackLeads, 'selected_side_nav');
                        this.menu[0].text = 'Leads Manager';
                        this.menu[0].icon = 'groups';
                        this.menu[1].text = 'Leads Tracker';
                        this.menu[1].icon = 'leaderboard';
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
                    case '/institute/view':
                        this.menu[0].text = 'Institutes';
                        this.menu[0].icon = 'foundation';
                        this.menu[1].text = 'Institute';
                        this.menu[1].icon = 'remove_red_eye';
                        break;
                    case '/contacts/view':
                        this.menu[0].text = 'Contacts';
                        this.menu[0].icon = 'people';
                        this.menu[1].text = 'Contact';
                        this.menu[1].icon = 'remove_red_eye';
                        break;
                    case '/tasks':
                        const el = this.elRef.nativeElement.querySelectorAll('.menu_item');
                        el.forEach((cl: any) => {
                            this.renderer.removeClass(cl, 'selected_side_nav');
                        });
                        const sel = this.elRef.nativeElement.querySelector('.task_manager');
                        this.renderer.addClass(sel, 'selected_side_nav');
                        this.menu[0].text = 'Task Manager';
                        this.menu[0].icon = 'task';
                        this.menu[1].text = '';
                        this.menu[1].icon = '';
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

    ngAfterViewInit(): void {
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
            const profile = this.elRef.nativeElement.querySelector('.profile');
            const dropdown = this.elRef.nativeElement.querySelector('.dropdown-menu');
            const mobileSearch = this.elRef.nativeElement.querySelector('.search-icon');
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


    toggleNav(drawer: any): any {
        const el = drawer._elementRef.nativeElement;
        const _el = this.elRef.nativeElement.querySelector('.drawer_content');
        const __el = this.elRef.nativeElement.querySelectorAll('.menu_title');
        const __el_ = this.elRef.nativeElement.querySelectorAll('.menu_badge');
        const __el__ = this.elRef.nativeElement.querySelectorAll('.mat-expansion-indicator');
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

    changeRoute(e: any, bTitle: string, bIcon: string, title: string, link: string, icon: string, id: any): any {
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
            if (id === null) {
                this.router.navigateByUrl(link);
            } else {
                const navigationExtras: NavigationExtras = {
                    queryParams: {id: id}
                };
                this.router.navigate([link], navigationExtras);
            }

        }


    }

    toggleBadgeVisibility(): void {
        this.getReminder('open');

    }

    openMail(): void {
        this.getTasks('open');

    }

    openAssignee(): void {
        this.getAssignedStatus('open');

    }

    getApplicationStat(): void {
        this.http.get<any>(this.apiUrl + 'applicationType/').subscribe({
            next: data => {
                this.applicationTracker = data.data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    searchTrigger(): void {
        if (this.isMiddleResolution) {
            this.active = 'active';
        }

        this.searchText = '';
        this.getClients();

    }


    searchClient(e: any): void {
        this.searchText = e;
        if (e !== '') {
            this.hasClient = 'has_client';
            this.showResult = true;

            this.searchContacts = this.contacts.filter((contact: any) => {
                return contact.name.toLowerCase().includes(e.toLowerCase());
            });

            if (this.searchContacts.length === 0) {
                this.hasClient = '';
            }
        } else {
            this.hasClient = '';
            this.showResult = false;
        }
    }

    closeSearch(): void {
        this.active = '';
        this.showResult = false;
    }

    @HostListener('window:resize')
    onWindowResize(): void {
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


    toggleSearchBar(): void {
        if (this.openSearch === '') {
            this.openSearch = 'open';
        } else {
            this.openSearch = '';
        }

    }

    toggleProfile(): any {
        if (this.show === '') {
            if (!this.isAgent) {
                this.getUsers();
            } else {
                this.getAgents();
            }

            const _pel = this.elRef.nativeElement.querySelector('.dropdown-menu-right');
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

    getAssignedStatus(openMenu: any): any {
        this.http.get<any>(this.apiUrl + 'status/').subscribe({
            next: data => {
                this.assigne = data.data.filter((status: any) => {
                    return status.assigned_to === localStorage.getItem('userName');
                });

                this.assignedClientCount = this.assigne.length;

                this.assigne.forEach((cl: any, index: any) => {
                    this.http.get<any>(this.apiUrl + 'users/' + cl.client_id).subscribe({
                        next: res => {
                            // console.log(res);
                            cl.client_name = res.data.name;
                        },
                        error: error => {
                            this.errorMessage = error.message;
                        }
                    });
                });

                this.menuTile = 'You have ' + this.assignedClientCount + ' assigned clients';
                this.itemData = this.assigne;

                if (openMenu === 'open') {
                    this.assignTrigger.openMenu();
                }

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    getContacts(): any {
        this.http.get<any>(this.apiUrl + 'users/').subscribe({
            next: data => {
                if (this.isSuperAdmin || this.isAdmin) {
                    this.contactCount = data.data.filter((contact: any) => {
                        return (contact.name !== localStorage.getItem('userName'));
                    }).length;

                } else {
                    this.contactCount = data.data.filter((contact: any) => {
                        return (contact.role === 'Client');
                    }).length;

                }

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    getClients(): any {
        this.http.get<any>(this.apiUrl + 'users/').subscribe({
            next: data => {
                this.contacts = data.data.filter((contact: any) => {
                    return (contact.role === 'Client');
                });
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

    getAgents(): any {
        this.http.get<any>(this.apiUrl + 'agent/' + this.authService.userId).subscribe({
            next: data => {
                this.show = 'show';
                this.profile = data.data;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    getInstitute(): any {
        this.http.get<any>(this.apiUrl + 'institute/').subscribe({
            next: data => {
                this.instituteCount = data.data.length;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    ngOnInit(): void {
        this.myStyles = {height: window.innerHeight + 'px'};
        this.applicationService.onNavChanged.subscribe((type) => {
            // console.log(type);
          this.changeNav(type);
        });
        this.applicationService.onFormSubmitted.subscribe(() => {
            this.getApplicationStat();
        });
    }

    changeNav(type: any): any{
        this.panelOpenStateTracker = true;
        const el = this.elRef.nativeElement.querySelectorAll('.menu_item');
        el.forEach((cl: any) => {
            this.renderer.removeClass(cl, 'selected_side_nav');
        });

        const mainClass = '.list_' + type._id;
        const sel = this.elRef.nativeElement.querySelector(mainClass);
        this.renderer.addClass(sel, 'selected_side_nav');
        this.menu[0].text = 'Application';
        this.menu[0].icon = 'school';
        this.menu[1].text = type.title;
        this.menu[1].icon = 'history_edu';
    }

    private checkRoles(): any {
        const userRoles = localStorage.getItem('userRole');
        switch (userRoles) {
            case 'Super Admin':
                this.isSuperAdmin = true;
                this.isAdmin = false;
                this.isAdmission = false;
                this.isClient = false;
                this.isAgent = false;
                this.isManager = false;
                break;
            case 'Admin':
                this.isSuperAdmin = false;
                this.isAdmin = true;
                this.isAdmission = false;
                this.isClient = false;
                this.isAgent = false;
                this.isManager = false;
                break;
            case 'Manager':
                this.isSuperAdmin = false;
                this.isAdmin = false;
                this.isAdmission = false;
                this.isClient = false;
                this.isAgent = false;
                this.isManager = true;
                break;
            case 'Admission Core':
                this.isSuperAdmin = false;
                this.isAdmin = false;
                this.isAdmission = true;
                this.isClient = false;
                this.isAgent = false;
                this.isManager = false;
                break;
            case 'Client':
                this.isSuperAdmin = false;
                this.isAdmin = false;
                this.isAdmission = false;
                this.isClient = true;
                this.isAgent = false;
                this.isManager = false;
                break;
            case 'agent':
                this.isSuperAdmin = false;
                this.isAdmin = false;
                this.isAdmission = false;
                this.isClient = false;
                this.isAgent = true;
                this.isManager = false;
                break;
        }
    }

    private getTasks(openMenu: any): any {
        this.http.get<any>(this.apiUrl + 'tasks/').subscribe({
            next: data => {
                this.tasks = data.data.filter((task: any) => {
                    if (task.user !== '' || task.client !== '') {
                        return (task.user.includes(localStorage.getItem('userId')) ||
                            task.client.includes(localStorage.getItem('userId')));
                    } else if (task.branch !== '' || task.client !== '') {
                        return (task.branch.includes(this.branchId) ||
                            task.client.includes(localStorage.getItem('userId')));
                    }
                });

                this.tasks = this.tasks.filter((task: any) => {
                    return task.isCompleted !== true;
                });
                this.tasksCount = this.tasks.length;

                this.menuTile = 'You have ' + this.tasksCount + ' tasks assigned';
                this.itemData = this.tasks;

                if (openMenu === 'open') {
                    this.taskTrigger.openMenu();
                }

            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    private getReminder(openMenu: any): any {
        this.http.get<any>(this.apiUrl + 'notes/').subscribe({
            next: data => {
                this.reminder = data.data.filter((remind: any) => {
                    return remind.isComplete === false;
                });

                this.reminder = this.reminder.filter((remind: any) => {
                    return remind.reminder === true;
                });

                this.reminder = this.reminder.filter((remind: any) => {
                    return remind.added_by === localStorage.getItem('userName') || remind.client_id === localStorage.getItem('userId');
                });


                this.reminderCount = this.reminder.length;

                this.menuTile = 'You have ' + this.reminderCount + ' upcoming reminder';
                this.itemData = this.reminder;

                if (openMenu === 'open') {
                    this.remindTrigger.openMenu();
                }


            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    private getBranchByName(): any {
        this.http.get<any>(this.apiUrl + 'branch/getBranch/' + this.branchName).subscribe({
            next: data => {
                this.branchId = data.data[0]._id;
            },
            error: error => {
                this.errorMessage = error.message;
            }
        });
    }

    navigateToView(nav: string): any {
        switch (nav) {
            case 'tasks':
                this.router.navigate(['/tasks']);
                break;
            case 'client':
                this.panelOpenState = true;
                const selectedContact = this.elRef.nativeElement.querySelector('.view_contacts');
                const el = this.elRef.nativeElement.querySelectorAll('.menu_item');
                el.forEach((cl: any) => {
                    this.renderer.removeClass(cl, 'selected_side_nav');
                });
                this.renderer.addClass(selectedContact, 'selected_side_nav');
                this.router.navigate(['/contacts/all']);
                break;
        }
    }

    navigateToContact(clientId: string, type: string): any {
        this.hasClient = '';
        const navigationExtras: NavigationExtras = {
            queryParams: {id: clientId}
        };
        this.router.navigate(['contacts/view'], navigationExtras);
        this.panelOpenState = true;
        const selectedContact = this.elRef.nativeElement.querySelector('.view_contacts');
        const el = this.elRef.nativeElement.querySelectorAll('.menu_item');
        el.forEach((cl: any) => {
            this.renderer.removeClass(cl, 'selected_side_nav');
        });
        this.renderer.addClass(selectedContact, 'selected_side_nav');

        if (type === 'search') {
            this.searchText = '';
            this.showResult = false;
            this.active = '';
        }
    }
}
