import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/components/back_button.dart';
import 'package:truck_fleet_mobile/app/components/language_switcher.dart';

import '../controllers/settings_controller.dart';

class SettingsView extends GetView<SettingsController> {
  const SettingsView({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SettingsView'),
        centerTitle: true,
        leading: const CustomBackButton(),
      ),
      body: Center(
        child: LanguageSwitcher(),
      ),
    );
  }
}
