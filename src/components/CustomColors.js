import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';

module.exports = {
  spacing: Spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: Colors.purple700,
    primary2Color: Colors.purple500,
    primary3Color: Colors.purple100,
    accent1Color: Colors.deepOrange500,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.grey900,
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3)
  },
};
