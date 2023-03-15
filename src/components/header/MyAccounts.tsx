import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { IUpbitAccount } from 'src/types/upbit';
import { BsDot } from 'react-icons/bs';
import { useExchangeStore } from 'src/store/exchangeSockets';
import shallow from 'zustand/shallow';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useSiteSettingStore } from 'src/store/siteSetting';
import classNames from 'classnames';
import { useUpbitApiStore } from 'src/store/upbitApi';

interface IMyAccountsProps {
  upbitAccounts: Array<IUpbitAccount>;
}

const MyAccounts = memo(({ upbitAccounts: upbitAccountsTemp }: IMyAccountsProps) => {
  const upbitMarketDatas = useExchangeStore(({ upbitMarketDatas }) => upbitMarketDatas, shallow);
  const { visibleCurrencyBalances, hideCurrencyBalances, showCurrencyBalances } =
    useSiteSettingStore(
      ({ visibleCurrencyBalances, hideCurrencyBalances, showCurrencyBalances }) => ({
        visibleCurrencyBalances,
        hideCurrencyBalances,
        showCurrencyBalances
      }),
      shallow
    );
  let krwAccount: typeof upbitAccounts[number] | null = null;

  const upbitAccounts = upbitAccountsTemp
    .map(
      (account) =>
        ({
          ...account,
          totalBalance: Number(account.balance) + Number(account.locked),
          currentPrice:
            account.currency === 'KRW'
              ? visibleCurrencyBalances
                ? 1
                : undefined
              : upbitMarketDatas['KRW-' + account.currency]?.tp
        } as IAccountItemProps['account'])
    )
    .filter((account) => typeof account.currentPrice === 'number')
    .sort((a, b) => {
      if (typeof a.currentPrice !== 'number') {
        return 1;
      } else if (typeof b.currentPrice !== 'number') {
        return -1;
      }
      return b.currentPrice * b.totalBalance - a.currentPrice * a.totalBalance;
    });

  const handleClickVisibleCurrencyBalanceBtn = () => {
    if (visibleCurrencyBalances) {
      hideCurrencyBalances();
    } else {
      showCurrencyBalances();
    }
  };

  return (
    <div className='flex items-center px-2 text-xs lg:text-sm'>
      <div
        className='tooltip tooltip-right whitespace-nowrap'
        data-tip='KRW 마켓에 있는 코인만 지원합니다.'
      >
        <span>잔고&nbsp;</span>
      </div>
      <div className='flex flex-grow flex-wrap whitespace-nowrap gap-x-2 scrollbar-hidden'>
        {upbitAccounts.map((account) => (
          <AccountItem
            key={`header-my-account-${account.currency}`}
            account={account}
            visibleBalance={visibleCurrencyBalances}
          />
        ))}
      </div>
      <div>
        <button
          className='btn btn-circle btn-ghost btn-sm flex-center tooltip tooltip-left w-[1.5em] h-[1.5em] min-h-0'
          data-tip='평가금액 표시/숨기기'
          onClick={handleClickVisibleCurrencyBalanceBtn}
        >
          <label
            className={classNames('swap swap-rotate', visibleCurrencyBalances ? 'swap-active' : '')}
          >
            <span className='swap-on fill-current'>
              <AiFillEye />
            </span>
            <span className='swap-off fill-current'>
              <AiFillEyeInvisible />
            </span>
          </label>
        </button>
      </div>
    </div>
  );
}, isEqual);

MyAccounts.displayName = 'MyAccounts';

type AccountItemsProps = {
  upbitAccounts: Array<
    IUpbitAccount & {
      currentPrice?: number | undefined;
      totalBalance: number;
    }
  >;
  visibleCurrencyBalances: boolean;
};

interface IAccountItemProps {
  account: IUpbitAccount & { currentPrice?: number; totalBalance: number };
  visibleBalance?: boolean;
}

