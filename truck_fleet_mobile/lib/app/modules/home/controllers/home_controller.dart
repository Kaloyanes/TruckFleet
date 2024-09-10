import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/on_board/views/on_board_view.dart';

class HomeController extends GetxController {
  Future<void> signOut() async {
    FocusScope.of(Get.context!).unfocus();
    await FirebaseAuth.instance.signOut();
    Navigator.pushAndRemoveUntil(
      Get.context!,
      MaterialPageRoute(builder: (context) => const OnBoardView()),
      (route) => false,
    );
  }
}
