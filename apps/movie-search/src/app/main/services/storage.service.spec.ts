import {TestBed} from '@angular/core/testing';

import {StorageService} from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const key1 = 'name1';
  const key2 = 'name2';
  const key3 = 'objectItem';
  const item1 = 'item1'
  const item2 = 'item2';
  const item3 = {value: 3};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    let store: { [key: string]: string } = {};
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    jest.spyOn(Storage.prototype, 'getItem')
      .mockImplementation(mockLocalStorage.getItem);
    jest.spyOn(Storage.prototype, 'setItem')
      .mockImplementation(mockLocalStorage.setItem);
    jest.spyOn(Storage.prototype, 'removeItem')
      .mockImplementation(mockLocalStorage.removeItem);
    jest.spyOn(Storage.prototype, 'clear')
      .mockImplementation(mockLocalStorage.clear);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store in localstorage and retrieve stored item', () => {
    service.save(key1, item1);
    expect(JSON.parse(service.get(key1) || '')).toEqual(item1);
  });

  it('should remove stored key from localstorage', () => {
    service.save(key1, item1);
    service.remove(key1);
    expect(service.get(key1)).toBeNull();
  });

  it('should get all stored items as a list', () => {
    service.save(key1, item1);
    service.save(key2, item2);
    service.save(key3, item3);
    expect(service.getAll()).toEqual([item1, item2, item3]);
  });

  it('should clear all saved items', () => {
    service.save(key1, item1);
    service.save(key2, item2);
    service.clear();
    expect(service.getAll()).toEqual([]);
  });

  it('should stringify and save objects', () => {
    service.save(key3, item3);
    expect(service.get(key3)).toEqual(JSON.stringify(item3));
  });

});
