import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  baseUrl: string = 'http://localhost:9001'; //'http://107.22.58.206:9000';
  next: number = 0;
  previous: number = 0;
  displayedColumns11 = ['name', 'collection_name', 'permalink'];

  dataSource11 = new MatTableDataSource<any>([{ name: '', collection_name: '', permalink: ''}]);

  constructor(private http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.getNFTNames(this.data.address, 0).subscribe(response => {
      this.dataSource11 = new MatTableDataSource<any>(response.results);
      if (response.next && response.next.page && response.next.page !== '' && response.next.page !== 0) {
        this.next = response.next.page;
      }
      if (response.previous && response.previous.page && response.previous.page !== '' && response.previous.page !== 0) {
        this.previous = response.previous.page;
      }
    });
  }

  public fetchNFTNames(page: number) {
    this.next = 0;
    this.previous = 0;
    this.getNFTNames(this.data.address, page).subscribe(response => {
      this.dataSource11 = new MatTableDataSource<any>(response.results);
      if (response.next && response.next.page && response.next.page !== '' && response.next.page !== 0) {
        this.next = response.next.page;
      }
      if (response.previous && response.previous.page && response.previous.page !== '' && response.previous.page !== 0) {
        this.previous = response.previous.page;
      }
    });
  }

  public getNFTNames(value: string, page: number): Observable<any> {
    const url = this.baseUrl + '/nfts/address/name?address=' + value + (page > 0 ? '&page=' + page : '');
    console.log(url);
    return this.http.get<any>(url);
  } 
}
