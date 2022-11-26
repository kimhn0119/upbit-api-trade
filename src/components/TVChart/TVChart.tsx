import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { IUpbitAccounts } from 'src-server/types/upbit';
import { useUpbitAuthStore } from 'src/store/upbitAuth';
// import './index.css';
import type {
  IChartingLibraryWidget,
  IPositionLineAdapter,
  ThemeName
} from '../../charting_library';
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString
} from '../../charting_library';
import upbitDataFeed from '../../lib/upbitDataFeed';

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null
    ? (window.document.getElementsByTagName('html')[0].getAttribute('lang') as LanguageCode) || null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

export interface TVChartProps {
  symbol?: ChartingLibraryWidgetOptions['symbol'];
  currency?: string; // "BTC" | "ETH"
  interval?: ChartingLibraryWidgetOptions['interval'];
  auto_save_delay?: ChartingLibraryWidgetOptions['auto_save_delay'];

  // BEWARE?: no trailing slash is expected in feed URL
  libraryPath?: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl?: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion?: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId?: ChartingLibraryWidgetOptions['client_id'];
  userId?: ChartingLibraryWidgetOptions['user_id'];
  fullscreen?: ChartingLibraryWidgetOptions['fullscreen'];
  autosize?: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides?: ChartingLibraryWidgetOptions['studies_overrides'];
  containerId?: string; // ChartingLibraryWidgetOptions['container'];
  theme?: ThemeName;
}

