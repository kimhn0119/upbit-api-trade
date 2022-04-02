import create, { GetState } from 'zustand';
import { devtools, NamedSet } from 'zustand/middleware';
import { IUpbitAccounts } from 'src-server/type/upbit';
import { IMarketTableItem } from 'src/components/market-table/MarketTable';
import { IUpbitMarket, IUpbitSocketMessageTickerSimple } from 'src/types/upbit';
import { clientApiUrls } from 'src/utils/clientApiUrls';
import { v4 as uuidv4 } from 'uuid';
import { keyBy } from 'lodash';
import { IBinanceSocketMessageTicker } from 'src/types/binance';

interface IExchangeState {
  upbitMarkets: Array<IUpbitMarket>;
  upbitMarketDatas: Record<string, IMarketTableItem>;
  binanceMarkets: Array<IUpbitMarket>;
  binanceMarketDatas: Record<string, IBinanceSocketMessageTicker>;
  upbitSocket?: WebSocket;
  binanceSocket?: WebSocket;
}

interface IConnectSocketProps {
  stateUpdateDelay: number;
}

interface IConnectUpbitSocketProps extends IConnectSocketProps {
  upbitMarkets: Array<IUpbitMarket>;
  upbitMarketSnapshot?: Record<string, IMarketTableItem>;
}

interface IConnectBinanceSocketProps extends IConnectSocketProps {
  binanceMarkets: Array<String>;
}

const defaultState: IExchangeState = {
  upbitMarkets: [],
  upbitMarketDatas: {},
  binanceMarkets: [],
  binanceMarketDatas: {}
};

interface IExchangeStore extends IExchangeState {
  setUpbitMarkets: (markets: IExchangeState['upbitMarkets']) => void;
  setUpbitMarketDatas: (marketDatas: IExchangeState['upbitMarketDatas']) => void;
  setBinanceMarkets: (markets: IExchangeState['binanceMarkets']) => void;
  setBinanceMarketDatas: (marketDatas: IExchangeState['binanceMarketDatas']) => void;
  distroyAll: () => void;
  connectUpbitSocket: (props: IConnectUpbitSocketProps) => void;
  disconnectUpbitSocket: () => void;
  connectBinanceSocket: (props: IConnectBinanceSocketProps) => void;
  disconnectBinanceSocket: () => void;
}

const handleConnectUpbitSocket =
  (set: NamedSet<IExchangeStore>, get: GetState<IExchangeStore>) =>
  ({ upbitMarkets, stateUpdateDelay, upbitMarketSnapshot }: IConnectUpbitSocketProps) => {
    //? 업빗 소켓 설정
    const ticket = uuidv4(); // * 구분할 값을 넘겨야 함.
    const type = 'ticker'; // * 현재가 -> ticker, 체결 -> trade, 호가 ->orderbook
    const krwSymbols = upbitMarkets.map((c) => c.market); // * 구독할 코인들

    const format = 'SIMPLE'; // socket 간소화된 필드명
    const isOnlySnapshot = true; // socket 시세 스냅샷만 제공
    const isOnlyRealtime = true; // socket 실시간 시세만 제공
    //? 업빗 소켓 설정

    const markets = keyBy(upbitMarkets, 'market'); // market으로 키를 지정하고 배열들 값을 넣음.

    const socketDatas: IExchangeState['upbitMarketDatas'] = { ...upbitMarketSnapshot } || {};
    let unapplied = 0;
    // set({ upbitMarketDatas: socketDatas });

    const handleMessage = async (e: WebSocketEventMap['message']) => {
      const message = JSON.parse(await e.data.text()) as IUpbitSocketMessageTickerSimple;

      unapplied++;
      socketDatas[message.cd] = {
        ...message,
        korean_name: markets[message.cd]?.korean_name || '',
        english_name: markets[message.cd]?.english_name || ''
      };
    };

    function wsConnect() {
      {
        const upbitSocket = get().upbitSocket;
        if (upbitSocket) {
          upbitSocket.close();
        }
      }
      let ws: WebSocket = new WebSocket(clientApiUrls.upbit.websocket);
      set({ upbitSocket: ws });

      const refreshInterval = setInterval(() => {
        if (unapplied > 0) {
          unapplied = 0;
          set({ upbitMarketDatas: { ...socketDatas } });
        }
      }, stateUpdateDelay);

      ws.binaryType = 'blob';
      ws.addEventListener('open', () => {
        ws.send(
          JSON.stringify([{ ticket }, { type, codes: krwSymbols, isOnlyRealtime }, { format }])
        );
      });

      ws.addEventListener('message', handleMessage);

      ws.addEventListener('error', (err: WebSocketEventMap['error']) => {
        console.error('Socket encountered error: ', err, 'Closing socket');

        const upbitSocket = get().upbitSocket;
        if (refreshInterval) clearInterval(refreshInterval);
        if (upbitSocket && upbitSocket.readyState === 1) {
          upbitSocket.close();
        }
      });
      ws.addEventListener('close', (e: WebSocketEventMap['close']) => {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        const upbitSocket = get().upbitSocket;
        setTimeout(() => {
          if (refreshInterval) clearInterval(refreshInterval);
          if (upbitSocket && upbitSocket.readyState === 1) {
            upbitSocket.close();
          }
        }, 1000);
      });
    }
    const connectCheck = setInterval(() => {
      const { connectUpbitSocket, upbitSocket } = get();
      if (!upbitSocket || upbitSocket.readyState !== 1) {
        clearInterval(connectCheck);
        upbitSocket?.close();
        connectUpbitSocket({
          upbitMarkets,
          stateUpdateDelay,
          upbitMarketSnapshot: upbitMarketSnapshot
        });
      }
    }, 5000);
    if (!get().upbitSocket) wsConnect();
  };
