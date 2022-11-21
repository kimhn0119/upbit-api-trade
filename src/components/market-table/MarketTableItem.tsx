import classNames from 'classnames';
import { isEqual } from 'lodash';
import Image from 'next/image';
import React from 'react';
import { memo, useEffect, useRef } from 'react';
import { AiOutlineAreaChart } from 'react-icons/ai';
import { TiPin } from 'react-icons/ti';
import { useExchangeStore } from 'src/store/exchangeSockets';
import { useMarketTableSettingStore } from 'src/store/marketTableSetting';
import { useTradingViewSettingStore } from 'src/store/tradingViewSetting';
import { IUpbitForex } from 'src/types/upbit';
import { apiUrls } from 'src/lib/apiUrls';
import { marketRegex } from 'src/utils/regex';
import { koPriceLabelFormat } from 'src/utils/utils';
import shallow from 'zustand/shallow';

export interface TableItemProps {
  krwSymbol: string;
  // upbitMarket: IMarketTableItem;
  upbitForex: IUpbitForex;
  favorite: boolean;
}

const TableItem: React.FC<TableItemProps> = ({ krwSymbol, upbitForex, favorite }) => {
  const krwPriceRef = useRef<HTMLSpanElement>(null);
  const usdPriceRef = useRef<HTMLSpanElement>(null);
  const highlight = useMarketTableSettingStore((state) => state.highlight, shallow);
  const upbitMarket = useExchangeStore((state) => state.upbitMarketDatas[krwSymbol], shallow);
  const marketSymbol = upbitMarket.cd.replace(marketRegex, '');

  // const upbitBtcMarket = useExchangeStore(
  //   (state) => state.upbitMarketDatas['BTC-' + marketSymbol],
  //   shallow
  // );
  // const upbitBtcPrice = useExchangeStore.getState().upbitMarketDatas['KRW-BTC'];

  const handleClickMarketIcon = (symbol: string, exchange: 'BINANCE' | 'UPBIT') => () => {
    const { setSelectedMarketSymbol, setSelectedExchange } = useTradingViewSettingStore.getState();
    setSelectedMarketSymbol(symbol);
    setSelectedExchange(exchange);
    window.scrollTo(0, 0);
  };

  const handleClickStarIcon = (symbol: string) => () => {
    if (!favorite) {
      useMarketTableSettingStore.getState().addFavoriteSymbol(symbol);
    } else {
      useMarketTableSettingStore.getState().removeFavoriteSymbol(symbol);
    }
    const { sortColumn, sortType } = useMarketTableSettingStore.getState();
    useExchangeStore.getState().sortSymbolList(sortColumn, sortType);
  };

  useEffect(() => {
    if (!highlight || !krwPriceRef?.current) {
      return;
    }
    const node = krwPriceRef.current;
    const callback: MutationCallback = (e) => {
      for (const mutationNode of e) {
        mutationNode.target.parentElement?.classList.remove('highlight');
        setTimeout(() => {
          mutationNode.target.parentElement?.classList.add('highlight');
        }, 0);
      }
      // const animations = mutationNode.target.parentElement?.getAnimations()
      // if(animations){
      //   for(const animation of animations){
      //     if (node.contains((animation.effect as KeyframeEffect).target)) {
      //       animation.cancel();
      //       animation.play();
      //     }
      //   }
      // }
    };
    const config: MutationObserverInit = {
      subtree: true,
      characterData: true
    };
    const observer = new MutationObserver(callback);

    observer.observe(node, config);

    return () => {
      observer.disconnect();
    };
  }, [highlight, krwPriceRef]);

  useEffect(() => {
    if (!usdPriceRef?.current) {
      return;
    }
    const node = usdPriceRef.current;
    const callback: MutationCallback = (e) => {
      if (!highlight) {
        return;
      }
      for (const mutationNode of e) {
        mutationNode.target.parentElement?.classList.remove('highlight');
        setTimeout(() => {
          mutationNode.target.parentElement?.classList.add('highlight');
        }, 0);
      }
    };
    const config: MutationObserverInit = {
      subtree: true,
      characterData: true
    };
    const observer = new MutationObserver(callback);

    observer.observe(node, config);

    return () => {
      observer.disconnect();
    };
  }, [highlight, usdPriceRef]);

  const upbitChangeRate = upbitMarket.scr * 100;

  // const priceIntegerLength = String(upbitMarket.tp).replace(
  //   /\.[0-9]+$/,
  //   ""
  // ).length;

  const priceDecimalLength = String(upbitMarket.tp).replace(/^[0-9]+\.?/, '').length;

  const colorPrice =
    !upbitMarket.scp || upbitMarket.scp === 0
      ? 'text-gray-400'
      : upbitMarket.scp > 0
      ? 'text-teal-500'
      : 'text-rose-500';

  const colorPremium =
    !upbitMarket.premium || upbitMarket.premium === 0
      ? 'text-gray-400'
      : upbitMarket.premium > 0
      ? 'text-teal-500'
      : 'text-rose-500';

  return (
    <tr className='border-b border-base-300 min-w-[40px] p-1 [&:hover>td]:bg-white/5'>
      <td className='market-td-padding'>
        <div className='text-center'>
          <Image
            className='object-contain overflow-hidden bg-white rounded-full'
            src={`/asset/upbit/logos/${marketSymbol}.png`}
            width={14}
            height={14}
            quality={100}
            loading='lazy'
            alt={`${upbitMarket.cd}-icon`}
          />
        </div>
        <div className='flex justify-center'>
          <div className='flex'>
            <div
              className={classNames(
                'cursor-pointer',
                favorite ? 'text-yellow-300' : 'text-gray-600'
              )}
              onClick={handleClickStarIcon(upbitMarket.cd)}
            >
              <TiPin />
            </div>
          </div>
        </div>
      </td>
      <td className='market-td-padding'>
        <div className='flex items-center'>
          <span className='text-gray-300 whitespace-pre-wrap'>{upbitMarket.korean_name}</span>
        </div>
        <div className='flex'>
          <a href={apiUrls.upbit.marketHref + upbitMarket.cd} target='_blank' rel='noreferrer'>
            <Image
              className='market-exchange-image'
              src='/icons/upbit.png'
              width={14}
              height={14}
              loading='lazy'
              alt='upbit favicon'
            />
          </a>
          <div className='market-chart-icon' onClick={handleClickMarketIcon(marketSymbol, 'UPBIT')}>
            <AiOutlineAreaChart />
          </div>
          &nbsp;
          {upbitMarket.binance_price && (
            <>
              <a
                href={`${apiUrls.binance.marketHref}/${marketSymbol}_USDT`}
                target='_blank'
                rel='noreferrer'
              >
                <Image
                  className='market-exchange-image'
                  src='/icons/binance.ico'
                  width={14}
                  height={14}
                  loading='lazy'
                  alt='binance favicon'
                />
              </a>
              <div
                className='market-chart-icon'
                onClick={handleClickMarketIcon(marketSymbol, 'BINANCE')}
              >
                <AiOutlineAreaChart />
              </div>
            </>
          )}
        </div>
      </td>
      <td className='font-mono text-right market-td-padding whitespace-nowrap'>
        <p className={colorPrice}>
          <span ref={krwPriceRef}>
            {upbitMarket.tp > 1 ? upbitMarket.tp.toLocaleString() : upbitMarket.tp}
          </span>
        </p>
        <p className={classNames('opacity-60', colorPrice)}>
          <span ref={usdPriceRef}>
            {upbitMarket.binance_price
              ? Number(upbitMarket.binance_price) * upbitForex.basePrice > 1
                ? Number(
                    (Number(upbitMarket.binance_price) * upbitForex.basePrice).toFixed(
                      priceDecimalLength
                    )
                  ).toLocaleString()
                : Number(Number(upbitMarket.binance_price) * upbitForex.basePrice).toFixed(
                    priceDecimalLength
                  )
              : null}
          </span>
        </p>
      </td>
      <td className='font-mono text-right market-td-padding whitespace-nowrap'>
        <p className={colorPrice}>{upbitChangeRate.toFixed(2)}%</p>
        <p className={classNames('opacity-60', colorPrice)}>{upbitMarket.scp.toLocaleString()}</p>
      </td>
      <td className='font-mono text-right market-td-padding whitespace-nowrap'>
        {typeof upbitMarket.premium === 'number' && (
          <>
            <p className={colorPremium}>{upbitMarket.premium.toFixed(2).padStart(2, '0')}%</p>
            <p className={classNames('opacity-60', colorPremium)}>
              {upbitMarket.binance_price &&
                Number(
                  (
                    upbitMarket.tp -
                    Number(upbitMarket.binance_price) * upbitForex.basePrice
                  ).toFixed(priceDecimalLength)
                ).toLocaleString()}
            </p>
          </>
        )}
      </td>
      <td className='font-mono text-right text-gray-400 market-td-padding whitespace-nowrap'>
        <p>{koPriceLabelFormat(upbitMarket.atp24h)}</p>
        <p className='opacity-60'>
          {upbitMarket.binance_price &&
            koPriceLabelFormat(Number(upbitMarket.binance_volume) * upbitForex.basePrice)}
        </p>
      </td>
    </tr>
  );
};

export default memo(TableItem, isEqual);
