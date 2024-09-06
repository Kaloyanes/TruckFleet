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
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        actions: const [
          LanguageSwitcher(),
          ThemeSwitcher(),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10.0),
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                  child: Text(
                    "Welcome Back To Truck Fleet",
                    style: Theme.of(context).textTheme.headlineSmall,
                    textAlign: TextAlign.center,
                  ),
                ),
                const Gap(40),
                Text("email".tr),
                const Gap(10),
                const TextField(
                  textInputAction: TextInputAction.next,
                ),
                const Gap(20),
                Text("password".tr),
                const Gap(10),
                const TextField(
                  keyboardType: TextInputType.visiblePassword,
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
                    child: const Text('Forgot Password?'),
                  ),
                ),
                const Gap(20),
                Center(child: FilledButton(onPressed: () {}, child: const Text('Sign In'))),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
