import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import MarketTable, { IMarketTableItem } from 'src/components/market-table/MarketTable';
import { IUpbitApiTicker, IUpbitMarket } from 'src/types/upbit';
import { useUpbitAuthStore } from 'src/store/upbitAuth';
import { apiUrls } from 'src/lib/apiUrls';
import useSWR from 'swr';
import { IBinanceSocketTicker, IBinanceTickerPrice } from 'src/types/binance';
import { useExchangeStore } from 'src/store/exchangeSockets';
import { krwRegex } from 'src/utils/regex';
import { keyBy } from 'lodash';
import { useMarketTableSettingStore } from 'src/store/marketTableSetting';
import TradingViewTickers from 'src/components/tradingview/Tickers';
import shallow from 'zustand/shallow';
import { useSiteSettingStore } from 'src/store/siteSetting';
import axios from 'axios';
import { BackgroundRedBox } from 'src/components/modules/Box';
import Link from 'next/link';
import config from 'site-config';
import { TVChart } from 'src/components/TVChart';
import { useTradingViewSettingStore } from 'src/store/tradingViewSetting';
import { ResolutionString } from 'public/charting_library/charting_library';

const Home: NextPage = () => {
  const hydrated = useSiteSettingStore((state) => state.hydrated, shallow);

  return (
    <main className='relative w-full px-3 mx-auto max-w-7xl lg:max-w-none lg:grid lg:grid-rows-[auto_1fr] lg:grid-cols-[auto_450px] lg:overflow-hidden lg:gap-2 lg:flex-auto lg:p-0 xl:grid-cols-[auto_500px]'>
      <div className='overflow-x-auto overflow-y-hidden lg:col-span-2 lg:row-span-1'>
        <div className='mx-auto'>
          <TradingViewTickers pointerEvents='none' />
        </div>
      </div>
      <div
        className='lg:col-start-1 lg:row-start-2'
        // className={hydrated && stickyChart && headerHeight ? `sticky left-0 z-[1]` : undefined}
        // style={
        //   hydrated && stickyChart && headerHeight
        //     ? {
        //         top: headerHeight
        //       }
        //     : undefined
        // }
      >
        <div className='h-[300px] min-h-[300px] sm:h-[40vh] lg:min-h-[500px] lg:h-full [&_.tradingview-widget-copyright]:!leading-4'>
          {hydrated && <Chart />}
          {/* <TradingViewChart />; */}
        </div>
      </div>

      <noscript>
        <div className='mt-4'>
          <BackgroundRedBox>
            <div className='text-center'>
              <p>
                현재 사용중인 브라우저에서 자바스크립트가 비활성화 되어있습니다.
                <br />
                실시간 시세를 보시려면 자바스크립트를 활성화하시고 새로고침 해주세요.
              </p>
              <p>
                <a
                  className='text-white underline'
                  href='https://support.google.com/adsense/answer/12654?hl=ko'
                  target='_blank'
                  rel='noreferrer'
                >
                  활성화 방법 보기
                </a>
              </p>
              <p className='mt-3'>
                또는{' '}
                <Link href='/last'>
                  <a className='text-white underline'>현재 시세보는 페이지</a>
                </Link>
              </p>
            </div>
          </BackgroundRedBox>
        </div>
      </noscript>
      <div className='lg:m-0 lg:overflow-hidden lg:flex lg:flex-col lg:col-start-2 lg:row-start-2 text-xs sm:text-sm lg:text-xs xl:text-sm'>
        {hydrated && <ExchangeMarket />}
      </div>
    </main>
  );
};

const Chart = () => {
  const { selectedExchange, selectedMarketSymbol } = useTradingViewSettingStore(
    ({ selectedExchange, selectedMarketSymbol }) => ({ selectedExchange, selectedMarketSymbol }),
    shallow
  );

  // useEffect(() => {
  //   switch (selectedExchange) {
  //     case 'UPBIT': {
  //       useExchangeStore.getState().connectUpbitSocket();
  //       break;
  //     }
  //     case 'BINANCE': {
  //       useExchangeStore.getState().connectBinanceSocket();
  //       break;
  //     }
  //   }
  // }, [selectedExchange, selectedMarketSymbol]);

  switch (selectedExchange) {
    case 'BINANCE': {
      return (
        <TVChart
          key={'binance-chart'}
          interval={'15' as ResolutionString}
          symbol={selectedMarketSymbol + 'USDT'}
          currency={selectedMarketSymbol}
          exchange={'BINANCE'}
        />
      );
      // return <TradingViewChart />;
    }
    case 'UPBIT': {
      return (
        <TVChart
          key={'upbit-chart'}
          interval={'15' as ResolutionString}
          symbol={selectedMarketSymbol + 'KRW'}
          currency={selectedMarketSymbol}
          exchange={'UPBIT'}
        />
      );
    }
    default: {
      return null;
    }
  }
};

