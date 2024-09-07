import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/controllers/sign_up_controller.dart';

class PhotoView extends GetView<SignUpController> {
  const PhotoView({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(SignUpController());
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.max,
        children: [
          Text(
            "lets_upload_photo".tr,
            style: Theme.of(context).textTheme.displayLarge!.copyWith(
                  fontWeight: FontWeight.w900,
                ),
          ),
          const Gap(100),
          Center(
            child: IconButton(
              iconSize: 50,
              padding: const EdgeInsets.all(20),
              onPressed: controller.addPhotos,
              icon: const Icon(TablerIcons.plus),
            ),
          ),
          const Gap(10),
          Obx(() {
            if (controller.profilePicture.value != null) {
              return Image.file(
                File(controller.profilePicture.value!.path),
                width: 100,
                height: 100,
                fit: BoxFit.cover,
              );
            }

            return const SizedBox.shrink();
          })
        ],
      ),
    );
  }
}
