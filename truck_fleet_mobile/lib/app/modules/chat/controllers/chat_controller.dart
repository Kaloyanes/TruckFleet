import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/layout/controllers/layout_controller.dart';

class ChatController extends GetxController {
  //TODO: Implement ChatController

  final layoutController = Get.find<LayoutController>();

  final scrollController = ScrollController();

  @override
  void onInit() {
    super.onInit();
    scrollController.addListener(() {
      layoutController.hideNavigationBar.value =
          scrollController.position.userScrollDirection == ScrollDirection.reverse;
    });
  }
}