const AccountItem = memo(({ account, visibleBalance }: IAccountItemProps) => {
  const upbitMarketData = useExchangeStore(
    (state) => state?.upbitMarketDatas?.['KRW-' + account.currency],
    shallow
  );
  const currentPrice = account.currency === 'KRW' ? 1 : upbitMarketData?.tp;

  const {
    avg_buy_price,
    // avg_buy_price_modified,
    balance,
    currency,
    locked,
    // unit_currency,
    totalBalance
  } = {
    avg_buy_price: Number(account.avg_buy_price),
    // avg_buy_price_modified: account.avg_buy_price_modified,
    balance: Number(account.balance),
    currency: account.currency,
    locked: Number(account.locked),
    // unit_currency: account.unit_currency,
    totalBalance: account.totalBalance
  };
  const profitAndLoss = Number((-((1 - currentPrice / avg_buy_price) * 100)).toFixed(2));
  const totalPurchaseValue = totalBalance * avg_buy_price;
  const appraisedValue = totalBalance * currentPrice;

  const handleClickChangeMarketButton = () => {
    useUpbitApiStore.getState().setUpbitTradeMarket(`KRW-${currency}`.toUpperCase());
  };
  // const upbitLink =
  // currency !== 'KRW'
  //   ? `${apiUrls.upbit.marketHref + 'KRW-' + currency}`
  //   : 'https://upbit.com/investments/balance';

  const colorPrice =
    !profitAndLoss || profitAndLoss === 0
      ? 'text-gray-400'
      : profitAndLoss > 0
      ? 'text-teal-500'
      : 'text-rose-500';
  return (
    <>
      <div className='flex items-center font-mono'>
        <BsDot />
        <div
          className={classNames(
            'font-bold',
            currency !== 'KRW' && 'cursor-pointer hover:underline'
          )}
          onClick={currency !== 'KRW' ? handleClickChangeMarketButton : undefined}
        >
          {currency}
        </div>
        {currency !== 'KRW' ? (
          <div className='dropdown dropdown-hover dropdown-end'>
            <label tabIndex={0}>
              <p className={colorPrice}>
                &nbsp;
                {visibleBalance &&
                  `${profitAndLoss > 0 ? '+' : profitAndLoss < 0 ? '-' : ''}${Math.round(
                    currentPrice * totalBalance
                  ).toLocaleString()}₩ `}
                {`${profitAndLoss > 0 ? '+' : profitAndLoss < 0 ? '' : ''}${profitAndLoss.toFixed(
                  2
                )}%`}
              </p>
            </label>
            <div className='dropdown-content grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 bg-base-300 p-2 [&>p:nth-child(even)]:text-right'>
              <p>매수가</p>
              <p>{avg_buy_price.toLocaleString()}</p>
              <p>현재가</p>
              <p>{currentPrice.toLocaleString()}</p>
              <p>매수금액</p>
              <p>{Math.round(totalPurchaseValue).toLocaleString()}</p>
              <p>평가금액</p>
              <p className={colorPrice}>{Math.round(appraisedValue).toLocaleString()}</p>
              <p>평가손익</p>
              <p className={colorPrice}>
                {Math.round(appraisedValue - totalPurchaseValue).toLocaleString()}
              </p>
              <p>보유수량</p>
              <p>{totalBalance.toFixed(8)}</p>
            </div>
          </div>
        ) : (
          <div className='dropdown dropdown-hover dropdown-end'>
            <label tabIndex={0}>
              <p>
                &nbsp;
                {`${Math.round(balance + locked).toLocaleString()}₩`}
              </p>
            </label>
            <div className='dropdown-content whitespace-nowrap grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 bg-base-300 p-2 [&>p:nth-child(even)]:text-right'>
              <p>보유</p>
              <p>{Math.round(balance + locked).toLocaleString()}</p>
              <p>사용 가능</p>
              <p>{Math.round(balance).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}, isEqual);

AccountItem.displayName = 'AccountItem';

export default MyAccounts;
