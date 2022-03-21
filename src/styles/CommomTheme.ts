import { ThemeOptions } from '@mui/material';
import { tabsClasses } from '@mui/material/Tabs';

// default theme at https://material-ui.com/customization/default-theme/
const size = {
  px3: '0.214285714285714rem',
  px4: '0.285714285714286rem',
  px5: '0.357142857142857rem',
  px6: '0.428571428571429rem',
  px8: '0.571428571428571rem',
  px10: '0.714285714285714rem',
  px12: '0.857142857142857rem',
  px14: '1rem',
  px16: '1.142857142857143rem',
  px18: '1.285714285714286rem',
  px20: '1.428571428571429rem',
  px22: '1.571428571428571rem',
  px24: '1.714285714285714rem',
  px26: '1.857142857142857rem',
  px28: '2rem',
  px30: '2.142857142857143rem',
  px32: '2.285714285714286rem',
  px34: '2.428571428571429rem',
  px36: '2.571428571428571rem',
  px40: '2.857142857142857rem',
  px42: '3rem',
  px44: '3.142857142857143rem',
  px48: '3.428571428571429rem',
  px50: '3.571428571428571rem',
  px60: '4.285714285714286rem',
  px70: '5rem',
  px100: '7.142857142857143rem',
  px130: '9.285714285714286rem'
};

const theme = {
  size: size,
  mediaQuery: {
    /* Extra small devices (phones, 600px and down) */
    mobile: '@media only screen and (max-width: 600px)',
    /* Small devices (portrait tablets and large phones, 600px and up) */
    tablet: '@media only screen and (min-width: 600px)',
    /* Medium devices (landscape tablets, 768px and up) */
    landscapeTablet: '@media only screen and (min-width: 768px)',
    /* Large devices (laptops/desktops, 992px and up) */
    laptop: '@media only screen and (min-width: 992px)',
    /* Extra large devices (large laptops and desktops, 1200px and up) */
    desktop: '@media only screen and (min-width: 1200px)',
    // landscape: 폭이 높이보다 넓을 경우 landscape라 부름
    landspace: '@media only screen and (orientation: landscape)'
  },
  color: {
    absolutlyWhite: '#FFFFFF',
    absolutlyBlack: '#000000',
    white: '#FFFFFF',
    black: '#000000',
    textDefaultBlack: '#080808',
    textDefaultWhite: '#FFFFFF',
    textBlueGray: '#A4B7BB',
    htmlBackground: '#030807',
    main: '#B157E0',
    mainLight: '#CD9EE6',
    mainDark: '#8844AD',
    mainDeepDark: '#4C2661',
    mainDrakBackground: '#1A0D21',
    mainDeepDrakBackground: '#110715',
    mainLightBackground: '#ECCFFF',
    mainLightText: '#ECCFFF',
    secondaryMain: '#584524',
    redMain: '#E86D5F',
    redLight: '#F08C7D',
    redDark: '#70261B',
    redBackgroundLight: '#F7B7B0',
    redBackgroundDark: '#401E1A',
    greenMain: '#30CF5D',
    greenLight: '#7BEC9B',
    greenDark: '#249C46',
    blueMain: '#3A49F0',
    blueLight: '#B2B7F0',
    blueDark: '#2732A3',
    yellowMain: '#E6DC22',
    yellowLight: '#EAE696',
    yellowDark: '#B8AF1C',
    buttonGreen: '#1C8039',
    buttonRed: '#C2422F',
    gray01: '#FCFCFC',
    gray03: '#F9F9F9',
    gray05: '#F7F7F7',
    gray10: '#F1F1F1',
    gray15: '#E4E4E4',
    gray20: '#D9D9D9',
    gray30: '#BFBFBF',
    gray40: '#A6A6A6',
    gray50: '#939393',
    gray55: '#737373',
    gray65: '#6F6F6F',
    gray70: '#404040',
    gray80: '#252525',
    gray90: '#121212',
    gray95: '#070707',
    tooltipBackground: 'rgba(11, 12, 11, 0.92)',
    tooltipArrow: 'rgba(11, 12, 11, 0.92)'
  }
};

