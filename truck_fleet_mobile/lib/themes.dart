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
  primary: Color.fromARGB(255, 250, 250, 250), // --primary
  onPrimary: Color.fromARGB(255, 23, 23, 23), // --primary-foreground
  secondary: Color.fromARGB(255, 50, 50, 50), // --secondary
  onSecondary: Color.fromARGB(255, 250, 250, 250), // --secondary-foreground
  surface: Color.fromARGB(255, 0, 0, 0), // --card or --background
  surfaceBright: Color.fromARGB(255, 23, 23, 23), // --card or --background
  onSurface: Color.fromARGB(255, 250, 250, 250), // --foreground
  error: Color.fromARGB(255, 131, 31, 31), // --destructive
  onError: Color.fromARGB(255, 250, 250, 250), // --destructive-foreground
  outline: Color.fromARGB(255, 38, 38, 38), // --border
  shadow: Color.fromARGB(255, 212, 212, 212), // --ring
  primaryContainer: Color.fromARGB(255, 61, 99, 198), // --chart-1
  secondaryContainer: Color.fromARGB(255, 44, 153, 153), // --chart-2
  tertiaryContainer: Color.fromARGB(255, 242, 151, 72), // --
);

const radius = 6.0;

ThemeData lightTheme() {
  final theme = ThemeData(
    colorScheme: lightColorScheme,
    scaffoldBackgroundColor: lightColorScheme.surface,
    dividerTheme: DividerThemeData(
      color: lightColorScheme.outline,
      space: 10,
      thickness: 1,
    ),
    splashFactory: InkSparkle.splashFactory,
    useMaterial3: true,
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ButtonStyle(
        foregroundColor: WidgetStateProperty.all(lightColorScheme.surface),
        backgroundColor: WidgetStateProperty.all(lightColorScheme.primary),
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
    textButtonTheme: TextButtonThemeData(
      style: ButtonStyle(
        foregroundColor: WidgetStateProperty.all(lightColorScheme.primary),
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
        foregroundColor: WidgetStateProperty.all(lightColorScheme.primary),
        side: WidgetStateProperty.all(BorderSide(color: lightColorScheme.primary)),
        shape: WidgetStateProperty.resolveWith<OutlinedBorder>(
          (Set<WidgetState> states) {
            return RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(states.contains(WidgetState.pressed) ? radius + 6 : radius),
            );
          },
        ),
      ),
    ),
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {
        TargetPlatform.android: CupertinoPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
      },
    ),
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: lightColorScheme.primary,
      foregroundColor: lightColorScheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radius + 6),
      ),
      elevation: 4,
      highlightElevation: 8,
    ),
  );

  return theme.copyWith(textTheme: GoogleFonts.interTextTheme(theme.textTheme));
}

ThemeData darkTheme() {
  final theme = ThemeData(
    colorScheme: darkColorScheme,
    scaffoldBackgroundColor: darkColorScheme.surface,
    dividerTheme: DividerThemeData(
      color: darkColorScheme.outline,
      space: 10,
      thickness: 1,
    ),
    splashFactory: InkSparkle.splashFactory,
    useMaterial3: true,
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ButtonStyle(
        foregroundColor: WidgetStateProperty.all(darkColorScheme.surface),
        backgroundColor: WidgetStateProperty.all(darkColorScheme.primary),
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
    textButtonTheme: TextButtonThemeData(
      style: ButtonStyle(
        foregroundColor: WidgetStateProperty.all(darkColorScheme.primary),
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
        foregroundColor: WidgetStateProperty.all(darkColorScheme.primary),
        side: WidgetStateProperty.all(BorderSide(color: darkColorScheme.primary)),
        shape: WidgetStateProperty.resolveWith<OutlinedBorder>(
          (Set<WidgetState> states) {
            return RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(states.contains(WidgetState.pressed) ? radius + 6 : radius),
            );
          },
        ),
      ),
    ),
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {
        TargetPlatform.android: CupertinoPageTransitionsBuilder(),
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
      },
    ),
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: darkColorScheme.primary,
      foregroundColor: darkColorScheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radius + 6),
      ),
      elevation: 4,
      highlightElevation: 8,
    ),
  );

  return theme.copyWith(textTheme: GoogleFonts.interTextTheme(theme.textTheme));
}
