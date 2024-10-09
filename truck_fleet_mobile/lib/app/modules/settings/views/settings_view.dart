import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/components/custom_bottom_appbar.dart';

import '../controllers/settings_controller.dart';

class SettingsView extends GetView<SettingsController> {
  const SettingsView({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('SettingsView'),
          centerTitle: false,
          automaticallyImplyLeading: false,
        ),
        body: const Center(
          child: Text(
            'SettingsView is working',
            style: TextStyle(fontSize: 20),
          ),
        ),
        bottomNavigationBar: CustomBottomAppbar(
          actions: [
            CustomBottomAppbarItem(
              icon: TablerIcons.arrow_left,
              label: 'Back',
              onPressed: () {
                HapticFeedback.lightImpact();
                Navigator.pop(context);
              },
            )
          ],
        ));
  }
}
