import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ToastService {
  static Widget toast(String message) {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(Get.context!).colorScheme.surfaceBright,
        borderRadius: BorderRadius.circular(16),
      ),
      width: double.infinity,
      height: 150,
      child: Text(message),
    );
  }

  static void showToast(String message) {
    Get.showSnackbar(
      GetSnackBar(
        backgroundColor: Theme.of(Get.context!).colorScheme.inverseSurface,
        messageText: Text(message, style: TextStyle(color: Theme.of(Get.context!).colorScheme.onInverseSurface)),
        dismissDirection: DismissDirection.up,
        forwardAnimationCurve: Curves.easeInOutCubicEmphasized,
        reverseAnimationCurve: Curves.easeInOutCubicEmphasized.flipped,
        duration: const Duration(seconds: 3),
        animationDuration: Durations.extralong4,
        snackPosition: SnackPosition.TOP,
        icon: Icon(
          Icons.check_circle,
          color: Theme.of(Get.context!).colorScheme.onInverseSurface,
        ),
        shouldIconPulse: false,
        borderRadius: 16,
        margin: const EdgeInsets.all(16),
      ),
    );
  }
}
