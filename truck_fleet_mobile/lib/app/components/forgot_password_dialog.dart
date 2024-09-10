import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:gap/gap.dart';
import 'package:truck_fleet_mobile/main.dart';

class ForgotPasswordDialog extends StatelessWidget {
  const ForgotPasswordDialog({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
      child: AlertDialog.adaptive(
        title: const Text('Forgot Password?'),
        content: const Material(
          color: Colors.transparent,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("Enter your email address and we'll send you a link to reset your password"),
              Gap(20),
              TextField(
                decoration: InputDecoration(
                  label: Text("Email"),
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
              child: const Text('Cancel')),
          TextButton(onPressed: () {}, child: const Text('Reset Password')),
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
