import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../../data/services/config.service';
import { SEOService } from '../../../../data/services/seo.service';
import { UserManagerService } from '../../../../data/services/administrator/user-manager.service';
import { FormGroup, FormControl } from '@angular/forms';
import { RoutingService } from 'src/app/data/helpers/routing.service';
import { AdminAuthService } from 'src/app/data/services/admin-auth.service';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss']
})
export class UserListingComponent implements OnInit {
  isLoading = true;
  isLoadMore = false;
  currencyObj: any;
  customers = [];
  customerCounts = 0;
  customerStatus = 'all';
  pageLimit = 50;
  currPage = 1;
  isRootAdmin = false;

  // isSearching = false;

  adm: any;

  form = new FormGroup({
    keywords: new FormControl('', []),
  });

  constructor(
    private rout: RoutingService,
    private configService: ConfigService,
    private seoService: SEOService,
    private userManagerService: UserManagerService,
    private adminAuthService: AdminAuthService,
  ) { }

  get adminUrl() {
    return this.configService.adminURL;
  }

 

  ngOnInit() {
    const status = this.rout.activeRoute;
    if (status) {
      if(status == 'user-manager'){
        this.customerStatus = 'all';
      } else {
        this.customerStatus = status;
      }
    }
    // this.getQuery();
    this.seoUpdate();
    this.getCustomers();
    this.updateAuth();
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.adm = res;
        const data = this.configService.isRootAdmin(res);
        if (data) {
          this.isRootAdmin = true;
        }
      }
    });
  }

  private getCustomers(isMore = false) {
    this.userManagerService.getCustomers(
      this.customerStatus, this.pageLimit, this.currPage
    ).subscribe(res => {
      console.log(res)
      if (res) {
        if (isMore) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.customers.push(res.data.data[i]);            
          }
        } else {
          this.customers = res.data.data;
        }
        this.customerCounts = res.data.counts;
      }
      this.isLoadMore = false;
      this.isLoading = false;
    });
  }

  private seoUpdate() {
    this.seoService.updateTitle('All Users');
    this.seoService.updateDescription('All Users');
  }

  // private getStatus() {
  //   this.userManagerService.getStatus.subscribe(res => {
  //     if (res) {
  //       this.customerStatus = res;
  //       this.getCustomers();
  //     }
  //   });
  // }

  loadMore(){
    this.isLoadMore = true;
    if (this.customerCounts > this.customers.length) {
      this.currPage++;
      this.getCustomers(true);
    }
  }

  // submit() {
  //   this.isSearching = true;
  //   const data = this.form.value.keywords;
  //   this.userManagerService.search(data).subscribe(res => {
  //     if(res){
  //       this.customers = res.data;
  //       this.customerCounts = res.counts;
  //     } else {
  //       this.customers = [];
  //     }
  //     this.isSearching = false;
  //   })
  // }

}
