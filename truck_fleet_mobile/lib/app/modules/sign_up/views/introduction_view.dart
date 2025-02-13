import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/controllers/sign_up_controller.dart';

class IntroductionView extends GetView<SignUpController> {
  const IntroductionView({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          autovalidateMode: AutovalidateMode.always,
          key: controller.introductionFormKey,
          child: Column(
            children: [
              Text(
                "introduce_yourself".tr,
                style: Theme.of(context)
                    .textTheme
                    .displayLarge!
                    .copyWith(
                      fontWeight: FontWeight.w900,
                    )
                    .merge(
                      GoogleFonts.playfairDisplay(),
                    ),
              ),
              const Gap(20),
              TextFormField(
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "name_required".tr;
                  }

                  if (value.length < 3) {
                    return "name_must_be_3_chars".tr;
                  }

                  if (!RegExp(r'^[a-zA-Zа-яА-Я ]+$').hasMatch(value)) {
                    return "name_must_contain_only_letters".tr;
                  }

                  if (value.split(" ").length < 2) {
                    return "name_must_contain_first_and_last_name".tr;
                  }

                  return null;
                },
                keyboardType: TextInputType.name,
                textInputAction: TextInputAction.next,
                onTapOutside: (_) => FocusScope.of(context).unfocus(),
                controller: controller.nameController,
                decoration: InputDecoration(
                  labelText: "first_and_last_name".tr,
                  prefixIcon: const Icon(
                    TablerIcons.user,
                  ),
                ),
                textCapitalization: TextCapitalization.words,
                cursorOpacityAnimates: true,
              ),
              const Gap(10),
              TextFormField(
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "email_required".tr;
                  }

                  if (!value.isEmail) {
                    return "email_not_valid".tr;
                  }

                  return null;
                },
                onTapOutside: (_) => FocusScope.of(context).unfocus(),
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
              Gap(MediaQuery.sizeOf(context).height * 0.2),
            ],
          ),
        ),
      ),
    );
  }
}
