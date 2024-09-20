import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/home/controllers/home_controller.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
        centerTitle: true,
        actions: const [],
      ),
      body: const Column(
        children: [
          SizedBox(
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
          )
        ],
      ),
    );
  }
}
