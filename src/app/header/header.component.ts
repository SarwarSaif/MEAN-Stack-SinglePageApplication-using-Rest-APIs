import {Component, OnInit, OnDestroy} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  // Inject the authService by creating  constructor
  constructor(private authService: AuthService) {}

  // To subscribe into the observable
  ngOnInit() {
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAutheticated => {
        this.userIsAuthenticated = isAutheticated;
      });
  }

  // To destroy the observable
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
