import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/controllers/sign_up_controller.dart';
import 'package:truck_fleet_mobile/app/utils/themes.dart';

class PhotoView extends GetView<SignUpController> {
  const PhotoView({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(SignUpController());
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.max,
          children: [
            Text(
              "lets_upload_photo".tr,
              style: Theme.of(context).textTheme.displayLarge!.copyWith(
                    fontWeight: FontWeight.w900,
                  ),
            ),
            const Gap(50),
            Obx(
              () => Center(
                child: GestureDetector(
                  onTap: controller.addPhotos,
                  onTapDown: (details) => controller.isProfilePictureFocused.value = true,
                  onTapUp: (details) => controller.isProfilePictureFocused.value = false,
                  onTapCancel: () => controller.isProfilePictureFocused.value = false,
                  child: AnimatedContainer(
                    curve: Curves.easeInOutCubicEmphasized,
                    duration: Durations.long2,
                    decoration: BoxDecoration(
                      borderRadius:
                          BorderRadius.circular(controller.isProfilePictureFocused.value ? radius + 6 : radius),
                      border: Border.all(color: Theme.of(context).colorScheme.outline),
                    ),
                    width: MediaQuery.sizeOf(context).width * 0.7,
                    height: MediaQuery.sizeOf(context).width * 0.7,
                    padding:
                        controller.profilePicture.value != null ? const EdgeInsets.all(0) : const EdgeInsets.all(20),
                    clipBehavior: Clip.none,
                    child: controller.profilePicture.value == null
                        ? const Icon(TablerIcons.plus, size: 50)
                        : AnimatedContainer(
                            curve: Curves.easeInOutCubicEmphasized,
                            duration: Durations.long2,
                            decoration: BoxDecoration(
                              borderRadius:
                                  BorderRadius.circular(controller.isProfilePictureFocused.value ? radius + 6 : radius),
                            ),
                            clipBehavior: Clip.hardEdge,
                            child: Image.memory(
                              controller.profilePictureBytes.value!,
                              fit: BoxFit.cover,
                            ),
                          ),
                  ),
                ),
              ),
            ),
            Gap(MediaQuery.sizeOf(context).height * 0.15),
          ],
        ),
      ),
    );
  }
}
