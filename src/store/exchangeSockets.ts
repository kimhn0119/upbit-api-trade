import create from 'zustand';
import type { GetState, StateCreator } from 'zustand';
import { NamedSet } from 'zustand/middleware';
import { IMarketTableItem } from 'src/components/market-table/MarketTable';
import {
  IUpbitForex,
  IUpbitMarket,
  IUpbitSocketMessageTickerSimple,
  IUpbitSocketMessageTradeSimple
} from 'src/types/upbit';
import { apiUrls } from 'src/lib/apiUrls';
import { v4 as uuidv4 } from 'uuid';
import { isEqual, keyBy, sortBy } from 'lodash';
import { IBinanceSocketMessageTicker } from 'src/types/binance';
import { krwRegex } from 'src/utils/regex';
import { useMarketTableSettingStore } from './marketTableSetting';
import { useSiteSettingStore } from './siteSetting';
import { useTradingViewSettingStore } from './tradingViewSetting';

type SocketMessage = string;
interface IExchangeState {
  sortedUpbitMarketSymbolList: Array<string>;
  upbitForex?: IUpbitForex;
  upbitMarkets: Array<IUpbitMarket>;
  searchedSymbols: Array<string>;
  upbitMarketDatas: Record<string, IMarketTableItem>;
  binanceMarkets: Array<IUpbitMarket>;
  binanceMarketDatas: Record<string, IBinanceSocketMessageTicker>;
  upbitSocket?: WebSocket;
  binanceSocket?: WebSocket;
  lastUpdatedAt: Date;
  socketTimeout: number;
  throttleDelay: number;
  upbitTradeMessage?: IUpbitSocketMessageTradeSimple;
  upbitTickerCodes: Array<string>;
  upbitTradeCodes: Array<string>;
}

const defaultState: IExchangeState = {
  upbitForex: undefined,
  sortedUpbitMarketSymbolList: [],
  upbitMarkets: [],
  searchedSymbols: [],
  upbitMarketDatas: {},
  binanceMarkets: [],
  binanceMarketDatas: {},
  upbitSocket: undefined,
  binanceSocket: undefined,
  lastUpdatedAt: new Date(),
  socketTimeout: 5 * 1000,
  throttleDelay: 200,
  upbitTradeMessage: undefined,
  upbitTickerCodes: [],
  upbitTradeCodes: []
};

interface IExchangeStore extends IExchangeState {
  setUpbitMarkets: (markets: IExchangeState['upbitMarkets']) => void;
  setUpbitMarketDatas: (marketDatas: IExchangeState['upbitMarketDatas']) => void;
  setBinanceMarkets: (markets: IExchangeState['binanceMarkets']) => void;
  setBinanceMarketDatas: (marketDatas: IExchangeState['binanceMarketDatas']) => void;
  distroyAll: () => void;
  changeUpbitTradeCodes: (tradeCodes?: IExchangeState['upbitTradeCodes']) => void;
  connectUpbitSocket: (setting?: {
    tickerCodes?: IExchangeState['upbitTickerCodes'];
    tradeCodes?: IExchangeState['upbitTradeCodes'];
  }) => void;
  disconnectUpbitSocket: () => void;
  connectBinanceSocket: (markets?: Array<String>) => void;
  disconnectBinanceSocket: () => void;
  searchSymbols: (searchValue: string) => void;
  sortSymbolList: (sortColumn: keyof IMarketTableItem, sortType: 'ASC' | 'DESC') => void;
  reconnectUpbitSocket: (message: string) => void;
}