const CommonTheme: ThemeOptions = {
  size: theme.size,
  mediaQuery: theme.mediaQuery,
  color: theme.color,
  palette: {
    primary: {
      main: theme.color.main
      // dark: CommonStyles.LTMain02,
      // light: CommonStyles.LTMain04
    },
    secondary: {
      main: theme.color.secondaryMain
      // dark: CommonStyles.LTSecondary,
      // light: CommonStyles.LTSecondary
    },
    success: {
      main: theme.color.greenMain
      // dark: '',
      // light: ''
    },
    error: {
      main: theme.color.redMain
      // dark: '',
      // light: ''
    },
    info: {
      main: theme.color.blueMain
      // dark: CommonStyles.LTInfo01,
      // light: CommonStyles.LTInfo03
    }
    // black: CommonStyles.textDefaultBlack,
    // gray: CommonStyles.gray30
    // warning: {
    //   main: '',
    //   dark: '',
    //   light: ''
    // },
  },
  typography: {
    fontFamily: '-apple-system,BlinkMacSystemFont,helvetica,Apple SD Gothic Neo,sans-serif'
    // app: LTSize
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // '& *::selection': { backgroundColor: CommonStyles.LTMainTransparency30 },
          // '& *::-moz-selection': { backgroundColor: CommonStyles.LTMainTransparency30 }
          fontFamily: '-apple-system,BlinkMacSystemFont,helvetica,Apple SD Gothic Neo,sans-serif',
          // WebkitFontSmoothing: 'antialiased',
          // MozOsxFontSmoothing: 'grayscale',
          backgroundColor: theme.color.htmlBackground,
          color: theme.color.textDefaultWhite
        },
        code: {
          fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
        },
        a: {
          color: 'inherit',
          textDecoration: 'none'
        }
      }
    },
    MuiFilledInput: {
      defaultProps: {},
      styleOverrides: {
        root: {
          backgroundColor: 'initial',
          '&.Mui-disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
          },
          '&:hover': {
            backgroundColor: 'initial'
          },
          '&.Mui-focused': {
            backgroundColor: 'initial'
          }
        }
      }
    },
    MuiTypography: {
      defaultProps: {
        fontSize: 'inherit',
        fontWeight: 'inherit',
        color: 'inherit',
        fontFamily: 'inherit'
        // color: theme.color.textDefaultBlack
      },
      styleOverrides: {
        h1: {},
        h2: {
          fontSize: theme.size.px30,
          fontWeight: 'bold'
        },
        h3: {
          fontSize: theme.size.px24,
          fontWeight: 'bold'
        },
        h4: {
          fontSize: theme.size.px20,
          fontWeight: 'bold'
        },
        h5: {
          fontSize: theme.size.px16,
          fontWeight: 'bold'
        },
        h6: {
          fontSize: theme.size.px14
        },
        overline: {
          fontSize: theme.size.px10
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            paddingLeft: 7
          },
          '& .MuiInputAdornment-root ': {
            marginRight: 0
          },
          '& .MuiInputBase-input': {
            padding: '0.4em 0.4em'
          }
        }
      }
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
        disableFocusRipple: true,
        disableTouchRipple: true
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
        disableFocusRipple: true,
        disableTouchRipple: true
      },
      styleOverrides: {
        root: {
          minWidth: 'initial',
          // padding: "initial",
          textTransform: 'none'
        },
        contained: {
          // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        },
        containedPrimary: {
          backgroundColor: theme.color.main,
          color: theme.color.textDefaultWhite
        },
        containedSecondary: {
          backgroundColor: theme.color.secondaryMain,
          color: theme.color.textDefaultWhite
        },
        outlined: {}
      },
      variants: [
        {
          props: { size: 'small' },
          style: {
            paddingLeft: 9,
            paddingRight: 9,
            paddingTop: 3,
            paddingBottom: 3
          }
        },
        {
          props: { variant: 'contained', disabled: true },
          style: {
            color: theme.color.gray30,
            backgroundColor: theme.color.gray10,
            '&:hover': {
              color: theme.color.gray40,
              backgroundColor: theme.color.gray15
            }
          }
        },
        {
          props: { variant: 'contained', color: 'success' },
          style: {
            color: theme.color.textDefaultWhite
          }
        },
        {
          props: { variant: 'contained', color: 'info' },
          style: {
            color: theme.color.textDefaultWhite
          }
        },
        {
          props: { variant: 'outlined', color: 'error' },
          style: {}
        },
        {
          props: { variant: 'outlined', color: 'info' },
          style: {
            borderColor: theme.color.blueLight,
            backgroundColor: theme.color.blueMain
          }
        },
        {
          props: { variant: 'outlined', color: 'primary' },
          style: {}
        },
        {
          props: { variant: 'outlined', color: 'secondary' },
          style: {}
        },
        {
          props: { variant: 'outlined', color: 'success' },
          style: {}
        },
        {
          props: { variant: 'outlined', color: 'warning' },
          style: {}
        },
        {
          props: { variant: 'containedDisable' },
          style: {
            color: theme.color.gray30,
            backgroundColor: theme.color.gray10,
            '&:hover': {
              color: theme.color.gray40,
              backgroundColor: theme.color.gray15
            }
          }
        },
        {
          props: { variant: 'outlinedDisable' },
          style: {
            color: theme.color.gray30,
            borderStyle: 'solid',
            borderColor: theme.color.gray15,
            borderWidth: 1,
            borderRadius: 4,
            '&:hover': {
              borderColor: theme.color.gray20,
              backgroundColor: theme.color.gray05
            }
          }
        },
        {
          props: { variant: 'textDisable' },
          style: {
            color: theme.color.gray30,
            '&:hover': {
              color: theme.color.gray40,
              backgroundColor: theme.color.gray05
            }
          }
        },
        {
          props: { variant: 'containedGray' },
          style: {
            color: theme.color.gray50,
            backgroundColor: theme.color.gray15,
            '&:hover': {
              color: theme.color.gray65,
              backgroundColor: theme.color.gray20
            }
          }
        },
        {
          props: { variant: 'outlinedGray' },
          style: {
            color: theme.color.gray50,
            borderStyle: 'solid',
            borderColor: theme.color.gray20,
            borderWidth: 1,
            borderRadius: 4,
            '&:hover': {
              borderColor: theme.color.gray30,
              backgroundColor: theme.color.gray10
            }
          }
        },
        {
          props: { variant: 'textGray' },
          style: {
            color: theme.color.gray50,
            '&:hover': {
              color: theme.color.gray50,
              backgroundColor: theme.color.gray10
            }
          }
        }
        // {
        //   props: { variant: 'outlined', color: 'black' },
        //   style: {
        //     borderColor: CommonStyles.textDefaultBlack,
        //     backgroundColor: CommonStyles.textDefaultBlack,
        //     '&:hover': {
        //       backgroundColor: CommonStyles.gray10
        //     }
        //   }
        // },
        // {
        //   props: { variant: 'outlined', color: 'gray' },
        //   style: {
        //     borderColor: CommonStyles.gray30,
        //     backgroundColor: CommonStyles.gray10
        //   }
        // }
      ]
    },
    MuiListItemButton: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          justifyContent: 'center'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {},
        label: {
          paddingLeft: 10,
          paddingRight: 10,
          whiteSpace: 'pre-wrap'
        }
      },

      variants: [
        {
          props: { size: 'small' },
          style: {}
        }
      ]
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '& > *': {
            outline: 'none'
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          paddingLeft: '7px',
          '& > .MuiSelect-select': {}
        },
        input: {
          padding: '0.4em',
          paddingLeft: '7px'
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.2 }
          },
          [`& .${tabsClasses.scroller}`]: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: theme.color.textBlueGray
          },
          '& .MuiButtonBase-root': {
            fontWeight: 'bold'
          }
          // '& .MuiTabs-flexContainer': {
          //   borderBottomWidth: 1,
          //   borderBottomStyle: 'solid',
          //   borderBottomColor: theme.color.textBlueGray
          // }
        }
      },
      variants: [
        {
          props: { variant: 'standard' },
          style: {}
        }
      ]
    },
    MuiTab: {
      defaultProps: {
        disableFocusRipple: true,
        disableRipple: true,
        disableTouchRipple: true
      },
      styleOverrides: {
        root: {
          color: theme.color.textBlueGray
        }
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          // backdropFilter: 'blur(12px)'
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: 'inherit',
          color: 'inherit',
          textDecorationColor: 'initial'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: '1.2em',
          height: '1.2em',
          fontSize: 'inherit'
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.color.tooltipArrow
        },
        arrow: {
          color: theme.color.tooltipArrow
        }
      }
    }
  }
};

export default CommonTheme;
