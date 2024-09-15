import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gap/gap.dart';

import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:soft_edge_blur/soft_edge_blur.dart';
import 'package:truck_fleet_mobile/app/components/language_switcher.dart';
import 'package:truck_fleet_mobile/app/components/theme_switcher.dart';
import 'package:truck_fleet_mobile/app/modules/sign_in/views/sign_in_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/sign_up_view.dart';

import '../controllers/on_board_controller.dart';

class OnBoardView extends GetView<OnBoardController> {
  const OnBoardView({super.key});

  @override
  Widget build(BuildContext context) {
    Get.put(OnBoardController());
    return Scaffold(
      resizeToAvoidBottomInset: false,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          LanguageSwitcher(),
          ThemeSwitcher(),
        ],
      ),
      body: Stack(
        children: [
          Column(
            children: [
              imageIntroduction(context),
              getStartedBottomSheet(context),
            ],
          ),
        ],
      ),
    );
  }

  Expanded imageIntroduction(BuildContext context) {
    const imageUrl = "lib/app/assets/images/landing5.jpg";

    return Expanded(
      child: Stack(
        children: [
          Obx(
            () => AnimatedContainer(
              duration: Durations.extralong4 + const Duration(milliseconds: 500),
              curve: Curves.easeInOutCubicEmphasized,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.vertical(
                  bottom: Radius.circular(
                    controller.height.value > 0 ? 20 : 1,
                  ),
                ),
              ),
              clipBehavior: Clip.hardEdge,
              child: Stack(
                alignment: Alignment.bottomCenter,
                fit: StackFit.expand,
                children: [
                  Positioned.fill(
                    child: Image.asset(
                      imageUrl,
                      fit: BoxFit.cover,
                      alignment: Alignment.bottomCenter,
                    ),
                  ),
                  Obx(
                    () => Positioned.fill(
                      child: AnimatedOpacity(
                        opacity: controller.height.value > 0 ? 0 : 1,
                        duration: Durations.extralong4,
                        curve: Curves.easeInOutCubicEmphasized,
                        child: ImageFiltered(
                          imageFilter: ImageFilter.blur(sigmaX: 3, sigmaY: 3),
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
                            child: Image.asset(
                              imageUrl,
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
          ),
          Align(
            alignment: Alignment.center,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset(
                  "lib/app/assets/images/packages_dark.png",
                  width: 50,
                ),
                const Gap(10),
                Text(
                  "Truck Fleet",
                  style: Theme.of(context).textTheme.headlineLarge!.merge(
                        GoogleFonts.playfairDisplay(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
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
                      // Align(
                      //   alignment: Alignment.centerLeft,
                      //   child: Text(
                      //     "welcome_to_truck_fleet".tr,
                      //     style: Theme.of(context).textTheme.headlineSmall!.copyWith(color: Colors.white),
                      //   ),
                      // ),
                      const Gap(20),
                      SizedBox(
                        width: double.infinity,
                        height: 60,
                        child: FilledButton(
                          onPressed: () {
                            HapticFeedback.lightImpact();
                            controller.height.value = MediaQuery.sizeOf(context).height * 0.5;
                          },
                          child: Text(
                            "get_started".tr,
                            style: Theme.of(context).textTheme.titleMedium!.copyWith(
                                  fontWeight: FontWeight.bold,
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
                        style: Theme.of(context).textTheme.headlineMedium!.merge(
                              GoogleFonts.playfairDisplay(),
                            ),
                      ),
                      const Gap(2),
                      Text(
                        "account".tr,
                        style: Theme.of(context)
                            .textTheme
                            .headlineMedium!
                            .copyWith(
                              fontWeight: FontWeight.w900,
                              fontStyle: FontStyle.italic,
                            )
                            .merge(
                              GoogleFonts.playfairDisplay(),
                            ),
                      ),
                    ],
                  ),
                  const Gap(20),
                  Expanded(child: Container()),
                  // SizedBox(
                  //   width: MediaQuery.sizeOf(context).width * 0.8,
                  //   child: FilledButton.icon(
                  //     onPressed: () {},
                  //     label: Text("continue_with_platform".trParams({"platform": "Google"})),
                  //     icon: const Icon(TablerIcons.brand_google_filled),
                  //   ),
                  // ),
                  // const Gap(10),
                  SizedBox(
                    width: MediaQuery.sizeOf(context).width * 0.8,
                    child: FilledButton.icon(
                      onPressed: () {
                        HapticFeedback.lightImpact();
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
                          HapticFeedback.lightImpact();
                          Navigator.of(context).push(MaterialPageRoute(builder: (context) => const SignInView()));
                        },
                        child: Text("sign_in".tr),
                      ),
                    ],
                  ),
                  Gap(MediaQuery.viewPaddingOf(context).bottom),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
