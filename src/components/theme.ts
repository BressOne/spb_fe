import { theme } from "@chakra-ui/theme";

const boundries = ["576px", "768px", "1024px", "1440px", "2000px"];

const breakpoints = {
  sm: boundries[0],
  md: boundries[1],
  lg: boundries[2],
  xl: boundries[3],
  xxl: boundries[4],
};

const styleguideColors = {
  gray100: "#EDF2F7",
  gray200: "#E2E8F0",
  gray300: "#CBD5E0",
  gray400: "#A0AEC0",
  gray500: "#718096",
  gray700: "#2D3748",
  gray900: "#171923",
  _main: "#F14A42",
};

const brandColors = {
  text: styleguideColors.gray900,
  textSecondary: styleguideColors.gray500,

  background: "#fff",
  border: styleguideColors.gray200,
  divider: styleguideColors.gray300,
  black: "#000",
  unavailableDish: "#f14a421a",
  gray: {
    ...theme.colors.gray,
    800: "#171923",
  },

  link: "#1a6dbb",

  statusColor: {
    none: styleguideColors.gray900,
    completed: styleguideColors.gray500,
    pending: "#FF8500",
    approved: "#67BB0B",
    changed: "#502FC4",
    canceled: "#F5325C",
  },

  bgChecked: styleguideColors.gray300,
  bgHover: styleguideColors.gray100,

  accent: styleguideColors._main,
  inactiveText: "grey",
  variantAccent: {
    50: "#ffe7e6",
    100: "#f5c2bf",
    200: "#e89b97",
    300: "#dd746e",
    400: "#d24d46",
    500: styleguideColors._main,
    600: "#d24d46",
    700: "#681b18",
    800: "#410e0c",
    900: "#1d0200",
  },

  defaultButton: {
    50: "#f2f2f2",
    100: "#d9d9d9",
    200: "#bfbfbf",
    300: "#a6a6a6",
    400: "#8c8c8c",
    500: "#718096",
    600: "#595959",
    700: "#404040",
    800: "#262626",
    900: "#0d0d0d",
  },

  primaryButton: {
    50: "#ffe5e3",
    100: "#feb9b6",
    200: "#f78c87",
    300: "#f36059",
    400: "#ee332a",
    500: "#F14A42", // text and border
    600: "#a6130c",
    700: "#780c08",
    800: "#490502",
    900: "#1f0000",
  },

  error: "#FF5A5F",
  success: "#67BB0B",
};

const newTheme = {
  ...theme,
  fonts: {
    heading: '"Lato", sans-serif',
    body: '"Lato", sans-serif',
  },
  zIndices: {
    ...theme.zIndices,
    localeCitySwitcher: 10,
    accountMenu: 10,
  },
  colors: {
    ...theme.colors,
    ...brandColors,
    ...styleguideColors,
  },
  breakpoints,
  fontSizes: {
    xxxl: "50px",
    xl: "32px",
    lg: "20px",
    md: "14px",
    sm: "12px",
    h1: "28px",
    h2: "24px",
    h3: "18px",
    h4: "16px",
  },
  fontWeights: {
    ...theme.fontWeights,
    extraBold: "800",
    bolder: "700",
    bold: "600",
    normal: "400",
  },
  lineHeights: {
    ...theme.lineHeights,
    main: "150%",
  },
};

export default newTheme;