const useExchangeStore = create<IExchangeStore>(
  // persist(
  // devtools(
  (set, get) => ({
    ...defaultState,
    setUpbitMarkets(markets) {
      set({ upbitMarkets: [...markets] });
    },
    setUpbitMarketDatas(marketDatas) {
      set({ upbitMarketDatas: { ...marketDatas } });
    },
    setBinanceMarkets(markets) {
      set({ binanceMarkets: [...markets] });
    },
    setBinanceMarketDatas(marketDatas) {
      set({ binanceMarketDatas: { ...marketDatas } });
    },
    changeUpbitTradeCodes(tradeCodes) {
      const { upbitTickerCodes, connectUpbitSocket } = get();
      if (upbitTickerCodes.length > 0) {
        connectUpbitSocket({ tickerCodes: upbitTickerCodes, tradeCodes });
      }
    },
    connectUpbitSocket(setting) {
      const { upbitMarkets, upbitTickerCodes, upbitTradeCodes } = get();
      const { selectedExchange, selectedMarketSymbol } = useTradingViewSettingStore.getState();
      //? 업빗 소켓 설정
      const tickerCodes =
        setting?.tickerCodes && Array.isArray(setting.tickerCodes) && setting.tickerCodes.length > 0
          ? setting.tickerCodes
          : Array.isArray(upbitTickerCodes) && upbitTickerCodes.length > 0
          ? upbitTickerCodes
          : upbitMarkets.map((c) => c.market);
      const tradeCodes =
        setting?.tradeCodes && Array.isArray(setting.tradeCodes) && setting.tradeCodes.length > 0
          ? setting.tradeCodes
          : selectedExchange === 'UPBIT'
          ? ['KRW-' + selectedMarketSymbol]
          : Array.isArray(upbitTradeCodes) && upbitTradeCodes.length > 0
          ? upbitTradeCodes
          : undefined;
      //? 업빗 소켓 설정

      const format = 'SIMPLE'; // socket 간소화된 필드명
      const isOnlySnapshot = true; // socket 시세 스냅샷만 제공
      const isOnlyRealtime = true; // socket 실시간 시세만 제공

      /**
       * https://docs.upbit.com/docs/upbit-quotation-websocket
       * 보내야 할 Field (* 은 필수)
       * ticket* - string - 고유한 유니크값
       * type* - string - "ticker": 현재가, "trade": 체결, "orderbook": 호가
       * codes* - Array<string> - 무조건 대문자로
       * isOnlySnapshot - boolean - 시세 스냅샷만 제공
       * isOnlyRealtime - boolean - 실시간 시세만 제공
       * format - string - "SIMPLE": 간소화된 필드명, "DEFAULT": 생략 가능
       */
      const message: Array<any> = [];
      message.push({ ticket: uuidv4() }, { type: 'ticker', codes: tickerCodes, isOnlyRealtime });
      if (tradeCodes && Array.isArray(tradeCodes)) {
        message.push({ type: 'trade', codes: tradeCodes, isOnlyRealtime });
      }
      message.push({ format });

      const { upbitSocket, reconnectUpbitSocket } = get();

      if (upbitSocket && upbitSocket.readyState === upbitSocket.OPEN) {
        upbitSocket.send(JSON.stringify(message));
      } else {
        set({
          upbitTradeCodes: tradeCodes,
          upbitTickerCodes: tickerCodes
        });
        reconnectUpbitSocket(JSON.stringify(message));
      }
    },
    reconnectUpbitSocket(message: SocketMessage) {
      const { socketTimeout, throttleDelay, upbitMarketDatas } = get();
      let lastActivity = Date.now();

      const dataBuffer: IExchangeState['upbitMarketDatas'] = upbitMarketDatas || {};

      let unapplied = 0;
      setInterval(() => {
        if (unapplied !== 0) {
          unapplied = 0;
          set({
            upbitMarketDatas: dataBuffer
          });
        }
      }, throttleDelay);

      function init() {
        const oldSocket = get().upbitSocket;
        if (oldSocket) oldSocket.close();

        let newSocket = new window.WebSocket(apiUrls.upbit.websocket);
        set({ upbitSocket: newSocket });
        newSocket.binaryType = 'blob';

        const handleOpen: WebSocket['onopen'] = function () {
          lastActivity = Date.now();
          newSocket.send(message);
        };

        const handleMessage: WebSocket['onmessage'] = async function (evt) {
          lastActivity = Date.now();
          const message = JSON.parse(await evt.data.text()) as
            | IUpbitSocketMessageTickerSimple
            | IUpbitSocketMessageTradeSimple;

          switch (message?.ty) {
            case 'ticker': {
              unapplied++;

              const { upbitForex, binanceMarketDatas } = get();
              const binanceMarketSymbol = message.cd.replace(krwRegex, '') + 'USDT';
              const binanceMarket = binanceMarketDatas[binanceMarketSymbol];

              if (!upbitForex || !binanceMarket) {
                dataBuffer[message.cd] = { ...dataBuffer[message.cd], ...message };
              } else {
                const binanceKrwPrice = binanceMarket
                  ? Number(binanceMarket.data.c) * upbitForex.basePrice
                  : undefined;
                const premium = binanceKrwPrice
                  ? (1 - binanceKrwPrice / message.tp) * 100
                  : undefined;

                dataBuffer[message.cd] = {
                  ...dataBuffer[message.cd],
                  ...message,
                  binance_price: binanceMarket.data.c,
                  binance_volume: binanceMarket.data.q,
                  premium: premium
                };
              }
              break;
            }
            case 'trade': {
              set({ upbitTradeMessage: message });
              break;
            }
          }
        };
        let timer: NodeJS.Timer | undefined;
        const handleError = () => {
          clearInterval(timer);
          newSocket.close();
          setTimeout(init, socketTimeout);
          // console.error('Socket encountered error: ', err, 'Closing socket');
        };
        timer = setInterval(function () {
          if (Date.now() - lastActivity > socketTimeout) {
            handleError();
          }
        }, socketTimeout / 2);

        newSocket.onopen = handleOpen;
        newSocket.onmessage = handleMessage;
        newSocket.onerror = handleError;
      }

      init();
    },
    connectBinanceSocket() {
      let lastActivity = Date.now();
      const { socketTimeout, throttleDelay, upbitMarkets } = get();
      const marketSymbols = upbitMarkets.map(
        (m) => m.market.replace(krwRegex, '').toLowerCase() + 'usdt@ticker'
      );
      const dataBuffer: IExchangeState['binanceMarketDatas'] = get().binanceMarketDatas || {};

      let unapplied = 0;

      setInterval(() => {
        if (unapplied !== 0) {
          unapplied = 0;
          set({
            binanceMarketDatas: dataBuffer
          });
        }
      }, throttleDelay);

      function init() {
        {
          const socket = get().binanceSocket;
          if (socket && socket.readyState !== 1) {
            socket.close();
          }
        }
        let newSocket: WebSocket = new window.WebSocket(apiUrls.binance.websocket);
        newSocket.binaryType = 'blob';

        set({ binanceSocket: newSocket });

        const handleOpen: WebSocket['onopen'] = function () {
          if (newSocket) {
            lastActivity = Date.now();
            newSocket.send(
              JSON.stringify({
                method: 'SUBSCRIBE',
                params: marketSymbols,
                id: 1
              })
            );
          }
        };

        const handleMessage: WebSocket['onmessage'] = async function (evt) {
          lastActivity = Date.now();
          const message = JSON.parse(evt.data) as IBinanceSocketMessageTicker;
          if (!message?.data?.s) {
            return;
          }
          unapplied++;
          dataBuffer[message.data.s] = message;
        };

        let timer: NodeJS.Timer | undefined;
        const handleError = () => {
          clearInterval(timer);
          newSocket.close();
          setTimeout(init, socketTimeout);
          // console.error('Socket encountered error: ', err, 'Closing socket');
        };
        timer = setInterval(function () {
          if (Date.now() - lastActivity > socketTimeout) {
            handleError();
          }
        }, socketTimeout / 2);

        newSocket.onopen = handleOpen;
        newSocket.onmessage = handleMessage;
        newSocket.onerror = handleError;
      }

      init();
    },
    disconnectUpbitSocket() {
      const socket = get().upbitSocket;
      if (socket) {
        socket?.close();
      }
      set({ upbitSocket: undefined, upbitTickerCodes: [], upbitTradeCodes: [] });
    },
    disconnectBinanceSocket() {
      const socket = get().binanceSocket;
      if (socket) {
        socket?.close();
      }
      set({ binanceSocket: undefined });
    },
    searchSymbols(searchValue: string) {
      const { upbitMarkets } = get();
      if (searchValue) {
        const filterdMarketSymbols = upbitMarkets
          .filter((m) => {
            // KRW 마켓 확인
            if (krwRegex.test(m.market)) {
              // korean, eng, symbol 매칭 확인
              return Boolean(
                Object.values(m).filter((value: string) =>
                  value.toLocaleUpperCase().match(searchValue.toLocaleUpperCase())
                ).length
              );
            }
          })
          .map((market) => market.market);

        set({
          searchedSymbols: filterdMarketSymbols
        });
      } else {
        set({
          searchedSymbols: upbitMarkets.filter((m) => krwRegex.test(m.market)).map((m) => m.market)
        });
      }
    },
    sortSymbolList(sortColumn, sortType) {
      const { upbitForex, searchedSymbols, upbitMarketDatas } = get();
      if (!upbitForex) return;
      const hydrated = useSiteSettingStore.getState().hydrated;
      const favoriteSymbols = useMarketTableSettingStore.getState().favoriteSymbols;
      const favoriteList: IMarketTableItem[] = [];
      const normalList = hydrated
        ? searchedSymbols
            .map((symbol) => upbitMarketDatas[symbol])
            .filter((m) => {
              const favorite = favoriteSymbols[m.cd];
              if (favorite) {
                favoriteList.push(m);
              } else {
                return true;
              }
            })
        : searchedSymbols.map((symbol) => upbitMarketDatas[symbol]);

      // const mergeMarkets = upbitMarketDatas.map((upbitMarket) => {
      //   return {
      //     ...upbitMarket
      //   };
      // });

      // const handleSort = (aItem: IMarketTableItem, bItem: IMarketTableItem) => {
      //   const a = aItem[sortColumn];
      //   const b = bItem[sortColumn];
      //   if (a === undefined) return 1;
      //   if (b === undefined) return -1;

      //   if (typeof a === 'number' && typeof b === 'number') {
      //     if (sortType === 'ASC') {
      //       return a - b;
      //     }
      //     return b - a;
      //   } else if (typeof a === 'string' && typeof b === 'string') {
      //     const aValue = a.toUpperCase();
      //     const bValue = b.toUpperCase();
      //     if (sortType === 'ASC') {
      //       if (aValue < bValue) {
      //         return 1;
      //       }
      //       if (aValue > bValue) {
      //         return -1;
      //       }
      //       return 0;
      //     }
      //     if (aValue < bValue) {
      //       return -1;
      //     }
      //     if (aValue > bValue) {
      //       return 1;
      //     }
      //     return 0;
      //   }
      //   return 0;
      // };

      const sortedFavoriteList =
        sortType === 'ASC'
          ? sortBy(favoriteList, sortColumn)
          : sortBy(favoriteList, sortColumn).reverse();
      const sortedNormalList =
        sortType === 'ASC'
          ? sortBy(normalList, sortColumn)
          : sortBy(normalList, sortColumn).reverse();

      const sortedSymbolList = sortedFavoriteList.concat(sortedNormalList).map((m) => {
        // upbitMarketDatas[m.cd] = m;
        return m.cd;
      });

      // 순서까지 같은지 검사. 리렌더링보단 성능이 적게 소모됨
      try {
        sortedSymbolList.reduce((prev, current, i) => {
          if (current !== searchedSymbols[i]) {
            throw '같지 않음';
          }
          return prev;
        }, true);

        return; // 여기 오면 같음
      } catch (e) {}

      set({
        searchedSymbols: sortedSymbolList
      });
    },
    distroyAll() {
      set({ ...defaultState });
    }
  })
  // )
  // ),
  //   {
  //     name: 'upbitData', // unique name
  //     getStorage: () => localStorage // (optional) by default, 'localStorage' is used
  //   }
);

export type { IExchangeState };
export { useExchangeStore };
