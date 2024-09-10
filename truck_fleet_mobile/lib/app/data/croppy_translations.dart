import 'package:croppy/croppy.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class MyCroppyLocalizationsDelegate extends LocalizationsDelegate<CroppyLocalizations> {
  @override
  bool isSupported(Locale locale) =>
      CroppyLocalizations.supportedLocales.contains(locale) || locale.languageCode == 'bg';

  @override
  Future<CroppyLocalizations> load(Locale locale) {
    if (locale.languageCode == 'bg') {
      return SynchronousFuture(CroppyLocalizationsBulgarian());
    }

    return SynchronousFuture(lookupCroppyLocalizations(locale));
  }

  @override
  bool shouldReload(MyCroppyLocalizationsDelegate old) => false;
}

class CroppyLocalizationsBulgarian extends CroppyLocalizations {
  CroppyLocalizationsBulgarian() : super('bg');

  @override
  String get cancelLabel => 'Отказ';

  @override
  String get cupertinoFreeformAspectRatioLabel => 'Свободна Форма';

  @override
  String get cupertinoOriginalAspectRatioLabel => 'Оригинален';

  @override
  String get cupertinoResetLabel => 'Премахни';

  @override
  String get cupertinoSquareAspectRatioLabel => 'Квадрат';

  @override
  String get doneLabel => 'Запазване';

  @override
  String get materialFreeformAspectRatioLabel => 'Свободна Форма';

  @override
  String materialGetFlipLabel(LocalizationDirection direction) {
    switch (direction) {
      case LocalizationDirection.horizontal:
        return 'Хоризонтално';

      case LocalizationDirection.vertical:
        return 'Вертикално';
    }
  }

  @override
  String get materialOriginalAspectRatioLabel => 'Оригинален';

  @override
  String get materialResetLabel => 'Премахни';

  @override
  String get materialSquareAspectRatioLabel => 'Квадрат';

  @override
  String get saveLabel => 'Запази';
}
