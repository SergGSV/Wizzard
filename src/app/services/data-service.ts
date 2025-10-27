import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {delay, Observable, of} from 'rxjs';
import {DataItem} from '../interfaces/data-item';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://your-api-url.com/api';

  constructor(private http: HttpClient) {}

  // getDataItems(): Observable<DataItem[]> {
  //   return this.http.get<DataItem[]>(`${this.apiUrl}/items`);
  // }

  submitPair(sourceId: number, sinkId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pair`, {
      sourceId,
      sinkId
    });
  }

  getDataItems(): Observable<DataItem[]> {
    const mockData: DataItem[] = [
      {
        id: 1,
        type: 'source',
        name: 'PostgreSQL Database',
        content: 'Production database with customer data'
      },
      {
        id: 2,
        type: 'source',
        name: 'REST API Orders',
        content: 'Order management API endpoint'
      },
      {
        id: 3,
        type: 'source',
        name: 'File Server',
        content: 'Document storage server'
      },
      {
        id: 4,
        type: 'sink',
        name: 'Data Warehouse',
        content: 'Analytics and reporting storage'
      },
      {
        id: 5,
        type: 'sink',
        name: 'Logging System',
        content: 'Centralized logging service'
      },
      {
        id: 6,
        type: 'sink',
        name: 'Backup Storage',
        content: 'Long-term backup solution'
      }
    ];

    return of(mockData).pipe(delay(500));
  }
}
