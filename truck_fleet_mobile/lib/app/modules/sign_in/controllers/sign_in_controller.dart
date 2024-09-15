import 'dart:ui';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/home/views/home_view.dart';
import 'package:truck_fleet_mobile/app/services/toast_service.dart';

class SignInController extends GetxController {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  final signInFormKey = GlobalKey<FormState>();

  final isPasswordVisible = false.obs;

  void signIn() async {
    if (!signInFormKey.currentState!.validate()) {
      return;
    }

    showDialog(
      context: Get.context!,
      builder: (context) => BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      ),
    );

    await FirebaseAuth.instance
        .signInWithEmailAndPassword(email: emailController.text.trim(), password: passwordController.text.trim());

    Navigator.of(Get.context!).pop();

    // toastification.showCustom(
    //   builder: (context, holder) => Container(
    //     margin: const EdgeInsets.all(16),
    //     decoration: BoxDecoration(
    //       color: Theme.of(context).colorScheme.surface,
    //       borderRadius: BorderRadius.circular(16),
    //     ),
    //     width: double.infinity,
    //     height: 150,
    //     child: const Text("Signed In"),
    //   ),
    //   autoCloseDuration: const Duration(seconds: 3),
    //   dismissDirection: DismissDirection.up,
    // );

    ToastService.showToast("Signed In");

    Navigator.pushAndRemoveUntil(
      Get.context!,
      MaterialPageRoute(builder: (context) => const HomeView()),
      (route) => false,
    );
  }
}
