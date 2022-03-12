export const size = {
  px3: "0.214285714285714rem",
  px4: "0.285714285714286rem",
  px5: "0.357142857142857rem",
  px6: "0.428571428571429rem",
  px8: "0.571428571428571rem",
  px10: "0.714285714285714rem",
  px12: "0.857142857142857rem",
  px14: "1rem",
  px16: "1.142857142857143rem",
  px18: "1.285714285714286rem",
  px20: "1.428571428571429rem",
  px22: "1.571428571428571rem",
  px24: "1.714285714285714rem",
  px26: "1.857142857142857rem",
  px28: "2rem",
  px30: "2.142857142857143rem",
  px32: "2.285714285714286rem",
  px34: "2.428571428571429rem",
  px36: "2.571428571428571rem",
  px40: "2.857142857142857rem",
  px42: "3rem",
  px44: "3.142857142857143rem",
  px48: "3.428571428571429rem",
  px50: "3.571428571428571rem",
  px60: "4.285714285714286rem",
  px70: "5rem",
  px100: "7.142857142857143rem",
  px130: "9.285714285714286rem",
} as const;

const theme = {
  size: size,
  mediaQuery: {
    /* Extra small devices (phones, 600px and down) */
    mobile: "@media only screen and (max-width: 600px)",
    /* Small devices (portrait tablets and large phones, 600px and up) */
    tablet: "@media only screen and (min-width: 600px)",
    /* Medium devices (landscape tablets, 768px and up) */
    landscapeTablet: "@media only screen and (min-width: 768px)",
    /* Large devices (laptops/desktops, 992px and up) */
    laptop: "@media only screen and (min-width: 992px)",
    /* Extra large devices (large laptops and desktops, 1200px and up) */
    desktop: "@media only screen and (min-width: 1200px)",
    // landscape: 폭이 높이보다 넓을 경우 landscape라 부름
    landspace: "@media only screen and (orientation: landscape)",
  },
  palette: {
    absolutlyWhite: "#FFFFFF",
    absolutlyBlack: "#000000",
    textDefaultBlack: "#080808",
    textDefaultWhite: "#FFFFFF",
    textBlueGray: "#A4B7BB",
    htmlBackground: "#030807",
    redMain: "#E86D5F",
    redLight: "#F08C7D",
    redDark: "#70261B",
    greenMain: "#30CF5D",
    greenLight: "#7BEC9B",
    greenDark: "#249C46",
    blueMain: "#3A49F0",
    blueLight: "#B2B7F0",
    blueDark: "#2732A3",
    yellowMain: "#E6DC22",
    yellowLight: "#EAE696",
    yellowDark: "#B8AF1C",
    buttonGreen: "#1C8039",
    buttonRed: "#C2422F",
    gray01: "#FCFCFC",
    gray03: "#F9F9F9",
    gray05: "#F7F7F7",
    gray10: "#F1F1F1",
    gray15: "#E4E4E4",
    gray20: "#D9D9D9",
    gray30: "#BFBFBF",
    gray40: "#A6A6A6",
    gray55: "#737373",
    gray70: "#404040",
  },
  spacing(size: number) {
    return `${size * 8}px`;
  },
} as const;

export default theme;