export const TVChartInner: React.FC<TVChartProps> = React.memo<TVChartProps>(
  ({
    symbol = 'BTCKRW',
    currency,
    interval = '60' as ResolutionString,
    auto_save_delay = 5,
    libraryPath = '/charting_library/',
    chartsStorageUrl = 'https://saveload.tradingview.com',
    chartsStorageApiVersion = '1.1',
    clientId = 'tradingview.com',
    userId = 'public_user_id',
    fullscreen = false,
    autosize = true,
    studiesOverrides = {},
    theme = 'Dark',
    containerId
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const tvWidgetRef = React.useRef<IChartingLibraryWidget | null>(null);

    useEffect(() => {
      if (!ref.current) {
        return;
      }
      const datafeed = upbitDataFeed();
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: symbol as string,
        // BEWARE: no trailing slash is expected in feed URL
        // tslint:disable-next-line:no-any
        // datafeed: DataFeed,
        datafeed: datafeed,
        interval: interval as ChartingLibraryWidgetOptions['interval'],
        container: ref.current,
        library_path: libraryPath as string,
        locale: getLanguageFromURL() || 'ko',
        disabled_features: [
          'header_symbol_search',
          'border_around_the_chart',
          'symbol_search_hot_key',
          'compare_symbol',
          'header_compare',
          'header_saveload',
          'save_shortcut',
          'go_to_date'
        ],
        // preset: 'mobile',
        time_scale: {
          min_bar_spacing: 1
        },

        enabled_features: ['side_toolbar_in_fullscreen_mode', 'hide_left_toolbar_by_default'],
        charts_storage_url: chartsStorageUrl,
        charts_storage_api_version: chartsStorageApiVersion,
        client_id: clientId,
        user_id: userId,
        fullscreen: fullscreen,
        autosize: autosize,
        studies_overrides: {
          'volume.volume.color.0': '#14b8a6',
          'volume.volume.color.1': '#f43f52',
          ...studiesOverrides
        },
        auto_save_delay,
        theme,
        favorites: {
          chartTypes: [],
          intervals: ['1', '5', '15', '30', '60', '240', '1D'] as Array<ResolutionString>
        },
        time_frames: [
          { text: '1d', resolution: '30' as ResolutionString },
          { text: '3d', resolution: '60' as ResolutionString },
          { text: '6d', resolution: '120' as ResolutionString },
          { text: '12d', resolution: '240' as ResolutionString },
          { text: '1y', resolution: '1d' as ResolutionString },
          { text: '5y', resolution: '5y' as ResolutionString }
        ],
        overrides: {
          // paneProperties: {
          //   background: '#ffffff',
          //   backgroundGradientEndColor: '#ffffff',
          //   backgroundGradientStartColor: '#ffffff',
          //   backgroundType: 'solid'
          // },
          'mainSeriesProperties.barStyle.downColor': '#f43f52',
          'mainSeriesProperties.barStyle.upColor': '#14b8a6',
          // 'paneProperties.background': theme.color.mainDrakBackground,
          // 'scalesProperties.lineColor': 'rgba(255, 255, 255, 0.6)',
          // 'scalesProperties.textColor': 'rgba(255, 255, 255, 0.6)',
          // 'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
          // 'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f',
          // 'mainSeriesProperties.showCountdown': true,
          'mainSeriesProperties.candleStyle.upColor': '#14b8a6',
          'mainSeriesProperties.candleStyle.downColor': '#f43f52',
          'mainSeriesProperties.candleStyle.borderColor': '#666666',
          'mainSeriesProperties.candleStyle.borderUpColor': '#14b8a6',
          'mainSeriesProperties.candleStyle.borderDownColor': '#f43f52',
          'mainSeriesProperties.candleStyle.wickUpColor': '#14b8a6',
          'mainSeriesProperties.candleStyle.wickDownColor': '#f43f52',
          'mainSeriesProperties.showCountdown': true,
          // volumePaneSize: 'medium',
          // 'mainSeriesProperties.highLowAvgPrice.highLowPriceLabelsVisible': true,
          'scalesProperties.fontSize': 12,
          'paneProperties.backgroundType': 'solid'
        },
        debug: false, // process.env.NODE_ENV === 'development' ? true : false,
        // save_load_adapter: {
        // },
        load_last_chart: false,
        settings_adapter: {
          initialSettings: {
            'trading.chart.proterty':
              localStorage.getItem('trading.chart.proterty') ||
              JSON.stringify({
                hideFloatingPanel: 1
              }),
            'chart.favoriteDrawings':
              localStorage.getItem('chart.favoriteDrawings') || JSON.stringify([]),
            'chart.favoriteDrawingsPosition':
              localStorage.getItem('chart.favoriteDrawingsPosition') || JSON.stringify({})
          },
          setValue: (key, value) => {
            if (!key) {
              return;
            }

            localStorage.setItem(key, value);
          },
          removeValue: (key) => {
            if (!key) {
              return;
            }
            localStorage.removeItem(key);
          }
        }
      };

      const tvWidget = new widget(widgetOptions);

      tvWidget.onChartReady(() => {
        tvWidgetRef.current = tvWidget;
        // tvWidget.headerReady().then(() => {
        //   const button = tvWidget.createButton();
        //   button.setAttribute('title', 'Click to show a notification popup');
        //   button.classList.add('apply-common-tooltip');
        //   button.addEventListener('click', () =>
        //     tvWidget.showNoticeDialog({
        //       title: 'Notification',
        //       body: 'TradingView Charting Library API works correctly',
        //       callback: () => {
        //         // console.log('Noticed!');
        //       }
        //     })
        //   );
        //   button.innerHTML = 'Check API';
        // });
        // tvWidget.subscribe('onAutoSaveNeeded', () => tvWidget.saveChartToServer());
        // tvWidget
        //   .activeChart()
        //   .onSymbolChanged()
        //   .subscribe(null, () => {
        //     console.log('symbol changed ', tvWidget.activeChart().symbol());
        //     // useUpbitAuthStore.subscribe(state => {
        //     //   state.accounts.map(account => account.)
        //     // })
        //   });

        let accountOrderLine: IPositionLineAdapter | null = tvWidget
          .activeChart()
          .createPositionLine()
          .setText('매수평균')
          .setLineLength(2)
          .setLineStyle(1)
          .setBodyBackgroundColor('#0ea5e9')
          .setLineColor('#0ea5e9')
          .setBodyTextColor('#ffffff')
          .setQuantity('');

        function subscribePositionLine(accounts: Array<IUpbitAccounts>) {
          if (!tvWidget) {
            return;
          }
          const ticker = tvWidget?.activeChart()?.symbol()?.split('.')?.[2];

          if (!ticker) {
            return;
          }

          const [tickerCurrency, tickerSymbol] = ticker.split('-');

          const account = accounts.find((account) => account.currency === tickerSymbol);

          if (!account) {
            accountOrderLine?.setPrice(0);
            return;
          }
          const { avg_buy_price } = account;
          accountOrderLine?.setPrice(Number(avg_buy_price) || 0);
        }

        // 차트가 변경되면 구독 취소하고 다시 구독
        tvWidget
          .activeChart()
          .onSymbolChanged()
          .subscribe(null, () => {
            accountOrderLine?.remove();
            tvWidget.activeChart().dataReady(() => {
              accountOrderLine = tvWidget
                .activeChart()
                .createPositionLine()
                .setText('매수평균')
                .setLineLength(2)
                .setLineStyle(1)
                .setBodyBackgroundColor('#0ea5e9')
                .setLineColor('#0ea5e9')
                .setBodyTextColor('#ffffff')
                .setQuantity('');
              subscribePositionLine(useUpbitAuthStore.getState().accounts);
            });
          });
        // 차트가 변경되면 구독 취소하고 다시 구독
        // 최초 1회 라인 긋고 구독
        subscribePositionLine(useUpbitAuthStore.getState().accounts);
        const unsubscribe = useUpbitAuthStore.subscribe(({ accounts }) => {
          subscribePositionLine(accounts);
        });
        // 최초 1회 라인 긋고 구독
      });

      return () => {
        if (tvWidget !== null) {
          tvWidget.remove();
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);

    useEffect(() => {
      if (!tvWidgetRef.current) {
        return;
      }
      const tvWidget = tvWidgetRef.current;
      tvWidget.chart().setSymbol(symbol);
    }, [symbol]);

    return <div id={containerId} ref={ref} className={'TVChartContainer h-full'} />;
  },
  isEqual
);

TVChartInner.displayName = 'TVChartInner';
