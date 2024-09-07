import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';

class PhoneView extends StatelessWidget {
  const PhoneView({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Text(
            "phone".tr,
            style: Theme.of(context).textTheme.displayLarge!.copyWith(
                  fontWeight: FontWeight.w900,
                ),
          ),
          const Gap(20),
          TextField(
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              labelText: "phone_number".tr,
              prefix: const Text("+"),
            ),
          ),
          const Gap(100),
        ],
      ),
    );
  }
}
