interface ThemeColors {
  backgroundColor: string;
  textColor: string;
  accent: string;
  warning: string;
  disabled: string;
  white: string;
  dirtyWhite: string;
  grey: string;
  lightGrey: string;
  deepGrey: string;
  blue: string;
  dark: string;
}

interface ThemeTextSizes {
  text2XL: number;
  textXL: number;
  textL: number;
  textBase: number;
  textS: number;
  textXS: number;
}

export interface Theme extends ThemeColors, ThemeTextSizes {}

class CommonTheme implements ThemeTextSizes {
  text2XL = 24;
  textXL = 20;
  textL = 18;
  textBase = 16;
  textS = 13;
  textXS = 11;
  white = '#ffffff';
  deepGrey = '#84858F';
  grey = '#999999';
  lightGrey = '#EAE9ED';
  dirtyWhite = '#F6F5F8';
  blue = '#2d63e2';
  dark = '#333333';
}

export class LightTheme extends CommonTheme {
  backgroundColor = '#ffffff';
  textColor = '#01172e';
  accent = '#00BBBB';
  warning = '#FF5146';
  disabled = '#999999';
}

export class DarkTheme extends CommonTheme {
  backgroundColor = '#01172e';
  textColor = '#ffffff';
  accent = '#00BBBB';
  warning = '#FF5146';
  disabled = '#999999';
}
