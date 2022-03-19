import React, { useContext } from 'react';
import _ from 'lodash';
import isEqual from 'react-fast-compare';
import { BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi';
import UpbitWebSocket, { UpbitWebSocketContext } from '../websocket/Upbit';
import {
  IUpbitApiTicker,
  IUpbitForex,
  IUpbitMarket,
  IUpbitSocketMessageTickerSimple
} from 'src/types/upbit';
import {
  ColorBox,
  FlexAlignItemsCenterBox,
  FlexBox,
  FlexCursorPointerBox,
  FlexJustifyContentFlexEndBox,
  MonoFontBox,
  TextAlignRightBox
} from '../modules/Box';
import { koPriceLabelFormat } from 'src/utils/utils';
import BinanceWebSocket, { BinanceWebSocketContext } from '../websocket/Binance';
import { IBinanceSocketMessageTicker } from 'src/types/binance';
import { NextSeo } from 'next-seo';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { MonoFontTypography } from '../modules/Typography';

const TableContainer = styled('div')`
  margin: 0 auto;
  max-width: 1280px;
`;
const Table = styled('table')`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  text-indent: 0;
`;
const Thead = styled('thead')``;
const Tbody = styled('tbody')`
  & tr:hover {
    background-color: ${({ theme }) => theme.color.white + '10'};
  }
`;

const TableRow = styled('tr')`
  border-bottom: 1px solid ${({ theme }) => theme.color.white + '10'};
  min-width: ${({ theme }) => theme.spacing(5)};
  padding: ${({ theme }) => theme.spacing(0.5)};
`;

const TableCell = styled('td')`
  line-height: 1.25em;
  font-size: ${({ theme }) => theme.size.px14};
`;

const TableHeaderRow = styled(TableRow)`
  background-color: ${({ theme }) => theme.color.white + '05'};
`;
const TableHeaderCell = styled(TableCell)`
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(0.5)}`};
`;

const TableHeaderSortIcon = styled(FlexAlignItemsCenterBox)`
  font-size: ${({ theme }) => theme.size.px14};
`;

const TableCellInnerBox = styled('div')`
  padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(0.5)}`};
`;

const MarketIconImage = styled('img')`
  width: 20px;
  height: 20px;
  object-fit: contain;
  background-color: rgb(255 255 255);
  border-radius: 50%;
`;

const ExchangeImage = styled('img')`
  width: 1em;
  height: 1em;
  opacity: 0.75;
  object-fit: contain;
`;

const Col = styled('col')`
  padding: ${({ theme }) => theme.spacing(0.5)};
`;

const IconCol = styled(Col)`
  font-size: ${({ theme }) => theme.size.px14};
  width: 1em;
`;
const NameCol = styled(Col)`
  width: auto;
`;
const PriceCol = styled(Col)`
  width: 15%;
`;
const ChangeCol = styled(Col)`
  width: 10%;
`;
const PremiumCol = styled(Col)`
  width: 10%;
`;
const VolumeCol = styled(Col)`
  width: 10%;
`;

const AskBidTypography = styled(MonoFontTypography)<{
  state: number;
  opacity?: number;
}>(({ theme, state, opacity }) => ({
  color:
    state === 0 ? theme.color.gray30 : state > 0 ? theme.color.greenLight : theme.color.redLight,
  opacity
}));

const krwRegex = /^krw-/i;
const usdtRegex = /^usdt-/i;
const btcRegex = /^btc-/i;

export interface IMarketTableItem extends IUpbitSocketMessageTickerSimple {
  korean_name: string;
  english_name: string;
  binance_name?: string;
  premium?: number;
}

interface MarketTableProps {
  upbitForex: IUpbitForex;
  upbitKrwList: Array<IUpbitMarket>;
  upbitMarketSnapshot?: Record<string, IMarketTableItem>;
}

