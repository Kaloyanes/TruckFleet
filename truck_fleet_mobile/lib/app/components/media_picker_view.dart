import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:smooth_sheets/smooth_sheets.dart';
import 'package:truck_fleet_mobile/app/utils/themes.dart';

class MediaPickerView extends StatelessWidget {
  const MediaPickerView({super.key});

  @override
  Widget build(BuildContext context) {
    return BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
      child: DraggableSheet(
        maxExtent: const Extent.proportional(1),
        minExtent: const Extent.proportional(1),
        physics: const BouncingSheetPhysics(),
        child: Container(
          height: MediaQuery.sizeOf(context).height * 0.8,
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(radius + 10),
            ),
          ),
          child: Column(
            children: [
              const Gap(20),
              Container(
                height: 5,
                width: 100,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary,
                  borderRadius: BorderRadius.circular(100),
                ),
              ),
              const Gap(20),
              optionContainer(context, 'gallery'.tr, TablerIcons.photo, ImageSource.gallery),
              const Gap(20),
              optionContainer(context, 'camera'.tr, TablerIcons.camera, ImageSource.camera),
            ],
          ),
        ),
      ),
    );
  }

  Expanded optionContainer(BuildContext context, String title, IconData icon, ImageSource source) {
    var borderRadius = 20.0;

    return Expanded(
      child: Center(
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(borderRadius),
            color: Theme.of(context).colorScheme.surface,
          ),
          width: double.infinity,
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              enableFeedback: true,
              borderRadius: BorderRadius.circular(borderRadius),
              onTap: () {
                HapticFeedback.lightImpact();
                Navigator.pop(
                  context,
                  source,
                );
              },
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    icon,
                    size: 40,
                  ),
                  const Gap(10),
                  Text(title, style: Theme.of(context).textTheme.displaySmall),
                  const Gap(20),
                  if (source == ImageSource.camera)
                    FittedBox(
                      fit: BoxFit.fill,
                      clipBehavior: Clip.hardEdge,
                      child: Image.asset(
                        "lib/app/assets/images/camera.png",
                        fit: BoxFit.cover,
                        width: 300,
                        alignment: Alignment.topCenter,
                      ),
                    )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
