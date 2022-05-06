import { FC, Fragment } from 'react';
import {ThemeProvider, createGlobalStyle} from 'styled-components';
import * as PT from 'prop-types';

interface AppThemeInput {
  children: any;
  forModal?: boolean;
  forPublic?: boolean;
}

const colors = {
    blueVeryLight: '#EFF1F2',//'#F3F3F3',//'#E3E8EE',
    blueSuperLight: '#f0f0f7',
    black: '#111111',
    cyan: '#0080A3',
    cyanLight: '#C4DEF2',
    cyanMiddleLight: '#d6e7ea',
    cyanVeryLight: '#E0F7FF',
    cyanSuperLight: '#F6FAFC',
    gray: '#646464',
    graySuperLight: '#f9f9f9', //f0f0f0
    grayVeryLight: '#e0e0e0', // 'GRAY 7 Primary: Avatar/Image placeholder background color',
    grayLight: '#949494', // 'GRAY 4 Primary: Icons, primary button background, large text link color',
    grayMedium: '#767676', //'GRAY 3 Primary: Secondary text, error message text, small text link color',
    grayDark: '#212121',//'GRAY 1 Primary : Primary text for background 9 to 10',
    dark: '#181818',
    orange: '#f5a623',
    yellow: '#fed106',
    orangeLight: '#f5d69c',
    orangeVeryLight: '#fffcf5',
    red: '#d9534f',
    redVeryLight: '#FFF8F9',
    redLight: '#eeaaa3',
    redDark: '#CB343B',
    white: '#fefefe',
};

const colorUsage = {
    primary: colors.cyan,
    primaryLight: colors.cyanLight,
    primaryVeryLight: colors.cyanVeryLight,
    primarySuperLight: colors.cyanSuperLight,
    warning: colors.orange,
    warningLight: colors.orangeLight,
    warningVeryLight: colors.orangeVeryLight,
    info: colors.cyan,
    infoLight: colors.cyanLight,
    infoVeryLight: colors.cyanVeryLight,
    error: colors.red,
    errorVeryLight: colors.redVeryLight,
    errorLight: colors.redLight,
    errorDark: colors.redDark,
    background: colors.blueVeryLight,
    white: colors.white,
};

