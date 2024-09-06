import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/introduction_view.dart';

class SignUpController extends GetxController {
  var pages = <Widget>[
    const IntroductionView(),
  ].obs;

  PageController pageController = PageController();
  final page = 1.0.obs;
  final progress = 0.0.obs;

  @override
  void onInit() {
    super.onInit();
    progress.value = 1 / pages.length;

    pageController.addListener(() {
      final page = pageController.page ?? 0;
      progress.value = (page + 1) / pages.length;
    });
  }

  @override
  void onClose() {
    pageController.dispose();
    super.onClose();
  }

  void nextPage() {
    final nextPageIndex = (pageController.page?.round() ?? 0) + 1;
    if (nextPageIndex < pages.length) {
      Get.to(
        () => pages[nextPageIndex],
        transition: Transition.rightToLeft,
        duration: const Duration(milliseconds: 800), // Adjust this value as needed
        curve: Curves.easeInOutCubicEmphasized,
      );
    }
  }
}
