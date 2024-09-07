import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

const ColorScheme lightColorScheme = ColorScheme(
  brightness: Brightness.light,
  primary: Color.fromARGB(255, 23, 23, 23), // --primary
  onPrimary: Color.fromARGB(255, 250, 250, 250), // --primary-foreground
  secondary: Color.fromARGB(255, 245, 245, 245), // --secondary
  onSecondary: Color.fromARGB(255, 23, 23, 23), // --secondary-foreground
  surface: Color.fromARGB(255, 255, 255, 255), // --card or --background
  onSurface: Color.fromARGB(255, 71, 56, 56), // --foreground
  error: Color.fromARGB(255, 224, 49, 49), // --destructive
  onError: Color.fromARGB(255, 250, 250, 250), // --destructive-foreground
  outline: Color.fromARGB(255, 217, 217, 217), // --border
  shadow: Color.fromARGB(255, 10, 10, 10), // --ring
  primaryContainer: Color.fromARGB(255, 244, 90, 51), // --chart-1
  secondaryContainer: Color.fromARGB(255, 40, 158, 145), // --chart-2
  tertiaryContainer: Color.fromARGB(255, 44, 78, 102), // --chart-3
);

const ColorScheme darkColorScheme = ColorScheme(
  brightness: Brightness.dark,
  primary: Color(0xFFE0E0E0), // Light grey
  onPrimary: Color(0xFF121212), // Very dark grey (almost black)
  secondary: Color(0xFF303030), // Dark grey
  onSecondary: Color(0xFFE0E0E0), // Light grey
  surface: Color(0xFF121212), // Very dark grey (almost black)
  onSurface: Color(0xFFE0E0E0), // Light grey
  outline: Color(0xFF505050), // Medium grey
  shadow: Color(0x66000000), // Semi-transparent black for shadows
  surfaceTint: Color(0xFFE0E0E0), // Light grey
  inverseSurface: Color(0xFFE0E0E0), // Light grey
  onInverseSurface: Color(0xFF121212), // Very dark grey (almost black)
  primaryContainer: Color(0xFF424242), // Darker grey
  onPrimaryContainer: Color(0xFFFFFFFF), // Light grey
  secondaryContainer: Color(0xFF424242), // Darker grey
  onSecondaryContainer: Color(0xFFE0E0E0), // Light grey
  error: Color.fromRGBO(122, 30, 30, 1),
  onError: Color.fromRGBO(255, 255, 255, 1),
);

const radius = 10.0;

ThemeData theme({ColorScheme colorScheme = darkColorScheme}) {
  final theme = ThemeData(
    colorScheme: colorScheme,
    scaffoldBackgroundColor: colorScheme.surface,
    dividerTheme: DividerThemeData(
      color: colorScheme.outline,
      space: 10,
      thickness: 1,
    ),
    splashFactory: InkSparkle.splashFactory,
    useMaterial3: true,
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ButtonStyle(
        foregroundColor: WidgetStateProperty.all(colorScheme.surface),
        backgroundColor: WidgetStateProperty.all(colorScheme.primary),
        shape: WidgetStateProperty.resolveWith<OutlinedBorder>(
          (Set<WidgetState> states) {
            return RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(states.contains(WidgetState.pressed) ? radius + 6 : radius),
            );
          },
        ),
        enableFeedback: true,
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.resolveWith(
          (Set<WidgetState> states) {
            if (states.contains(WidgetState.disabled)) {
              return colorScheme.primaryContainer;
            }
            return colorScheme.primary;
          },
        ),
        foregroundColor: WidgetStateProperty.resolveWith(
          (Set<WidgetState> states) {
            if (states.contains(WidgetState.disabled)) {
              return colorScheme.onPrimaryContainer;
            }
            return colorScheme.onPrimary;
          },
        ),
        shape: WidgetStateProperty.resolveWith<OutlinedBorder>(
          (Set<WidgetState> states) {
            return RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(states.contains(WidgetState.pressed) ? radius + 6 : radius),
            );
          },
        ),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: ButtonStyle(
        foregroundColor: WidgetStateProperty.all(colorScheme.primary),
        shape: WidgetStateProperty.resolveWith<OutlinedBorder>(
          (Set<WidgetState> states) {
            return RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(states.contains(WidgetState.pressed) ? radius + 6 : radius),
            );
          },
        ),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: ButtonStyle(
        foregroundColor: WidgetStateProperty.all(colorScheme.primary),
        side: WidgetStateProperty.all(BorderSide(color: colorScheme.primary)),
        shape: WidgetStateProperty.resolveWith<OutlinedBorder>(
          (Set<WidgetState> states) {
            return RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(states.contains(WidgetState.pressed) ? radius + 6 : radius),
            );
          },
        ),
      ),
    ),
    pageTransitionsTheme: PageTransitionsTheme(
      builders: {
        TargetPlatform.android: MyTransition(),
        TargetPlatform.iOS: const CupertinoPageTransitionsBuilder(),
      },
    ),
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: colorScheme.primary,
      foregroundColor: colorScheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radius + 6),
      ),
      elevation: 4,
      highlightElevation: 8,
    ),
    iconButtonTheme: IconButtonThemeData(
      style: ButtonStyle(
        foregroundColor: WidgetStateProperty.all(colorScheme.primary),
        backgroundColor: WidgetStateProperty.all(colorScheme.surface),
        shape: WidgetStateProperty.resolveWith<OutlinedBorder>(
          (Set<WidgetState> states) {
            return RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(states.contains(WidgetState.pressed) ? radius + 6 : radius),
            );
          },
        ),
        side: WidgetStateProperty.all(BorderSide(color: colorScheme.outline)),
        padding: WidgetStateProperty.all(EdgeInsets.zero),
      ),
    ),
    appBarTheme: const AppBarTheme(
      centerTitle: true,
    ),
    popupMenuTheme: PopupMenuThemeData(
      textStyle: TextStyle(
        color: colorScheme.primary,
        fontWeight: FontWeight.w700,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radius),
      ),
      menuPadding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
      color: colorScheme.surfaceContainerHighest,
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(radius))),
      errorBorder: OutlineInputBorder(
        borderSide: BorderSide(color: colorScheme.error),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: BorderSide(color: colorScheme.primary),
        borderRadius: const BorderRadius.all(Radius.circular(radius + 6)),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderSide: BorderSide(color: colorScheme.error),
      ),
    ),
  );

  return theme.copyWith(textTheme: GoogleFonts.playfairDisplayTextTheme(theme.textTheme));
}

class MyTransition extends PageTransitionsBuilder {
  @override
  Widget buildTransitions<T>(
    PageRoute<T> route,
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    const begin = Offset(1.0, 0.0);
    const end = Offset.zero;
    const enterCurve = Curves.easeInOutCubicEmphasized;

    var longAnimation = CurvedAnimation(
      parent: animation,
      curve: enterCurve,
      reverseCurve: enterCurve.flipped,
    );

    var enterTween = Tween(begin: begin, end: end);

    return SlideTransition(
      position: enterTween.animate(longAnimation),
      child: child,
    );
  }
}
