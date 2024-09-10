import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';

class ForgotPasswordDialog extends StatelessWidget {
  const ForgotPasswordDialog({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
      child: AlertDialog.adaptive(
        title: Text('forgot_password'.tr),
        content: Material(
          color: Colors.transparent,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("enter_your_email_address_and_we_ll_send_you_a_link_to_reset_your_password".tr),
              const Gap(20),
              TextField(
                decoration: InputDecoration(
                  label: Text("email".tr),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text('cancel'.tr)),
          TextButton(onPressed: () {}, child: Text('reset_password'.tr)),
        ],
      )
          .animate()
          .fade(duration: Durations.long4, curve: Curves.easeInOutCubicEmphasized)
          .scaleXY(duration: Durations.long4, curve: Curves.easeInOutCubicEmphasized)
          .blur(
            begin: const Offset(10, 10),
            end: const Offset(0, 0),
            duration: Durations.long1,
            curve: Curves.easeInOutCubicEmphasized,
          ),
    );
  }
}