const themeconfig = {
    background: {
        color: {
            form: colorUsage.primarySuperLight,
            bubble: colors.cyanSuperLight,
            input: colors.grayVeryLight,
            general: colorUsage.background,
            content: colorUsage.white,
            header: colors.graySuperLight,
            tableHeader: colorUsage.primarySuperLight,
            skeleton1: colors.graySuperLight,
            skeleton2: colors.white,
            primary: colors.cyan,
            hover: colors.cyanVeryLight,
            infoLight: colors.cyanMiddleLight,
            warning: colors.orangeVeryLight,
            yellow: colors.yellow
        },
    },
    border: {
        color: {
            light: colors.grayVeryLight,
            superLight: colors.graySuperLight,
            regular: colors.grayLight,
            cyanLight: colors.cyanLight,
            warning: colors.orange,
            cyan: colors.cyan,
            primary: colors.cyan,
        },
        radius: {
            modal: '6px',
            page: '6px',
            formElement: '4px',
            popup: '3px',
            menu: '2px',
            info: '6px'
        },
        outline: {
            regular: `inset 0px 0px 0px 1px ${colors.grayLight}`,
            dark: `inset 0px 0px 0px 1px ${colors.grayMedium}`,
            primary: `inset 0px 0px 0px 1px ${colors.cyanLight}`,
        },
        shadow: {
            shallow: '0 7px 14px 0 rgba(60,66,87, 0.1), 0 3px 6px 0 rgba(0, 0, 0, .07)',
            regular: '0 6px 12px rgba(0, 0, 0,.175)',
            high: '0 10px 15px -2px rgba(0,0,0,0.2)',
            input: '0 1px 1px 0 rgba(216,224,234,0.5)',
        },
    },
    text: {
        color: {
            dark: colors.grayDark,
            medium: colors.grayMedium,
            light: colors.grayLight,
            white: colors.white,
            primary: colors.cyan,
            warning: colors.orange,
            red: colors.red
        },
        size: {
            base: '14px',
            regular: '1rem',
            headerIcon: '2rem',
            icon: '1.829rem',
            superBase: '2.429rem',
            heading0: '1.829rem',
            heading1: '1.429rem',
            heading2: '1.285rem',
            heading3: '1.143rem',
            heading4: '1.071rem',
            subBase: '0.9286rem',
            miniBase: '0.8286rem',
            tinyBase: '0.6286rem',
        },
        weight: {
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
        fontFamily: `"Helvetica Neue", Helvetica, Arial !default;`//'-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, "Helvetica", sans-serif;',
    },
    state: {
        color: {
            rowHover: colorUsage.primarySuperLight,
            rowSelected: colorUsage.primaryVeryLight,
            elementHover: colorUsage.primaryVeryLight,
            elementSelected: colorUsage.primaryLight,
            error: colorUsage.error,
            errorDark: colorUsage.errorDark,
            errorLight: colorUsage.errorLight,
            errorVeryLight: colorUsage.errorVeryLight,
            disabled: colors.graySuperLight,
            success: colorUsage.primary,
            info: colorUsage.info,
            infoLight: colorUsage.infoLight,
            infoVeryLight: colorUsage.infoVeryLight,
            warning: colorUsage.warning,
            warningLight: colorUsage.warningLight,
            warningVeryLight: colorUsage.warningVeryLight,
        },
        focus: {
            outline: `0px 0px 0px 3px ${colorUsage.primaryLight}`,
            outlineInvert: `0px 0px 0px 2px ${colorUsage.primaryLight}`,
        },
    },
    general: {
        color: {
            main: colorUsage.primary,
            mainLight: colorUsage.primarySuperLight,
            link: colorUsage.primary,
        },
    },
    sizeChart: {
        input: {
            XS: '5em',
            SM: '9em',
            MD: '17em',
            BG: '20em',
            LG: '26em',
            XL: '38em',
            FULL: '100%',
        },
        modal: {
            SM: '500px',
            MD: '600px',
            BG: '740px',
            LG: '920px',
            XL: '1100px',
        },
        modalHeight: {
            SM: 'auto',
            MD: 'auto',
            BG: '500px',
            LG: 'auto',
            XL: 'auto',
        },
        maxWidth: 1300,
    },
    breakpoints: {
        XS: '320px',
        SM: '425px',
        MD: '768px',
        BG: '800px',
        LG: '1024px',
        XL: '1440px',
    },
};

const PrivateStyle = createGlobalStyle`
  html {
    font-size: ${`${themeconfig.text.size.base}`};
    height: 100%;
    -webkit-overflow-scrolling: touch;
  }

  body {
    font-size: ${`${themeconfig.text.size.base}`};
    background-color: ${themeconfig.background.color.general};
    box-sizing: border-box;
    margin: 0;
    -webkit-overflow-scrolling: touch;
  }

  div, input, button, select, textarea {
    font-size: ${`${themeconfig.text.size.base}`};
  }

  body, div, input, button, select, textarea {
    font-family: ${themeconfig.text.fontFamily};
    /*-webkit-font-smoothing: antialiased;*/
  }

  h1 {
    font-size: 1.6em;
  }


  a {
    color: ${themeconfig.general.color.link};

    &:visited {
      color: ${themeconfig.general.color.link};
    }
  }
`;

const PublicStyle = createGlobalStyle`
  body, div, input, button, select, textarea {
    font-size: ${`${themeconfig.text.size.base}`};
    font-family: ${themeconfig.text.fontFamily};
    color: ${themeconfig.text.color.dark};
  }

  h1 {
    font-size: ${({theme}) => themeconfig.text.size.heading1};
  }

  /* stylelint-disable-next-line no-descending-specificity */
  /*a {
    color: ${themeconfig.general.color.link};

    &:visited {
      color: ${themeconfig.general.color.link};
    }
  }*/

  body {
    background-color: ${themeconfig.background.color.general};
    box-sizing: border-box;
  }
`;
/** Note on App Theme: As Modals are tunneled through Portal to root DOM, the theme provider will be removed as well.
 * The FormModel container will therefore use AppTheme, but without the GlobalStyle, as this is retained still. Therefore
 * check if AppTheme is used for modal so not to reset GlobalStyle
 * @param children
 * @param forModal
 * @param forPublic
 * @returns {*}
 * @constructor
 */
const AppTheme: FC<AppThemeInput> = ({children, forModal, forPublic}) => (
        <>
            <ThemeProvider theme={themeconfig}>{children}</ThemeProvider>
            {!forModal && !forPublic && <PrivateStyle/>}
            {!forModal && forPublic && <PublicStyle/>}
        </>
);

AppTheme.propTypes = {
    forModal: PT.bool,
    forPublic: PT.bool,
};

AppTheme.defaultProps = {
    forModal: false,
    forPublic: false,
};

export {AppTheme, themeconfig};
