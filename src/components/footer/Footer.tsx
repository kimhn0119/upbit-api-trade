import { Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Link from 'next/link';
import {
  Flex0033Box,
  Flex0066Box,
  FlexAlignItemsCenterBox,
  FlexAlignItemsCenterHeight100Box,
  FlexCenterCenterBox,
  FlexJustifyContentCenterBox,
  TextAlignCenterBox,
  Width100Box
} from '../modules/Box';
import { SiGithub, SiMaildotru } from 'react-icons/si';
import { RiGitRepositoryFill } from 'react-icons/ri';

const Container = styled('footer')(({ theme }) => ({
  backgroundColor: theme.color.gray90,
  color: theme.color.gray30
}));

const Inner = styled(FlexJustifyContentCenterBox)`
  padding: ${({ theme }) => theme.spacing(2)} 0;
  ${({ theme }) => theme.mediaQuery.mobile} {
    padding: ${({ theme }) => theme.spacing(3)} 0;
    flex-wrap: wrap;
    flex-direction: column-reverse;
  }
  ${({ theme }) => theme.mediaQuery.desktop} {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const LogoBox = styled(TextAlignCenterBox)`
  color: ${({ theme }) => theme.color.mainLightText};
  font-weight: bold;
  font-size: ${({ theme }) => theme.size.px30};
`;

const ContactBox = styled(TextAlignCenterBox)``;

const DescriptionContainer = styled(FlexAlignItemsCenterBox)`
  height: 100%;
  line-height: 1.25em;
`;
const DescriptionInner = styled('div')`
  ${({ theme }) => theme.mediaQuery.mobile} {
    padding-bottom: ${({ theme }) => theme.spacing(3)};
    text-align: center;
    border-left: 0;
  }
  border-left: 1px solid ${({ theme }) => theme.color.gray70};
  padding: 0 ${({ theme }) => theme.spacing(4)};
  height: 65%;
  display: flex;
  align-items: center;
`;

// const ContactContainer = styled(FlexJustifyContentFlexEndBox)`
//   margin-right: ${({ theme }) => theme.spacing(1.25)};
//   padding-bottom: ${({ theme }) => theme.spacing(4)};
// `;

interface FooterProps {}

const Footer: React.FC<FooterProps> = ({}) => {
  // const { data, error } = useSWR("/key", fetch);
  const theme = useTheme();

  return (
    <Container>
      <Inner>
        <Flex0033Box>
          <FlexAlignItemsCenterHeight100Box>
            <Width100Box>
              <LogoBox>
                <Typography>SOOROS</Typography>
              </LogoBox>
              {/* <ContactBox>
                <Typography>
                  <Link href="mailto:contact@sooros.com">
                    <a>contact@sooros.com</a>
                  </Link>
                </Typography>
              </ContactBox> */}
              <FlexCenterCenterBox
                sx={{
                  columnGap: 2,
                  fontSize: theme.size.px24
                }}
              >
                <a href="mailto:contact@sooros.com">
                  <div>
                    <SiMaildotru />
                  </div>
                </a>
                <a href="https://github.com/sooros5132" rel="noreferrer" target="_blank">
                  <div>
                    <SiGithub />
                  </div>
                </a>
                <a
                  href="https://github.com/sooros5132/upbit-realtime-premium"
                  rel="noreferrer"
                  target="_blank"
                >
                  <div>
                    <RiGitRepositoryFill />
                  </div>
                </a>
              </FlexCenterCenterBox>
              <FlexCenterCenterBox mt={1}>
                {process.env.NODE_ENV === 'production' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt="number of visitors"
                    src={`https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=${encodeURIComponent(
                      `https://crypto.sooros.com`
                    )}&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false`}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="75"
                    height="20"
                  >
                    <linearGradient id="smooth" x2="0" y2="100%">
                      <stop offset="0" stopColor="#bbb" stopOpacity=".1" />
                      <stop offset="1" stopOpacity=".1" />
                    </linearGradient>

                    <mask id="round">
                      <rect width="75" height="20" rx="3" ry="3" fill="#fff" />
                    </mask>

                    <g mask="url(#round)">
                      <rect width="30" height="20" fill="#555555" />
                      <rect x="30" width="45" height="20" fill="#79C83D" />
                      <rect width="75" height="20" fill="url(#smooth)" />
                    </g>

                    <g
                      fill="#fff"
                      textAnchor="middle"
                      fontFamily="Verdana,DejaVu Sans,Geneva,sans-serif"
                      fontSize="11"
                    >
                      <text x="16" y="15" fill="#010101" fillOpacity=".3">
                        hits
                      </text>
                      <text x="16" y="14" fill="#fff">
                        hits
                      </text>
                      <text x="51.5" y="15" fill="#010101" fillOpacity=".3">
                        {' '}
                        1 / 1{' '}
                      </text>
                      <text x="51.5" y="14" fill="#fff">
                        {' '}
                        1 / 1{' '}
                      </text>
                    </g>
                  </svg>
                )}
              </FlexCenterCenterBox>
            </Width100Box>
          </FlexAlignItemsCenterHeight100Box>
        </Flex0033Box>
        <Flex0066Box>
          <DescriptionContainer>
            <DescriptionInner>
              <Typography>
                SOOROS(
                <Link href="https://sooros.com">
                  <a>sooros.com</a>
                </Link>
                )는 토이프로젝트&amp;개인사용 목적으로 만들어진 사이트이며 사이트 내 모든 암호화폐
                가격 정보에 대하여 어떠한 책임을 지지 않습니다. 디지털 자산 투자에 대한 금전적
                손실은 본인 책임이며 투자에 유의하시기 바랍니다.
              </Typography>
            </DescriptionInner>
          </DescriptionContainer>
        </Flex0066Box>
      </Inner>
    </Container>
  );
};

Footer.displayName = 'Footer';

export default Footer;
