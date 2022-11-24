export interface IUpbitErrorMessage {
  error: {
    name: string;
    message: string;
  };
}

export interface IUpbitForex {
  code: string; // "FRX.KRWUSD"
  currencyCode: string; // "USD"
  currencyName: string; // "달러"
  country: string; // "미국"
  name: string; // "미국 (KRW/USD)"
  date: string; // "2022-02-28"
  time: string; // "21:01:28"
  recurrenceCount: number; // 332
  basePrice: number; // 1204.5
  openingPrice: number; // 1202.7
  highPrice: number; // 1208.4
  lowPrice: number; // 1198
  change: string; // "EVEN"
  changePrice: number; // 0
  cashBuyingPrice: number; // 1225.57
  cashSellingPrice: number; // 1183.43
  ttBuyingPrice: number; // 1192.7
  ttSellingPrice: number; // 1216.3
  tcBuyingPrice: number; // null
  fcSellingPrice: number; // null
  exchangeCommission: number; // 2.045
  usDollarRate: number; // 1
  high52wPrice: number; // 1211.5
  high52wDate: string; // "2022-01-28"
  low52wPrice: number; // 1105.2
  low52wDate: string; // "2021-06-01"
  currencyUnit: number; // 1
  provider: string; // "하나은행"
  timestamp: number; // 1646049689346
  id: number; // 79
  createdAt: string; // "2016-10-21T06:13:34.000+0000"
  modifiedAt: string; // "2022-02-28T12:01:29.000+0000"
  signedChangePrice: number; // 0
  signedChangeRate: number; // 0
  changeRate: number; // 0
}

export interface IUpbitMarket {
  market: string;
  korean_name: string;
  english_name: string;
}
export interface IUpbitSocketMessageTicker {
  type: string;
  code: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: 'RISE' | 'EVEN' | 'FALL';
  change_price: number;
  signed_change_price: number;
  change_rate: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  trade_date: string;
  trade_time: string;
  trade_timestamp: number;
  ask_bid: 'ASK' | 'BID';
  acc_ask_volume: number;
  acc_bid_volume: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  // trade_status: string;
  market_state: string;
  market_warning: string;
  is_trading_suspended: boolean;
  delisting_date: string | null;
  timestamp: number;
  stream_type: string;
}

export interface IUpbitApiTicker {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: 'RISE' | 'EVEN' | 'FALL';
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

export interface IUpbitSocketMessageTickerSimple {
  ty: string;
  cd: string;
  op: number;
  hp: number;
  lp: number;
  tp: number;
  pcp: number;
  c: 'RISE' | 'EVEN' | 'FALL';
  cp: number;
  scp: number;
  cr: number;
  scr: number;
  tv: number;
  atv: number;
  atv24h: number;
  atp: number;
  atp24h: number;
  tdt: string;
  ttm: string;
  ttms: number;
  ab: 'ASK' | 'BID';
  aav: number;
  abv: number;
  h52wp: number;
  h52wdt: string;
  l52wp: number;
  l52wdt: string;
  // trade_status: string;
  ms: 'PREVIEW' | 'ACTIVE' | 'DELISTED';
  mw: 'NONE' | 'CAUTION';
  its: boolean;
  dd: string | null;
  tms: number;
  st: string;
}

export interface IUpbitCandle {
  market: string; // 마켓명
  candle_date_time_utc: string; // 캔들 기준 시각(UTC 기준)포맷: yyyy-MM-dd'T'HH:mm:ss
  candle_date_time_kst: string; // 캔들 기준 시각(KST 기준)포맷: yyyy-MM-dd'T'HH:mm:ss
  opening_price: number; // 시가
  high_price: number; // 고가
  low_price: number; // 저가
  trade_price: number; // 종가
  timestamp: number; // 마지막 틱이 저장된 시각
  candle_acc_trade_price: number; // 누적 거래 금액
  candle_acc_trade_volume: number; // 누적 거래량
  unit?: number; //분 단위(유닛)
  prev_closing_price?: number; // 전일 종가(UTC 0시 기준)
  change_price?: number; // 전일 종가 대비 변화 금액
  change_rate?: number; // 전일 종가 대비 변화량
  converted_trade_price?: number; // 종가 환산 화폐 단위로 환산된 가격(요청에 convertingPriceUnit 파라미터 없을 시 해당 필드 포함되지 않음.)
  first_day_of_period?: string; // 캔들 기간의 가장 첫 날
}
