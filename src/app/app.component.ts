import { Component, ChangeDetectorRef } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

interface Case {
  value: string;
  key: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  baseUrl: string = 'http://localhost:9001'; //'http://107.22.58.206:9000';
  input: string = '';
  selectedValue: any = '0';
  selectedSymbol: string = 'eq';
  showTable2: boolean = false;
  showTable3: boolean = false;
  next: number = 0;
  previous: number = 0;
  useCases: Case[] = [
    { value: '0', key: 'Use Case 1: Wallets having X price' },
    { value: '1', key: 'Use Case 2: Wallets having X nft count' },
    { value: '2', key: 'Use Case 3: Wallets with Search by Token Name' },
    { value: '3', key: 'Use Case 4: Wallets having price in input range' },
    { value: '4', key: 'Use Case 5: Wallets with NFTs specific to community' },
  ];

  symbols: Case[] = [
    { value: 'eq', key: 'Equal To' },
    { value: 'gte', key: 'Greater Than Equal To' },
    { value: 'gt', key: 'Greater Than' },
    { value: 'lte', key: 'Less Than Equal To' },
    { value: 'lt', key: 'Less Than' },
  ];

  result: string[] = [
  ];

  displayedColumns = ['address'];
  displayedColumns1 = ['balance', 'walletAddress'];
  displayedColumns2 = ['name', 'link', 'owner_address', 'token_id'];
  displayedColumns3 = ['collection_name', 'link', 'owner_address', 'token_id'];
  displayedColumns5 = ['owner_address', 'count_id', 'xlink'];

  dataSource = new MatTableDataSource<any>(this.result);
  dataSource1 = new MatTableDataSource<any>([]);
  dataSource2 = new MatTableDataSource<any>([]);
  dataSource4 = new MatTableDataSource<any>([]);
  dataSource5 = new MatTableDataSource<any>([]);
  
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  displayProgressSpinnerInBlock: boolean = false;

  constructor(private http: HttpClient, public dialog:MatDialog) { }

  openDialog(address: string) {
    this.dialog.open(DialogComponent, {
      data: {
        address: address
      },
      height: '800',
      width: '800'
    });
  }

  SendRequest(value: string, page: number) {
    console.log(value);
    console.log(this.selectedValue);
    this.dataSource = new MatTableDataSource<any>([]);
    this.displayProgressSpinnerInBlock = true;
    this.showTable2 = false;
    this.showTable3 = false;
    this.next = 0;
    this.previous = 0;
    if (this.selectedValue == '0') {
      let symbol = this.selectedSymbol;
      this.getWalletAddressesForXPrice(value, symbol, page).subscribe(response => {
        this.dataSource1 = new MatTableDataSource<any>(response.results);
        if (response.next && response.next.page && response.next.page !== '' && response.next.page !== 0) {
          this.next = response.next.page;
        }
        if (response.previous && response.previous.page && response.previous.page !== '' && response.previous.page !== 0) {
          this.previous = response.previous.page;
        }
        this.displayProgressSpinnerInBlock = false;
      });
    } else if(this.selectedValue == '1') {
      this.getWalletAddressesForXNFTCount(value, page, this.selectedSymbol).subscribe(response => {
        this.dataSource5 = new MatTableDataSource<any>(response.results);
        if (response.next && response.next.page && response.next.page !== '' && response.next.page !== 0) {
          this.next = response.next.page;
        }
        if (response.previous && response.previous.page && response.previous.page !== '' && response.previous.page !== 0) {
          this.previous = response.previous.page;
        }
        this.displayProgressSpinnerInBlock = false;
      });
    } else if(this.selectedValue == '2') {
      this.getWalletAddressesForExactNameSearch(value, page).subscribe(response => {
        this.dataSource2 = new MatTableDataSource<any>(response.results); 
        if (response.next && response.next.page && response.next.page !== '' && response.next.page !== 0) {
          this.next = response.next.page;
        }
        if (response.previous && response.previous.page && response.previous.page !== '' && response.previous.page !== 0) {
          this.previous = response.previous.page;
        }
        this.displayProgressSpinnerInBlock = false;
        this.showTable2 = true;
        this.showTable3 = false;
      });
    } else if(this.selectedValue == '3') {
      this.getWalletAddressesForPriceRange(Number(value.split('-')[0]), Number(value.split('-')[1]), page).subscribe(response => {
        this.dataSource = new MatTableDataSource<any>(response.results);
        if (response.next && response.next.page && response.next.page !== '' && response.next.page !== 0) {
          this.next = response.next.page;
        }
        if (response.previous && response.previous.page && response.previous.page !== '' && response.previous.page !== 0) {
          this.previous = response.previous.page;
        }
        this.displayProgressSpinnerInBlock = false;
      });
    } else if(this.selectedValue == '4') {
      this.getWalletAddressesForExactCollectionSearch(value, page).subscribe(response => {
        this.dataSource4 = new MatTableDataSource<any>(response.results);
        if (response.next && response.next.page && response.next.page !== '' && response.next.page !== 0) {
          this.next = response.next.page;
        }
        if (response.previous && response.previous.page && response.previous.page !== '' && response.previous.page !== 0) {
          this.previous = response.previous.page;
        }
        this.displayProgressSpinnerInBlock = false;
        this.showTable2 = false;
        this.showTable3 = true;
      });
    }
  }

  public getWalletAddressesForXPrice(value: string, symbol: string, page: number): Observable<any> {
    const url = this.baseUrl + '/wallet/address?price=' + value + '&symbol=' + symbol + '&limit=50' + (page > 0 ? '&page=' + page : '');
    console.log(url);
    return this.http.get<any>(url);
  }

  public getWalletAddressesForXNFTCount(value: string, page: number, symbol: string): Observable<any> {
    const url = this.baseUrl + '/nfts/address?count=' + value + '&symbol=' + symbol + '&limit=50' + (page > 0 ? '&page=' + page : '');
    console.log(url);
    return this.http.get<any>(url);
  } 
  
  public getWalletAddressesForSearch(value: string, page: number): Observable<any> {
    const url = this.baseUrl + '/nfts/search?p=' + value + '&limit=50' + (page > 0 ? '&page=' + page : '');
    return this.http.get<any>(url);
  }

  public getWalletAddressesForCommunitySpecificSearch(value: string, page: number): Observable<any> {
    const url = this.baseUrl + '/nfts/collection?name=' + value + '&limit=50' + (page > 0 ? '&page=' + page : '');
    return this.http.get<any>(url);
  }

  public getWalletAddressesForPriceRange(min: number, max: number, page: number): Observable<any> {
    const url = this.baseUrl + '/nfts/price?gte=' + min + '&lte=' + max + '&limit=50' + (page > 0 ? '&page=' + page : '');
    return this.http.get<any>(url);
  }

  public getWalletAddressesForExactNameSearch(value: string, page: number): Observable<any> {
    const url = this.baseUrl + '/nfts/name/search?p=' + value + '&limit=50' + (page > 0 ? '&page=' + page : '');
    return this.http.get<any>(url);
  }

  public getWalletAddressesForExactCollectionSearch(value: string, page: number): Observable<any> {
    const url = this.baseUrl + '/nfts/collection/search?p=' + value + '&limit=50' + (page > 0 ? '&page=' + page : '');
    return this.http.get<any>(url);
  }
}

