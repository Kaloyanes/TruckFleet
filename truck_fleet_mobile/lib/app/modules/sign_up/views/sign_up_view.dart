import 'package:flutter/material.dart';

import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/components/back_button.dart';
import 'package:truck_fleet_mobile/app/components/language_switcher.dart';
import 'package:truck_fleet_mobile/app/components/theme_switcher.dart';

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
        actions: [
          LanguageSwitcher(),
          ThemeSwitcher(),
        ],
        leading: CustomBackButton(onPressed: controller.goBack),
      ),
      body: Stack(
        children: [
          PageView(
            controller: controller.pageController,
            physics: const NeverScrollableScrollPhysics(),
            children: controller.pages,
          ),
          AnimatedAlign(
            alignment: const Alignment(0, 0.9),
            curve: Curves.easeInOutCubicEmphasized,
            duration: Durations.medium2,
            child: SizedBox(
              width: MediaQuery.sizeOf(context).width * 0.9,
              height: 60,
              child: Obx(
                () => FilledButton(
                  onPressed: controller.nextPage,
                  child: Text(
                    controller.progress.value > 0.90
                        ? "sign_up".tr
                        : "continue".tr, // Changed from "Continue" to "Продължи"
                    style: Theme.of(context).textTheme.titleMedium!.copyWith(
                          fontWeight: FontWeight.w900,
                          color: Theme.of(context).colorScheme.onPrimary,
                        ),
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
