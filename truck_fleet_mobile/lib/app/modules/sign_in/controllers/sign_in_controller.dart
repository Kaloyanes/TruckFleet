import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/home/views/home_view.dart';

class SignInController extends GetxController {
  //TODO: Implement SignInController

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  void signIn() async {
    await FirebaseAuth.instance
        .signInWithEmailAndPassword(email: emailController.text.trim(), password: passwordController.text.trim());

    Navigator.pushAndRemoveUntil(
      Get.context!,
      MaterialPageRoute(builder: (context) => const HomeView()),
      (route) => false,
    );
  }
}