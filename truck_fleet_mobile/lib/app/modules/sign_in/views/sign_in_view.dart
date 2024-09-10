import 'package:flutter/material.dart';
import 'package:gap/gap.dart';

import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/components/forgot_password_dialog.dart';
import 'package:truck_fleet_mobile/app/components/language_switcher.dart';
import 'package:truck_fleet_mobile/app/components/theme_switcher.dart';

import '../controllers/sign_in_controller.dart';

class SignInView extends GetView<SignInController> {
  const SignInView({super.key});
  @override
  Widget build(BuildContext context) {
    Get.put(SignInController());
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        actions: [
          LanguageSwitcher(),
          ThemeSwitcher(),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Center(
                child: Text(
                  "welcome_back".tr,
                  style: Theme.of(context).textTheme.displayLarge,
                ),
              ),
              const Gap(40),
              TextField(
                textInputAction: TextInputAction.next,
                decoration: InputDecoration(
                  labelText: "email".tr,
                ),
                controller: controller.emailController,
              ),
              const Gap(20),
              TextField(
                keyboardType: TextInputType.visiblePassword,
                decoration: InputDecoration(
                  labelText: "password".tr,
                ),
                controller: controller.passwordController,
              ),
              const Gap(20),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    showAdaptiveDialog(
                      context: context,
                      barrierColor: Colors.black.withOpacity(0.3),
                      builder: (context) => const ForgotPasswordDialog(),
                    );
                  },
                  child: Text('forgot_password'.tr),
                ),
              ),
              const Gap(20),
              Center(child: FilledButton(onPressed: controller.signIn, child: Text('sign_in'.tr))),
              Gap(MediaQuery.sizeOf(context).height * 0.1),
            ],
          ),
        ),
      ),
    );
  }
}
