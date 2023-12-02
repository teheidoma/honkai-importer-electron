export interface PullStatus {
  banners: PullStatusBanner[];
}

export interface PullStatusBanner {
  done: boolean;
  gachaType: string;
  count: number;
}
