import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/controllers/sign_up_controller.dart';

class JoinOrganizationView extends GetView<SignUpController> {
  const JoinOrganizationView({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              "join_organization".tr,
              style: Theme.of(context)
                  .textTheme
                  .displayLarge!
                  .copyWith(
                    fontWeight: FontWeight.normal,
                  )
                  .merge(
                    GoogleFonts.playfairDisplay(),
                  ),
            ),
            const Gap(20),
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                "join_organization_description".tr,
                style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                      color: Theme.of(context).colorScheme.error,
                    ),
              ),
            ),
            const Gap(30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: TextFormField(
                    key: const Key("organization_code"),
                    controller: controller.organizationCodeController,
                    decoration: InputDecoration(
                      labelText: "organization_code".tr,
                    ),
                    onChanged: (value) {
                      controller.organizationCodeHasText.value = value.isNotEmpty;
                    },
                    cursorOpacityAnimates: true,
                    onTapOutside: (_) => FocusScope.of(context).unfocus(),
                  ),
                ),
                Obx(
                  () => AnimatedContainer(
                    curve: Curves.easeInOutCubicEmphasized,
                    padding: EdgeInsets.symmetric(horizontal: controller.organizationCodeHasText.value ? 8 : 5),
                    width: controller.organizationCodeHasText.value ? 120 : 0,
                    height: controller.organizationCodeHasText.value ? 50 : 0,
                    duration: Durations.long4,
                    alignment: Alignment.center,
                    child: FilledButton(
                      onPressed: controller.joinOrganization,
                      child: Text(
                        controller.organizationCodeHasText.value ? "join".tr : "",
                        softWrap: false,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const Gap(10),
            Obx(() {
              if (controller.joinedOrganizationError.value) {
                return Text(
                  "organization_code_not_found".tr,
                  style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                        color: Theme.of(context).colorScheme.error,
                      ),
                );
              }

              if (controller.joinedOrganization.value) {
                return Text(
                  "joined_organization".trParams({
                    "name": controller.organizationName.value,
                  }),
                  style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                        color: Theme.of(context).colorScheme.secondary,
                      ),
                );
              }

              return const SizedBox.shrink();
            }),
            const Gap(100)
          ],
        ),
      ),
    );
  }
}
