import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/controllers/sign_up_controller.dart';

class IntroductionView extends GetView<SignUpController> {
  const IntroductionView({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          autovalidateMode: AutovalidateMode.always,
          onChanged: () {
            controller.canGoNext.value = controller.introductionFormKey.currentState!.validate();
          },
          key: controller.introductionFormKey,
          child: Column(
            children: [
              Text(
                "introduce_yourself".tr,
                style: Theme.of(context).textTheme.displayLarge!.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
              ),
              const Gap(20),
              TextFormField(
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Name is required";
                  }

                  if (value.length < 3) {
                    return "Name must be at least 3 characters";
                  }

                  if (!RegExp(r'^[a-zA-Zа-яА-Я ]+$').hasMatch(value)) {
                    return "Name must only contain letters";
                  }

                  if (value.split(" ").length < 2) {
                    return "Name must contain first and last name";
                  }

                  return null;
                },
                controller: controller.nameController,
                decoration: InputDecoration(
                  labelText: "full_name".tr,
                  prefixIcon: const Icon(
                    TablerIcons.user,
                  ),
                ),
                autofocus: true,
                textCapitalization: TextCapitalization.words,
                cursorOpacityAnimates: true,
              ),
              const Gap(10),
              TextFormField(
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Email is required";
                  }

                  if (!value.isEmail) {
                    return "Email is not valid";
                  }

                  return null;
                },
                keyboardType: TextInputType.emailAddress,
                controller: controller.emailController,
                cursorOpacityAnimates: true,
                decoration: InputDecoration(
                  labelText: "email".tr,
                  prefixIcon: const Icon(
                    TablerIcons.mail,
                  ),
                ),
              ),
              const Gap(150)
            ],
          ),
        ),
      ),
    );
  }
}
