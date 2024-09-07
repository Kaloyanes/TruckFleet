import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:get/get.dart';

class ThemeSwitcher extends StatelessWidget {
  const ThemeSwitcher({super.key});

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<ThemeMode>(
      icon: const Icon(TablerIcons.moon),
      tooltip: 'Select theme',
      onSelected: (ThemeMode selectedMode) {
        // TODO: Implement theme switching logic
        print('Selected theme: $selectedMode');
        HapticFeedback.lightImpact();
        Get.changeThemeMode(selectedMode);
      },
      clipBehavior: Clip.hardEdge,
      itemBuilder: (BuildContext context) => <PopupMenuEntry<ThemeMode>>[
        const PopupMenuItem<ThemeMode>(
          value: ThemeMode.light,
          child: Text('Light theme'),
        ),
        const PopupMenuItem<ThemeMode>(
          value: ThemeMode.dark,
          child: Text('Dark theme'),
        ),
        const PopupMenuItem<ThemeMode>(
          value: ThemeMode.system,
          child: Text('System theme'),
        ),
      ],
    );
  }
}
