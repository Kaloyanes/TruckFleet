import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gaimon/gaimon.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';

class LanguageSwitcher extends StatelessWidget {
  LanguageSwitcher({super.key});

  final storage = GetStorage("settings_truck_fleet");

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
        Gaimon.light();

        await Get.updateLocale(Locale(value));
        storage.write("language", value);
      },
    );
  }
}
