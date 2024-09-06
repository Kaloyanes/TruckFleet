import 'dart:io';
import 'dart:ui';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gap/gap.dart';

import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/components/language_switcher.dart';
import 'package:truck_fleet_mobile/app/modules/sign_in/views/sign_in_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/sign_up_view.dart';
import 'package:window_rounded_corners/window_rounded_corners.dart';

import '../controllers/on_board_controller.dart';

class OnBoardView extends GetView<OnBoardController> {
  const OnBoardView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Stack(
        children: [
          Column(
            children: [
              imageIntroduction(context),
              getStartedBottomSheet(context),
            ],
          ),
          Positioned(
            top: MediaQuery.of(context).viewPadding.top + 10,
            right: 10,
            child: const LanguageSwitcher(),
          ),
        ],
      ),
    );
  }

  Expanded imageIntroduction(BuildContext context) {
    const imageUrl = "https://images.unsplash.com/photo-1676359913375-032f3e5d494d";

    return Expanded(
      child: Stack(
        children: [
          AnimatedContainer(
            duration: Durations.extralong4,
            curve: Curves.easeInOutCubicEmphasized,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.vertical(
                bottom: Radius.circular(
                  Platform.isAndroid ? WindowCorners.getCorners().bottomLeft : 25,
                ),
              ),
            ),
            clipBehavior: Clip.hardEdge,
            child: Stack(
              alignment: Alignment.bottomCenter,
              fit: StackFit.expand,
              children: [
                Positioned.fill(
                  child: CachedNetworkImage(
                    imageUrl: imageUrl,
                    fit: BoxFit.cover,
                  ),
                ),
                Obx(
                  () => Positioned.fill(
                    child: AnimatedOpacity(
                      opacity: controller.height.value > 0 ? 0 : 1,
                      duration: Durations.extralong4,
                      curve: Curves.easeInOutCubicEmphasized,
                      child: ImageFiltered(
                        imageFilter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                        child: ShaderMask(
                          shaderCallback: (rect) {
                            return LinearGradient(
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                              colors: [Colors.black.withOpacity(1), Colors.black.withOpacity(0)],
                              stops: const [0.5, 0.65],
                            ).createShader(rect);
                          },
                          blendMode: BlendMode.dstOut,
                          child: CachedNetworkImage(
                            imageUrl: imageUrl,
                            fit: BoxFit.cover,
                            alignment: Alignment.bottomCenter,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Obx(
            () => AnimatedOpacity(
              opacity: controller.height.value > 0 ? 0 : 1,
              duration: Durations.extralong4,
              curve: Curves.easeInOutCubicEmphasized,
              child: Align(
                alignment: const Alignment(0, 0.8),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        "welcome_to_truck_fleet".tr,
                        style: Theme.of(context).textTheme.headlineSmall!.copyWith(color: Colors.white),
                      ),
                      Text(
                        "description".tr,
                        style: Theme.of(context).textTheme.bodyMedium!.copyWith(color: Colors.white),
                      ),
                      const Gap(20),
                      SizedBox(
                        width: double.infinity,
                        height: 60,
                        child: FilledButton(
                          onPressed: () {
                            controller.height.value = MediaQuery.of(context).size.height * 0.5;
                          },
                          child: Text(
                            "get_started".tr,
                            style: Theme.of(context).textTheme.titleMedium!.copyWith(
                                  fontWeight: FontWeight.w900,
                                  color: Theme.of(context).colorScheme.onPrimary,
                                ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Obx getStartedBottomSheet(BuildContext context) {
    return Obx(
      () => AnimatedContainer(
        duration: Durations.extralong4,
        curve: Curves.easeInOutCubicEmphasized,
        height: controller.height.value,
        padding: const EdgeInsets.symmetric(horizontal: 15),
        color: Theme.of(context).colorScheme.surface,
        child: Stack(
          fit: StackFit.expand,
          children: [
            Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.max,
                children: [
                  const Gap(50),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "create_account".tr,
                        style: Theme.of(context).textTheme.headlineMedium!,
                      ),
                      const Gap(2),
                      Text(
                        "account".tr,
                        style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                              fontWeight: FontWeight.w900,
                              fontStyle: FontStyle.italic,
                            ),
                      ),
                    ],
                  ),
                  const Gap(20),
                  Expanded(child: Container()),
                  SizedBox(
                    width: MediaQuery.of(context).size.width * 0.8,
                    child: FilledButton.icon(
                      onPressed: () {},
                      label: Text("continue_with_platform".trParams({"platform": "Google"})),
                      icon: const Icon(TablerIcons.brand_google_filled),
                    ),
                  ),
                  const Gap(10),
                  SizedBox(
                    width: MediaQuery.of(context).size.width * 0.8,
                    child: FilledButton.icon(
                      onPressed: () {
                        Navigator.of(context).push(MaterialPageRoute(builder: (context) => const SignUpView()));
                      },
                      label: Text("continue_with_platform".trParams({"platform": "email".tr})),
                      icon: const Icon(TablerIcons.mail),
                    ),
                  ),
                  const Gap(50),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text("already_have_an_account".tr),
                      const Gap(10),
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const SignInView()));
                        },
                        child: Text("sign_in".tr),
                      ),
                    ],
                  ),
                  Gap(MediaQuery.of(context).viewPadding.bottom),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
