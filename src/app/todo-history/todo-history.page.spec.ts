import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoHistoryPage } from './todo-history.page';

describe('TodoHistoryPage', () => {
  let component: TodoHistoryPage;
  let fixture: ComponentFixture<TodoHistoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoHistoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
