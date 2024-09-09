import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/controllers/sign_up_controller.dart';

class PasswordView extends GetView<SignUpController> {
  const PasswordView({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Form(
          onChanged: () {
            controller.canGoNext.value = controller.passwordFormKey.currentState!.validate();
          },
          key: controller.passwordFormKey,
          autovalidateMode: AutovalidateMode.always,
          child: Column(
            children: [
              Text(
                "make_password".tr,
                style: Theme.of(context).textTheme.displayLarge!.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
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
                      ),
                      obscureText: !controller.isPasswordVisible.value,
                      keyboardType: TextInputType.visiblePassword,
                      textInputAction: TextInputAction.next,
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
              const Gap(10),
              Obx(
                () => Stack(
                  alignment: Alignment.centerRight,
                  children: [
                    TextFormField(
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "confirm_password_is_required".tr;
                        }

                        if (value != controller.passwordController.text) {
                          return "password_and_confirm_password_must_be_same".tr;
                        }
                        return null;
                      },
                      controller: controller.confirmPasswordController,
                      decoration: InputDecoration(
                        labelText: "confirm_password".tr,
                      ),
                      obscureText: !controller.isPasswordVisible.value,
                      keyboardType: TextInputType.visiblePassword,
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
              Gap(MediaQuery.sizeOf(context).height * 0.1),
            ],
          ),
        ),
      ),
    );
  }
}
