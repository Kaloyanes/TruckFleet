import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:get/get.dart';

class LanguageSwitcher extends StatelessWidget {
  const LanguageSwitcher({super.key});

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton(
      icon: const Icon(TablerIcons.language),
      itemBuilder: (context) => const [
        PopupMenuItem(
          value: "en",
          child: Text("English"),
        ),
        PopupMenuItem(
          value: "bg",
          child: Text("Български"),
        ),
      ],
      clipBehavior: Clip.hardEdge,
      onSelected: (value) async {
        // onChanged: (value) async {
        HapticFeedback.lightImpact();
        await Get.updateLocale(Locale(value));
      },
    );
  }
}
