import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {MAT_DATE_FORMATS} from "@angular/material/core";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatBadgeModule} from "@angular/material/badge";
import {MockComponents} from "ng-mocks";
import {FavoritesComponent} from "../../components/favorites/favorites.component";
import {MovieCardComponent} from "../../components/movie-card/movie-card.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {Subject} from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  // const movieServiceSpy = createSpyObj('MovieService', ['getDetail', 'onScroll', 'search']);
  const snackbarStub = {open: jest.fn()};
  // const storageServiceSpy = createSpyObj('StorageService', ['save', 'clear', 'remove', 'getAll', 'hasKey', 'get']);
  const storageServiceStub = {maxLimit: new Subject(), getAll: jest.fn()};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, ...MockComponents(FavoritesComponent, MovieCardComponent)],
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDialogModule, MatMomentDateModule,
        MatSnackBarModule, MatIconModule,
        HttpClientTestingModule, MatBadgeModule,
        MatExpansionModule, MatProgressSpinnerModule,
        MatDatepickerModule, MatSelectModule, FlexLayoutModule,
        MatFormFieldModule, MatInputModule, InfiniteScrollModule
      ],
      providers: [{
        provide: MAT_DATE_FORMATS, useValue: {
          parse: {
            dateInput: 'YYYY',
          },
          display: {
            dateInput: 'YYYY',
            monthYearLabel: 'YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'YYYY',
          },
        }
      }]
    }).compileComponents();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
