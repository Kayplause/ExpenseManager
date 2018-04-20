import { TestBed, inject } from '@angular/core/testing';

import { ExpenseItemService } from './expense-item.service';

describe('ExpenseItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseItemService]
    });
  });

  it('should be created', inject([ExpenseItemService], (service: ExpenseItemService) => {
    expect(service).toBeTruthy();
  }));
});
