import 'dart:ui';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/on_board/views/on_board_view.dart';
import 'package:truck_fleet_mobile/app/services/toast_service.dart';

class MoreController extends GetxController {
  void goToPage(GetView page) {
    Navigator.push(
      Get.context!,
      MaterialPageRoute(builder: (context) => page),
    );
  }

  Future<void> signOut() async {
    FocusScope.of(Get.context!).unfocus();

    var confirm = await showAdaptiveDialog<bool>(
      context: Get.context!,
      builder: (context) {
        return AlertDialog.adaptive(
          title: const Text('Sign Out'),
          content: const Text('Are you sure you want to sign out?'),
          actions: [
            Row(
              children: [
                Expanded(
                  child: TextButton(
                    onPressed: () {
                      Navigator.of(context).pop(false);
                    },
                    child: const Text('Cancel'),
                  ),
                ),
                const Gap(8),
                Expanded(
                  child: FilledButton.tonal(
                    onPressed: () {
                      Navigator.of(context).pop(true);
                    },
                    child: const Text('Sign Out'),
                  ),
                ),
              ],
            ),
          ],
        )
            .animate()
            .fade(duration: Durations.long4, curve: Curves.easeInOutCubicEmphasized)
            .scaleXY(duration: Durations.long4, curve: Curves.easeInOutCubicEmphasized)
            .blur(
              begin: const Offset(10, 10),
              end: const Offset(0, 0),
              duration: Durations.long1,
              curve: Curves.easeInOutCubicEmphasized,
            );
      },
    );

    if (confirm == null || !confirm) return;

    showDialog(
      context: Get.context!,
      builder: (context) => BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      ),
    );
    await FirebaseAuth.instance.signOut();
    Navigator.of(Get.context!).pop();

    ToastService.showToast("Signed Out");

    Navigator.pushAndRemoveUntil(
      Get.context!,
      MaterialPageRoute(builder: (context) => OnBoardView()),
      (route) => false,
    );
  }
}
