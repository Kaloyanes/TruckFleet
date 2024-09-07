import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';

class IntroductionView extends StatelessWidget {
  const IntroductionView({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              "introduce_yourself".tr,
              style: Theme.of(context).textTheme.displayLarge!.copyWith(
                    fontWeight: FontWeight.w900,
                  ),
            ),
            const Gap(20),
            TextField(
              decoration: InputDecoration(
                labelText: "enter_your_name".tr,
              ),
            ),
            const Gap(10),
            TextField(
              decoration: InputDecoration(
                labelText: "email".tr,
              ),
            ),
            const Gap(150)
          ],
        ),
      ),
    );
  }
}