const MarketTable: React.FC<MarketTableProps> = ({
  upbitForex,
  upbitKrwList,
  upbitMarketSnapshot
}) => {
  const [sortColumnName, setSortColumnName] = React.useState<keyof IMarketTableItem>('atp24h');
  const [sortType, setSortType] = React.useState<'asc' | 'desc'>('desc');
  const [stateUpdateDelay] = React.useState(200);

  const handleClickThead = (columnName: keyof IMarketTableItem) => () => {
    if (columnName === sortColumnName) {
      setSortType((prevState) => (prevState === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortType('desc');
    setSortColumnName(columnName);
  };

  return (
    <UpbitWebSocket
      marketList={upbitKrwList}
      stateUpdateDelay={stateUpdateDelay}
      upbitMarketSnapshot={upbitMarketSnapshot}
    >
      <BinanceWebSocket marketList={upbitKrwList} stateUpdateDelay={stateUpdateDelay}>
        <TableContainer>
          {/* <Head
        title={`₿ ${
          upbitRealtimeMarket["KRW-BTC"]?.trade_price?.toLocaleString() || ""
        } | SOOROS`}
      /> */}
          <Table cellSpacing="0" cellPadding="0">
            <colgroup>
              <IconCol />
              <NameCol />
              <PriceCol />
              <ChangeCol />
              <PremiumCol />
              <VolumeCol />
            </colgroup>
            <Thead>
              <TableHeaderRow>
                <TableCell>
                  <TableCellInnerBox></TableCellInnerBox>
                </TableCell>
                <TableHeaderCell>
                  <FlexCursorPointerBox onClick={handleClickThead('korean_name')}>
                    <Typography component="span">이름</Typography>
                    <TableHeaderSortIcon>
                      {sortColumnName === 'korean_name' ? (
                        sortType === 'asc' ? (
                          <BiDownArrowAlt />
                        ) : (
                          <BiUpArrowAlt />
                        )
                      ) : null}
                    </TableHeaderSortIcon>
                  </FlexCursorPointerBox>
                </TableHeaderCell>
                <TableHeaderCell>
                  <FlexJustifyContentFlexEndBox>
                    <FlexCursorPointerBox onClick={handleClickThead('tp')}>
                      <Typography component="span">현재가</Typography>
                      <TableHeaderSortIcon>
                        {sortColumnName === 'tp' ? (
                          sortType === 'asc' ? (
                            <BiDownArrowAlt />
                          ) : (
                            <BiUpArrowAlt />
                          )
                        ) : null}
                      </TableHeaderSortIcon>
                    </FlexCursorPointerBox>
                  </FlexJustifyContentFlexEndBox>
                </TableHeaderCell>
                <TableHeaderCell>
                  <FlexJustifyContentFlexEndBox>
                    <FlexCursorPointerBox onClick={handleClickThead('scr')}>
                      <Typography component="span">변동</Typography>
                      <TableHeaderSortIcon>
                        {sortColumnName === 'scr' ? (
                          sortType === 'asc' ? (
                            <BiDownArrowAlt />
                          ) : (
                            <BiUpArrowAlt />
                          )
                        ) : null}
                      </TableHeaderSortIcon>
                    </FlexCursorPointerBox>
                  </FlexJustifyContentFlexEndBox>
                </TableHeaderCell>
                <TableHeaderCell>
                  <FlexJustifyContentFlexEndBox>
                    <FlexCursorPointerBox onClick={handleClickThead('premium')}>
                      <Typography component="span">김프</Typography>
                      <TableHeaderSortIcon>
                        {sortColumnName === 'premium' ? (
                          sortType === 'asc' ? (
                            <BiDownArrowAlt />
                          ) : (
                            <BiUpArrowAlt />
                          )
                        ) : null}
                      </TableHeaderSortIcon>
                    </FlexCursorPointerBox>
                  </FlexJustifyContentFlexEndBox>
                </TableHeaderCell>
                <TableHeaderCell>
                  <FlexJustifyContentFlexEndBox>
                    <FlexCursorPointerBox onClick={handleClickThead('atp24h')}>
                      <Typography component="span">볼륨</Typography>
                      <TableHeaderSortIcon>
                        {sortColumnName === 'atp24h' ? (
                          sortType === 'asc' ? (
                            <BiDownArrowAlt />
                          ) : (
                            <BiUpArrowAlt />
                          )
                        ) : null}
                      </TableHeaderSortIcon>
                    </FlexCursorPointerBox>
                  </FlexJustifyContentFlexEndBox>
                </TableHeaderCell>
              </TableHeaderRow>
            </Thead>
            <TableBody
              upbitForex={upbitForex}
              sortColumnName={sortColumnName}
              sortType={sortType}
            />
          </Table>
        </TableContainer>
      </BinanceWebSocket>
    </UpbitWebSocket>
  );
};

const TableBody = React.memo<{
  upbitForex: IUpbitForex;
  sortColumnName: keyof IMarketTableItem;
  sortType: 'asc' | 'desc';
}>(({ upbitForex, sortColumnName, sortType }) => {
  const upbitRealtimeMarket = useContext(UpbitWebSocketContext);
  const binanceRealtimeMarket = useContext(BinanceWebSocketContext);

  const columnSort = React.useCallback(
    (aItem: IMarketTableItem, bItem: IMarketTableItem) => {
      const a = aItem[sortColumnName];
      const b = bItem[sortColumnName];
      if (typeof a === 'number' && typeof b === 'number') {
        if (sortType === 'asc') {
          return a - b;
        }
        return b - a;
      } else if (typeof a === 'string' && typeof b === 'string') {
        const aValue = a.toUpperCase();
        const bValue = b.toUpperCase();
        if (sortType === 'asc') {
          if (aValue < bValue) {
            return 1;
          }
          if (aValue > bValue) {
            return -1;
          }
        } else {
          if (aValue < bValue) {
            return -1;
          }
          if (aValue > bValue) {
            return 1;
          }
        }
        return 0;
      }
      return 0;
    },
    [sortColumnName, sortType]
  );

  const list = Object.values(upbitRealtimeMarket)
    .map((upbitMarket) => {
      const binanceMarketName = upbitMarket.cd.replace(krwRegex, '') + 'USDT';
      const binanceMarket = binanceRealtimeMarket[binanceMarketName];
      const binancePrice = binanceRealtimeMarket[binanceMarketName]
        ? Number(binanceMarket.data.p) * upbitForex.basePrice
        : undefined;
      const premium = binancePrice ? (1 - binancePrice / upbitMarket.tp) * 100 : 0;

      return {
        ...upbitMarket,
        binance_name: binanceMarketName,
        premium
      };
    })
    .sort(columnSort);

  // let bitcoinPremium: number | undefined;
  // if (binanceRealtimeMarket["BTCUSDT"] && upbitRealtimeMarket["KRW-BTC"]) {
  //   const binancePrice = binanceRealtimeMarket["BTCUSDT"]?.data?.p
  //     ? Number(binanceRealtimeMarket["BTCUSDT"]?.data?.p) * upbitForex.basePrice
  //     : undefined;
  //   bitcoinPremium =
  //     binancePrice && upbitRealtimeMarket["KRW-BTC"]
  //       ? (1 - binancePrice / upbitRealtimeMarket["KRW-BTC"]?.tp) * 100
  //       : undefined;
  // }
  const title = `${
    upbitRealtimeMarket['KRW-BTC']
      ? '₿ ' + (upbitRealtimeMarket['KRW-BTC'].scr * 100).toFixed(2) + '% | '
      : ''
  }SOOROS`;
  return (
    <>
      <NextSeo
        // title={bitcoinPremium ? `${bitcoinPremium?.toFixed(2)}%` : undefined}
        title={title}
      ></NextSeo>
      <Tbody>
        {list.map((market) => {
          return (
            <TableItem
              key={`market-table-${market.cd}`}
              upbitMarket={market}
              binanceMarket={binanceRealtimeMarket[market.binance_name]}
              upbitForex={upbitForex}
            />
          );
        })}
      </Tbody>
    </>
  );
}, isEqual);

TableBody.displayName = 'TableBody';

const TableItem = React.memo<{
  upbitMarket: IMarketTableItem;
  upbitForex: IUpbitForex;
  binanceMarket?: IBinanceSocketMessageTicker;
}>(({ upbitMarket, binanceMarket, upbitForex }) => {
  const changeRate = upbitMarket.scr * 100;
  const marketSymbol = upbitMarket.cd.replace(krwRegex, '');
  // const usdtName = marketSymbol + "USDT";
  // const priceIntegerLength = String(upbitMarket.tp).replace(
  //   /\.[0-9]+$/,
  //   ""
  // ).length;
  const priceDecimalLength = String(upbitMarket.tp).replace(/^[0-9]+\.?/, '').length;
  return (
    <TableRow>
      <TableCell>
        <TableCellInnerBox>
          <FlexAlignItemsCenterBox>
            <MarketIconImage
              src={`/asset/upbit/logos/${upbitMarket.cd.replace(krwRegex, '')}.png`}
              alt={`${upbitMarket.cd}-icon`}
            />
          </FlexAlignItemsCenterBox>
        </TableCellInnerBox>
      </TableCell>
      <TableCell>
        <TableCellInnerBox>
          <Typography color="gray20">{upbitMarket.korean_name}</Typography>
          <FlexBox>
            <a
              href={`https://upbit.com/exchange?code=CRIX.UPBIT.${upbitMarket.cd}`}
              target="_blank"
              rel="noreferrer"
            >
              <ExchangeImage src="/icons/upbit.png" alt="upbit favicon"></ExchangeImage>
            </a>
            &nbsp;
            {binanceMarket ? (
              <a
                href={`https://www.binance.com/en/trade/${marketSymbol}_USDT`}
                target="_blank"
                rel="noreferrer"
              >
                <ExchangeImage src="/icons/binance.ico" alt="upbit favicon"></ExchangeImage>
              </a>
            ) : null}
          </FlexBox>
        </TableCellInnerBox>
      </TableCell>
      <TableCell>
        <TableCellInnerBox>
          <MonoFontBox>
            <TextAlignRightBox>
              <AskBidTypography state={upbitMarket.scp}>
                {upbitMarket.tp.toLocaleString()}
              </AskBidTypography>
              <AskBidTypography state={upbitMarket.scp} opacity={0.6}>
                {binanceMarket
                  ? Number(
                      (Number(binanceMarket.data.p) * upbitForex.basePrice).toFixed(
                        priceDecimalLength
                      )
                    ).toLocaleString()
                  : null}
              </AskBidTypography>
            </TextAlignRightBox>
          </MonoFontBox>
        </TableCellInnerBox>
      </TableCell>
      <TableCell>
        <TableCellInnerBox>
          <MonoFontBox>
            <TextAlignRightBox>
              <AskBidTypography state={upbitMarket.scp}>{changeRate.toFixed(2)}%</AskBidTypography>
              <AskBidTypography state={upbitMarket.scp} opacity={0.6}>
                {upbitMarket.scp.toLocaleString()}
              </AskBidTypography>
            </TextAlignRightBox>
          </MonoFontBox>
        </TableCellInnerBox>
      </TableCell>
      <TableCell>
        <TableCellInnerBox>
          <MonoFontBox>
            {upbitMarket.premium ? (
              <TextAlignRightBox>
                <AskBidTypography state={upbitMarket.premium}>
                  {upbitMarket.premium.toFixed(2).padStart(2, '0')}%
                </AskBidTypography>
                <AskBidTypography state={upbitMarket.premium} opacity={0.6}>
                  {binanceMarket
                    ? Number(
                        (
                          upbitMarket.tp -
                          Number(binanceMarket.data.p) * upbitForex.basePrice
                        ).toFixed(priceDecimalLength)
                      ).toLocaleString()
                    : undefined}
                </AskBidTypography>
              </TextAlignRightBox>
            ) : null}
          </MonoFontBox>
        </TableCellInnerBox>
      </TableCell>
      <TableCell>
        <TableCellInnerBox>
          <MonoFontBox>
            <TextAlignRightBox>
              <MonoFontTypography color="gray30">
                {koPriceLabelFormat(upbitMarket.atp24h)}
              </MonoFontTypography>
              <MonoFontTypography color="gray30">
                {/* {binanceMarket ? koPriceLabelFormat(binanceMarket.) : null} */}
              </MonoFontTypography>
            </TextAlignRightBox>
          </MonoFontBox>
        </TableCellInnerBox>
      </TableCell>
    </TableRow>
  );
}, isEqual);
TableItem.displayName = 'TableItem';

MarketTable.displayName = 'MarketTable';

export default MarketTable;
