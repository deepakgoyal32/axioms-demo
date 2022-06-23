import { Component, ChangeDetectorRef } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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
  input: string = '';
  selectedValue: any = '0';
  selectedSymbol: string = 'eq';
  showTable2: boolean = false;
  showTable3: boolean = false;
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

  displayedColumns = ['walletAddress'];
  displayedColumns1 = ['balance', 'walletAddress'];
  displayedColumns2 = ['name', 'link', 'owner_address', 'token_id'];
  displayedColumns3 = ['collection_name', 'link', 'owner_address', 'token_id'];

  dataSource = new MatTableDataSource<any>(this.result);
  dataSource1 = new MatTableDataSource<any>([]);
  dataSource2 = new MatTableDataSource<any>([]);
  dataSource4 = new MatTableDataSource<any>([]);
  
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  displayProgressSpinnerInBlock: boolean = false;

  constructor(private http: HttpClient) { }

  SendRequest(value: string) {
    console.log(value);
    console.log(this.selectedValue);
    this.dataSource = new MatTableDataSource<any>([]);
    this.displayProgressSpinnerInBlock = true;
    this.showTable2 = false;
    this.showTable3 = false;
    if (this.selectedValue == '0') {
      let symbol = this.selectedSymbol;
      this.getWalletAddressesForXPrice(value, symbol).subscribe(response => {
        this.dataSource1 = new MatTableDataSource<any>(response.results);
        this.displayProgressSpinnerInBlock = false;
      });
    } else if(this.selectedValue == '1') {
      this.getWalletAddressesForXNFTCount(value).subscribe(response => {
        this.dataSource = new MatTableDataSource<any>(response.map(obj => obj.address));
        this.displayProgressSpinnerInBlock = false;
      });
    } else if(this.selectedValue == '2') {
      this.getWalletAddressesForExactNameSearch(value).subscribe(response => {
        this.dataSource2 = new MatTableDataSource<any>(response);
        this.displayProgressSpinnerInBlock = false;
        this.showTable2 = true;
        this.showTable3 = false;
      });
    } else if(this.selectedValue == '3') {
      this.getWalletAddressesForPriceRange(Number(value.split('-')[0]), Number(value.split('-')[1])).subscribe(response => {
        this.dataSource = new MatTableDataSource<any>(response);
        this.displayProgressSpinnerInBlock = false;
      });
    } else if(this.selectedValue == '4') {
      this.getWalletAddressesForExactCollectionSearch(value).subscribe(response => {
        this.dataSource4 = new MatTableDataSource<any>(response);
        this.displayProgressSpinnerInBlock = false;
        this.showTable2 = false;
        this.showTable3 = true;
      });
    }
  }

  public getWalletAddressesForXPrice(value: string, symbol: string): Observable<any> {
    const url = 'http://107.22.58.206:9000/wallet/address?price=' + value + '&symbol=' + symbol;
    console.log(url);
    return this.http.get<any>(url);
  }

  public getWalletAddressesForXNFTCount(value: string): Observable<any> {
    const url = 'http://107.22.58.206:9000/nfts/address?count=' + value;
    return this.http.get<any>(url);
  } 
  
  public getWalletAddressesForSearch(value: string): Observable<any> {
    const url = 'http://107.22.58.206:9000/nfts/search?p=' + value;
    return this.http.get<any>(url);
  }

  public getWalletAddressesForCommunitySpecificSearch(value: string): Observable<any> {
    const url = 'http://107.22.58.206:9000/nfts/collection?name=' + value;
    return this.http.get<any>(url);
  }

  public getWalletAddressesForPriceRange(min: number, max: number): Observable<any> {
    const url = 'http://107.22.58.206:9000/nfts/price?gte=' + min + '&lte=' + max;
    return this.http.get<any>(url);
  }

  public getWalletAddressesForExactNameSearch(value: string): Observable<any> {
    const url = 'http://107.22.58.206:9000/nfts/name/search?p=' + value;
    return this.http.get<any>(url);
  }

  public getWalletAddressesForExactCollectionSearch(value: string): Observable<any> {
    const url = 'http://107.22.58.206:9000/nfts/collection/search?p=' + value;
    return this.http.get<any>(url);
  }
}

