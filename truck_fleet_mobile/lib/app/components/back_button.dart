import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';

class CustomBackButton extends StatelessWidget {
  const CustomBackButton({super.key, this.onPressed, this.padding});

  final void Function()? onPressed;
  final double? padding;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(padding ?? 8),
      child: IconButton(
        icon: const Icon(TablerIcons.arrow_left),
        onPressed: onPressed ??
            () {
              HapticFeedback.mediumImpact();
              Navigator.of(context).pop();
            },
      ),
    );
  }
}
