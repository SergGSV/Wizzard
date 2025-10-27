export interface DataItem {
  id: number;
  type: 'source' | 'sink';
  name: string;
  content: string;
}
