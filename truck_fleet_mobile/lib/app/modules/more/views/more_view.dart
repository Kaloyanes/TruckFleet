import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/profile/views/profile_view.dart';
import 'package:truck_fleet_mobile/app/modules/settings/views/settings_view.dart';
import 'package:truck_fleet_mobile/app/services/auth_service.dart';

import '../controllers/more_controller.dart';

class MoreView extends GetView<MoreController> {
  const MoreView({super.key});
  @override
  Widget build(BuildContext context) {
    Get.put(MoreController());
    return Scaffold(
      appBar: AppBar(
        title: const Text('MoreView'),
        centerTitle: true,
      ),
      body: ListView(
        children: [
          ListTile(
            title: Text('settings'.tr),
            onTap: () => controller.goToPage(
              const SettingsView(),
            ),
          ),
          ListTile(
            title: Text('profile'.tr),
            onTap: () => controller.goToPage(
              const ProfileView(),
            ),
          ),
          ListTile(
            tileColor: Theme.of(context).colorScheme.errorContainer,
            title: Text('sign_out'.tr),
            onTap: controller.signOut,
          ),
        ],
      ),
    );
  }
}
