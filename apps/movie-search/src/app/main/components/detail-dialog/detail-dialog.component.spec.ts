import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {DetailDialogComponent} from './detail-dialog.component';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {DIALOG_DETAIL} from "./test-data";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";

describe('DetailDialogComponent', () => {
  let component: DetailDialogComponent;
  let fixture: ComponentFixture<DetailDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatTabsModule, MatDialogModule, NoopAnimationsModule, MatIconModule, MatDividerModule],
      declarations: [DetailDialogComponent],
      providers: [{provide: MAT_DIALOG_DATA, useValue: DIALOG_DETAIL}]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title as movie title', () => {
    const title = fixture.debugElement.nativeElement.querySelector('h2') as HTMLElement;
    expect(title.textContent?.toLowerCase()).toEqual(DIALOG_DETAIL.Title.toLowerCase());
  });
});
