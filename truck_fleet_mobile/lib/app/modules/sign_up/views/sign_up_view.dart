import 'dart:async';

import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/introduction_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/phone_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/photo_view.dart';

import '../controllers/sign_up_controller.dart';

class SignUpView extends GetView<SignUpController> {
  const SignUpView({super.key});
  @override
  Widget build(BuildContext context) {
    Get.put(SignUpController());
    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: AppBar(
        title: Obx(
          () => LinearProgressIndicator(
            value: controller.progress.value,
            borderRadius: BorderRadius.circular(30),
          ),
        ),
      ),
      body: Stack(
        children: [
          PageView(
            controller: controller.pageController,
            physics: const NeverScrollableScrollPhysics(),
            children: controller.pages,
          ),
          AnimatedAlign(
            alignment: Alignment(0, MediaQuery.of(context).viewInsets.bottom > 50 ? 0.9 : 0.85),
            curve: Curves.easeInOutCubicEmphasized,
            duration: Durations.medium2,
            child: SizedBox(
              width: MediaQuery.of(context).size.width * 0.9,
              height: 60,
              child: FilledButton(
                onPressed: controller.nextPage,
                child: Text(
                  "continue".tr, // Changed from "Continue" to "Продължи"
                  style: Theme.of(context).textTheme.titleMedium!.copyWith(
                        fontWeight: FontWeight.w900,
                        color: Theme.of(context).colorScheme.onPrimary,
                      ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
