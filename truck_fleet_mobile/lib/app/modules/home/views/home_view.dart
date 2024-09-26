import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';

import 'package:gap/gap.dart';

import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/home/controllers/home_controller.dart';
import 'package:truck_fleet_mobile/app/services/background_location_service.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({super.key});
  @override
  Widget build(BuildContext context) {
    Get.put(HomeController());
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        centerTitle: true,
        actions: const [],
      ),
      body: Column(
        children: [
          const SizedBox(
            height: 90,
            width: double.infinity,
            child: Card(
              margin: EdgeInsets.symmetric(horizontal: 14),
              child: Padding(
                padding: EdgeInsets.all(8.0),
                child: Column(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Current Task",
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const Gap(20),
          ElevatedButton(
            onPressed: () async {
              if (await FlutterForegroundTask.isRunningService) {
                await BackgroundLocationService.instance.stopService();
              } else {
                await BackgroundLocationService.instance.startService();
              }
            },
            child: const Text('Start Task'),
          ),
        ],
      ),
    );
  }
}
