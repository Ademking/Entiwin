import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmobileComponent } from './ismobile.component';

describe('IsmobileComponent', () => {
  let component: IsmobileComponent;
  let fixture: ComponentFixture<IsmobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IsmobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
