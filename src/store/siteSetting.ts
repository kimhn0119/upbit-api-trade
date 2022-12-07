import create from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_FONT_SIZE = 14;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 18;

interface ISiteSettingState {
  hydrated: boolean;
  theme: 'dark' | 'light' | 'black';
  fontSize: number;
  visibleMyAccounts: boolean;
  visibleCurrencyBalances: boolean;
  visibleTradingPanel: boolean;
  subscribeChartCodes: Array<{
    exchange: 'BINANCE' | 'UPBIT';
    code: string;
  }>;
}

interface ISiteSettingStore extends ISiteSettingState {
  setHydrated: () => void;
  showMyAccounts: () => void;
  hideMyAccounts: () => void;
  changeTheme: (mode: ISiteSettingState['theme']) => void;
  changeFontSize: (fontSize: number) => void;
  showCurrencyBalances: () => void;
  hideCurrencyBalances: () => void;
  showTradingPanel: () => void;
  hideTradingPanel: () => void;
  setSubscribeChartCodes: (chart: ISiteSettingState['subscribeChartCodes']) => void;
}

export const defaultSubscribeChartCodes = [
  {
    exchange: 'UPBIT',
    code: 'BTC'
  },
  {
    exchange: 'BINANCE',
    code: 'BTC'
  },
  {
    exchange: 'UPBIT',
    code: 'ETH'
  },
  {
    exchange: 'BINANCE',
    code: 'ETH'
  }
] as const;

const defaultState: ISiteSettingState = {
  hydrated: false,
  theme: 'black',
  fontSize: 14,
  visibleMyAccounts: true,
  visibleCurrencyBalances: true,
  visibleTradingPanel: true,
  subscribeChartCodes: [...defaultSubscribeChartCodes].slice(2)
};

export const useSiteSettingStore = create(
  persist<ISiteSettingStore>(
    (set, get) => ({
      ...defaultState,
      setHydrated() {
        set({
          hydrated: true
        });
      },
      showMyAccounts() {
        set({
          visibleMyAccounts: true
        });
      },
      hideMyAccounts() {
        set({
          visibleMyAccounts: false
        });
      },
      changeTheme(theme: ISiteSettingState['theme']) {
        set({
          theme
        });
      },
      changeFontSize(fontSize: number) {
        set({
          fontSize: isNaN(fontSize)
            ? DEFAULT_FONT_SIZE
            : fontSize < MIN_FONT_SIZE
            ? MIN_FONT_SIZE
            : fontSize > MAX_FONT_SIZE
            ? MAX_FONT_SIZE
            : fontSize
        });
      },
      showCurrencyBalances() {
        set({ visibleCurrencyBalances: true });
      },
      hideCurrencyBalances() {
        set({ visibleCurrencyBalances: false });
      },
      showTradingPanel() {
        set({ visibleTradingPanel: true });
      },
      hideTradingPanel() {
        set({ visibleTradingPanel: false });
      },
      setSubscribeChartCodes(subscribeChartCodes) {
        set({ subscribeChartCodes });
      }
    }),
    {
      name: 'siteSetting', // unique name
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['hydrated', 'theme'].includes(key))
        ) as ISiteSettingStore,
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
      version: 0.1
      // partialize: (state) =>
      //   Object.fromEntries(
      //     Object.entries(state).filter(
      //       ([key]) => !['selectedMarketSymbol', 'selectedExchange'].includes(key)
      //     )
      //   )
    }
  )
);
