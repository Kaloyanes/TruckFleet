import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gap/gap.dart';

import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
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
        child: Form(
          key: controller.signInFormKey,
          child: Stack(
            children: [
              SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Center(
                      child: Text(
                        "welcome_back".tr,
                        style: Theme.of(context).textTheme.displayLarge!.merge(
                              GoogleFonts.playfairDisplay(),
                            ),
                      ),
                    ),
                    const Gap(40),
                    TextFormField(
                      textInputAction: TextInputAction.next,
                      decoration: InputDecoration(
                        labelText: "email".tr,
                        prefixIcon: const Icon(TablerIcons.mail),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "email_is_required".tr;
                        }

                        return null;
                      },
                      controller: controller.emailController,
                    ),
                    const Gap(20),
                    Obx(
                      () => Stack(
                        alignment: Alignment.centerRight,
                        children: [
                          TextFormField(
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return "password_is_required".tr;
                              }

                              return null;
                            },
                            controller: controller.passwordController,
                            decoration: InputDecoration(
                              labelText: "password".tr,
                              prefixIcon: const Icon(TablerIcons.lock),
                            ),
                            obscureText: !controller.isPasswordVisible.value,
                            keyboardType: TextInputType.visiblePassword,
                            cursorOpacityAnimates: true,
                          ),
                          Positioned(
                            right: 5,
                            top: 4,
                            child: IconButton(
                              iconSize: 20,
                              onPressed: () {
                                controller.isPasswordVisible.value = !controller.isPasswordVisible.value;
                              },
                              icon: controller.isPasswordVisible.value
                                  ? const Icon(TablerIcons.eye)
                                  : const Icon(TablerIcons.eye_off),
                            ),
                          ),
                        ],
                      ),
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
                    Gap(MediaQuery.sizeOf(context).height * 0.1),
                  ],
                ),
              ),
              AnimatedAlign(
                alignment: const Alignment(0, 0.9),
                curve: Curves.easeInOutCubicEmphasized,
                duration: Durations.medium2,
                child: SizedBox(
                  width: MediaQuery.sizeOf(context).width * 0.9,
                  height: 60,
                  child: FilledButton(
                    onPressed: controller.signIn,
                    child: Text(
                      'sign_in'.tr,
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
        ),
      ),
    );
  }
}
