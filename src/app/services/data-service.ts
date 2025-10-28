import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import {DataItem} from '../interfaces/data-item';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://your-api-url.com/api';

  constructor(private http: HttpClient) {}

  getDataItems(): Observable<DataItem[]> {
    const mockData: DataItem[] = [
      {
        id: 1,
        type: 'source',
        name: 'sql-source',
        content: 'cpg.call.name(".*param.*|.*body.*|.*query.*")'
      },
      {
        id: 2,
        type: 'source',
        name: 'query example #1',
        content: 'cpg.call.name(".*select.*|.*insert.*|.*update.*")'
      },
      {
        id: 3,
        type: 'source',
        name: 'query example #2',
        content: 'cpg.call.name(".*request.*|.*response.*|.*api.*")'
      },
      {
        id: 4,
        type: 'source',
        name: 'File Reader',
        content: 'cpg.call.name(".*read.*|.*open.*|.*file.*")'
      },
      {
        id: 5,
        type: 'source',
        name: 'Kafka Consumer',
        content: 'cpg.call.name(".*consume.*|.*poll.*|.*kafka.*")'
      },
      {
        id: 6,
        type: 'source',
        name: 'Redis Cache',
        content: 'cpg.call.name(".*get.*|.*hget.*|.*redis.*")'
      },
      {
        id: 7,
        type: 'source',
        name: 'MongoDB Collection',
        content: 'cpg.call.name(".*find.*|.*aggregate.*|.*mongo.*")'
      },
      {
        id: 8,
        type: 'source',
        name: 'GraphQL Query',
        content: 'cpg.call.name(".*query.*|.*graphql.*|.*resolve.*")'
      },
      {
        id: 9,
        type: 'source',
        name: 'MQTT Subscriber',
        content: 'cpg.call.name(".*subscribe.*|.*mqtt.*|.*message.*")'
      },
      {
        id: 10,
        type: 'source',
        name: 'WebSocket Stream',
        content: 'cpg.call.name(".*ws.*|.*websocket.*|.*onmessage.*")'
      },
      {
        id: 11,
        type: 'sink',
        name: 'sql-sink',
        content: 'cpg.call.name(".*query.*|.*exec.*|.*prepare.*|.*run.*")'
      },
      {
        id: 12,
        type: 'sink',
        name: 'bgb',
        content: 'cpg.call.name(".*execute.*|.*query.*|.*insert.*")'
      },
      {
        id: 13,
        type: 'sink',
        name: 'File Writer',
        content: 'cpg.call.name(".*write.*|.*save.*|.*create.*")'
      },
      {
        id: 14,
        type: 'sink',
        name: 'Kafka Producer',
        content: 'cpg.call.name(".*send.*|.*produce.*|.*kafka.*")'
      },
      {
        id: 15,
        type: 'sink',
        name: 'Redis Writer',
        content: 'cpg.call.name(".*set.*|.*hset.*|.*redis.*")'
      },
      {
        id: 16,
        type: 'sink',
        name: 'Elasticsearch Index',
        content: 'cpg.call.name(".*index.*|.*bulk.*|.*elastic.*")'
      },
      {
        id: 17,
        type: 'sink',
        name: 'S3 Storage',
        content: 'cpg.call.name(".*put.*|.*upload.*|.*s3.*")'
      },
      {
        id: 18,
        type: 'sink',
        name: 'Email Service',
        content: 'cpg.call.name(".*send.*|.*mail.*|.*smtp.*")'
      },
      {
        id: 19,
        type: 'sink',
        name: 'Logging System',
        content: 'cpg.call.name(".*log.*|.*info.*|.*error.*|.*warn.*")'
      },
      {
        id: 20,
        type: 'sink',
        name: 'Message Queue',
        content: 'cpg.call.name(".*enqueue.*|.*publish.*|.*queue.*")'
      }
    ];

    return of(mockData).pipe(delay(500));
  }

  submitPair(sourceId: number, sinkId: number): Observable<any> {
    // Mock response
    const mockResponse = {
      success: true,
      message: 'Пару успішно створено',
      data: {
        id: Math.floor(Math.random() * 1000),
        sourceId: sourceId,
        sinkId: sinkId,
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    };

    return of(mockResponse).pipe(delay(1000));

    // Для реального API використовуйте:
    // return this.http.post(`${this.apiUrl}/pair`, { sourceId, sinkId });
  }
}
