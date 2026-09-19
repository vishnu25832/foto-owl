export interface PicsumImage {
    id: string;
    author: string;
    width: number;
    height: number;
    url: string;
    download_url: string;
  }
  
  export type ImageFilter = 'ALL' | 'A_M' | 'N_Z';