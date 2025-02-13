import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gaimon/gaimon.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class ThemeSwitcher extends StatelessWidget {
  ThemeSwitcher({super.key});

  final storage = GetStorage("settings_truck_fleet");

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<ThemeMode>(
      icon:
          Theme.of(context).brightness == Brightness.dark ? const Icon(TablerIcons.moon) : const Icon(TablerIcons.sun),
      tooltip: 'Select theme',
      onSelected: (ThemeMode selectedMode) {
        Gaimon.light();
        Get.changeThemeMode(selectedMode);

        var value = "";

        switch (selectedMode) {
          case ThemeMode.light:
            value = "light";
            break;
          case ThemeMode.dark:
            value = "dark";
            break;
          case ThemeMode.system:
            value = "system";
            break;
        }

        debugPrint("Selected theme: $value");
        storage.write("theme", value);
      },
      clipBehavior: Clip.hardEdge,
      itemBuilder: (BuildContext context) => <PopupMenuEntry<ThemeMode>>[
        PopupMenuItem<ThemeMode>(
          value: ThemeMode.light,
          child: Text('light_theme'.tr),
        ),
        PopupMenuItem<ThemeMode>(
          value: ThemeMode.dark,
          child: Text('dark_theme'.tr),
        ),
        PopupMenuItem<ThemeMode>(
          value: ThemeMode.system,
          child: Text('system_theme'.tr),
        ),
      ],
    );
  }
}
