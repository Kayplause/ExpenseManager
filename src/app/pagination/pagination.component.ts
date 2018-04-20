import { GeneralService } from './../services/general.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})

export class PaginationComponent implements OnInit {

  itemsNum = { value: null };
  all_items: any[] = [];
  paginated_items: any[] = [];
  pages: any[] = [];
  currentPage: number;
  lastPage: number;
  perPage = 10;
  itemsToPaginate = [];

  constructor(private generalService: GeneralService) { }

  ngOnInit() {
    this.paginateFun();
  }

  paginateFun() {
    const res = this.itemsToPaginate;
    if (res && res !== null) {
      const allCount = res.length;
      allCount > 200 ? this.perPage = 50 : (allCount > 100 ? this.perPage = 20 : this.perPage = 10);
      this.itemsNum.value = this.perPage;
      if (allCount <= this.perPage) {
        this.paginated_items = res;
      } else {
        this.all_items = res;
        this.paginate(this.all_items, 1);
      }
    }
  }

  prevPaginate() {
    if (this.currentPage > 1) {
      const needle = this.currentPage - 1;
      this.toPage(needle);
    }
  }

  nextPaginate() {
    if (this.lastPage > this.currentPage) {
      const needle = this.currentPage + 1;
      this.toPage(needle);
    }
  }

  setPaginationCount(count) {
    this.perPage = parseFloat(count);
    this.paginate(this.all_items, 1);
  }

  paginate(array, needle) {
    this.pages = [];
    this.lastPage = Math.ceil(array.length / this.perPage);
    for (let i = 1; i <= this.lastPage; i++) {
      this.pages.push(i);
    }
    this.toPage(needle);
  }

  toPage(id) {
    this.currentPage = id;
    const countStart = (id - 1) * this.perPage;
    const countEnd = countStart + this.perPage;
    const res = this.all_items.slice(countStart, countEnd);
    this.paginated_items = res;
    window.sessionStorage.setItem('pI', JSON.stringify(res));
  }

}