const handleConnectBinanceSocket =
  (set: NamedSet<IExchangeStore>, get: GetState<IExchangeStore>) =>
  ({ binanceMarkets, stateUpdateDelay }: IConnectBinanceSocketProps) => {
    const socketDatas: IExchangeState['binanceMarketDatas'] = {};
    let unapplied = 0;
    set({ binanceMarketDatas: socketDatas });

    const handleMessage = async (e: WebSocketEventMap['message']) => {
      const message = JSON.parse(e.data) as IBinanceSocketMessageTicker;
      if (!message?.data?.s) {
        return;
      }
      if (!socketDatas[message.data.s]) {
        unapplied++;
        socketDatas[message.data.s] = message;
      } else if (socketDatas[message.data.s].data.p !== message.data.p) {
        unapplied++;
        socketDatas[message.data.s] = message;
      }
    };

    function wsConnect() {
      {
        const socket = get().binanceSocket;
        if (socket) {
          socket.close();
        }
      }
      let ws: WebSocket = new WebSocket(clientApiUrls.binance.websocket);
      set({ binanceSocket: ws });

      const refreshInterval = setInterval(() => {
        if (unapplied > 0) {
          unapplied = 0;
          set({ binanceMarketDatas: { ...socketDatas } });
        }
      }, stateUpdateDelay);

      ws.binaryType = 'blob';
      ws.addEventListener('open', () => {
        if (ws)
          ws.send(
            JSON.stringify({
              method: 'SUBSCRIBE',
              params: binanceMarkets,
              id: 1
            })
          );
      });

      ws.addEventListener('message', handleMessage);

      ws.addEventListener('error', (err: WebSocketEventMap['error']) => {
        console.error('Socket encountered error: ', err, 'Closing socket');

        const socket = get().binanceSocket;
        if (refreshInterval) clearInterval(refreshInterval);
        if (socket && socket.readyState === 1) {
          socket.close();
        }
      });
      ws.addEventListener('close', (e: WebSocketEventMap['close']) => {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        const socket = get().binanceSocket;
        setTimeout(() => {
          if (refreshInterval) clearInterval(refreshInterval);
          if (socket && socket.readyState === 1) {
            socket.close();
          }
        }, 1000);
      });
    }
    const connectCheck = setInterval(() => {
      const { connectBinanceSocket, binanceSocket } = get();
      if (!binanceSocket || binanceSocket.readyState !== 1) {
        clearInterval(connectCheck);
        binanceSocket?.close();
        connectBinanceSocket({
          binanceMarkets,
          stateUpdateDelay
        });
      }
    }, 5000);
    if (!get().binanceSocket) wsConnect();
  };

const useExchangeStore = create<IExchangeStore>(
  // persist(
  devtools((set, get) => ({
    ...defaultState,
    setUpbitMarkets: (markets) => {
      set({ upbitMarkets: [...markets] });
    },
    setUpbitMarketDatas: (marketDatas) => {
      set({ upbitMarketDatas: { ...marketDatas } });
    },
    setBinanceMarkets: (markets) => {
      set({ binanceMarkets: [...markets] });
    },
    setBinanceMarketDatas: (marketDatas) => {
      set({ binanceMarketDatas: { ...marketDatas } });
    },
    connectUpbitSocket: handleConnectUpbitSocket(set, get),
    disconnectUpbitSocket: () => {
      const socket = get().upbitSocket;
      if (socket) {
        if (socket.readyState === 1) socket.close();
        set({ upbitSocket: undefined });
      }
    },
    connectBinanceSocket: handleConnectBinanceSocket(set, get),
    disconnectBinanceSocket: () => {
      const socket = get().binanceSocket;
      if (socket) {
        if (socket.readyState === 1) socket.close();
        set({ binanceSocket: undefined });
      }
    },
    distroyAll: () => {
      set({ ...defaultState });
    }
  }))
  //   {
  //     name: 'upbitData', // unique name
  //     getStorage: () => localStorage // (optional) by default, 'localStorage' is used
  //   }
  // )
);

export type { IExchangeState };
export { useExchangeStore };
