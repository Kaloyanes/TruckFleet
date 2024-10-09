import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gaimon/gaimon.dart';

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
              Gaimon.light();
              Navigator.of(context).pop();
            },
      ),
    );
  }
}
