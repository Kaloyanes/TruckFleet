import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/controllers/sign_up_controller.dart';

class PhoneView extends GetView<SignUpController> {
  const PhoneView({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Form(
        autovalidateMode: AutovalidateMode.always,
        key: controller.phoneFormKey,
        child: SingleChildScrollView(
          child: Column(
            children: [
              Text(
                "phone".tr,
                style: Theme.of(context).textTheme.displayLarge!.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
              ),
              const Gap(10),
              Align(
                alignment: Alignment.centerLeft,
                child: Text("add_country_code".tr),
              ),
              const Gap(20),
              TextFormField(
                controller: controller.phoneController,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return "phone_number_required".tr;
                  }

                  if (!value.trim().isPhoneNumber) {
                    return "phone_number_not_valid".tr;
                  }

                  return null;
                },
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: "phone_number".tr,
                  prefix: const Text("+"),
                ),
                cursorOpacityAnimates: true,
              ),
              Gap(MediaQuery.sizeOf(context).height * 0.1),
            ],
          ),
        ),
      ),
    );
  }
}