const ExchangeMarket: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const { data: forexRecent } = useSWR(apiUrls.upbit.rewriteUrl + apiUrls.upbit.forex.recent);

  useEffect(() => {
    if (isReady) {
      return;
    }
    if (!forexRecent) {
      return;
    }
    (async function () {
      try {
        const upbitMarketAllRecord: Record<string, IUpbitMarket> = {};
        const upbitMarketAll = await axios
          .get<Array<IUpbitMarket>>(
            apiUrls.upbit.origin + apiUrls.upbit.market.all + '?isDetails=false'
          )
          .then((res) => {
            return res.data?.filter((m) => {
              if (Boolean(m.market.match(krwRegex))) {
                upbitMarketAllRecord[m.market] = m;
                return true;
              }
              // BTC 마켓은 아래 코드 사용
              // if (!Boolean(m.market.match(usdtRegex))) {
              //   upbitMarketRecord[m.market] = m;
              //   return true;
              // }
            });
          });
        const symbolList = upbitMarketAll?.map((m: IUpbitMarket) => m.market);
        const upbitSymbols = symbolList.join(',');

        // 바이낸스는 해당 마켓이 없을 경우 에러를 냄 -> 전체 리스트를 가져와서 정렬.
        const [upbitMarketSnapshot, binanceMarketSnapshot] = await Promise.all([
          axios
            .get<Array<IUpbitApiTicker>>(
              apiUrls.upbit.origin + apiUrls.upbit.ticker + '?markets=' + upbitSymbols
            )
            .then((res) => res.data),
          // fetch(`${binanceApis.tickerPrice}?symbols=${binanceSymbols}`).then((res) => res.json())
          axios
            .get<Array<IBinanceTickerPrice>>(apiUrls.binance.origin + apiUrls.binance.ticker.price)
            .then((res) => res.data)
        ]);

        const binanceMarketSnapshotKeyBy = keyBy(binanceMarketSnapshot, 'symbol');
        const upbitMarketSnapshotRecord: Record<string, IMarketTableItem> = {};
        const binanceMarketSnapshotRecord: Record<string, IBinanceSocketTicker> = {};

        for (const m of binanceMarketSnapshot) {
          binanceMarketSnapshotRecord[m.symbol] = {
            p: m.price,
            s: m.symbol
          } as IBinanceSocketTicker;
        }

        for (const t of upbitMarketSnapshot) {
          const symbol = t.market?.replace(krwRegex, '');
          let binanceSymbol: string | undefined = symbol + 'USDT';
          switch (symbol) {
            case 'BTT': {
              binanceSymbol = 'BTTCUSDT';
              break;
            }
            case 'POLY':
            // {
            //   binanceSymbol = 'POLYXUSDT';
            //   break;
            // }
            case 'BTG':
            case 'NU': {
              binanceSymbol = undefined;
              break;
            }
          }
          upbitMarketSnapshotRecord[t.market] = {
            ty: 'ticker',
            cd: t.market,
            op: t.opening_price,
            hp: t.high_price,
            lp: t.low_price,
            tp: t.trade_price,
            pcp: t.prev_closing_price,
            c: t.change,
            cp: t.change_price,
            scp: t.signed_change_price,
            cr: t.change_rate,
            scr: t.signed_change_rate,
            tv: t.trade_volume,
            atv: t.acc_trade_volume,
            atv24h: t.acc_trade_volume_24h,
            atp: t.acc_trade_price,
            atp24h: t.acc_trade_price_24h,
            tdt: t.trade_date_kst,
            ttm: t.trade_time_kst,
            ttms: t.trade_timestamp,
            ab: 'ASK',
            aav: 0,
            abv: 0,
            h52wp: t.highest_52_week_price,
            h52wdt: t.highest_52_week_date,
            l52wp: t.lowest_52_week_price,
            l52wdt: t.lowest_52_week_date,
            ms: 'ACTIVE',
            mw: 'NONE',
            its: false,
            dd: null,
            tms: t.timestamp,
            st: 'SNAPSHOT',
            english_name: upbitMarketAllRecord[t.market].english_name,
            korean_name: upbitMarketAllRecord[t.market].korean_name
          };

          // 바이낸스 가격 넣기
          if (binanceSymbol && binanceMarketSnapshotKeyBy[binanceSymbol]) {
            const binanceMarket = binanceMarketSnapshotKeyBy[binanceSymbol];
            const binanceKrwPrice = Number(binanceMarket.price) * forexRecent.basePrice;
            const premium = (1 - binanceKrwPrice / t.trade_price) * 100;
            upbitMarketSnapshotRecord[t.market].binance_price =
              binanceMarketSnapshotKeyBy[binanceSymbol]?.price;
            upbitMarketSnapshotRecord[t.market].premium = premium;
          }
        }

        useExchangeStore.setState({ upbitForex: forexRecent, lastUpdatedAt: new Date() });

        if (upbitMarketSnapshotRecord)
          useExchangeStore.setState({ upbitMarketDatas: upbitMarketSnapshotRecord });
        const upbitKrwSymbolList = upbitMarketSnapshot
          .filter((c) => krwRegex.test(c.market))
          .map((m) => m.market);

        useExchangeStore.setState({
          upbitMarkets: upbitMarketAll,
          searchedSymbols: upbitKrwSymbolList,
          sortedUpbitMarketSymbolList: upbitKrwSymbolList
        });
        useMarketTableSettingStore.getState().setSortColumn('tp');
        useMarketTableSettingStore.getState().setSortType('DESC');
        useExchangeStore.getState().sortSymbolList('tp', 'DESC');
        useExchangeStore.setState({
          sortedUpbitMarketSymbolList: useExchangeStore.getState().searchedSymbols
        });

        const { connectBinanceSocket, connectUpbitSocket } = useExchangeStore.getState();
        connectUpbitSocket();
        connectBinanceSocket();

        setIsReady(true);
      } catch (e) {}
    })();
  }, [forexRecent, isReady]);

  return <MarketTable />;
};

export default Home;
