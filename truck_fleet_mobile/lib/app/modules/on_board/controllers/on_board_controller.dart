import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/home/views/home_view.dart';

class OnBoardController extends GetxController {
  final PageController pageController = PageController();

  void nextPage() {
    if (pageController.page! >= 1.5) {
      Navigator.of(Get.context!).pushReplacement(MaterialPageRoute(builder: (context) => const HomeView()));
    } else {
      pageController.nextPage(duration: Durations.long3, curve: Curves.easeInOutCubicEmphasized);
    }
  }
}
