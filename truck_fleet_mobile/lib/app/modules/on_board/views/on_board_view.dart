import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:gaimon/gaimon.dart';
import 'package:gap/gap.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:truck_fleet_mobile/app/components/language_switcher.dart';
import 'package:truck_fleet_mobile/app/components/theme_switcher.dart';
import 'package:truck_fleet_mobile/app/modules/sign_in/views/sign_in_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/sign_up_view.dart';

import '../controllers/on_board_controller.dart';

class OnBoardView extends GetView<OnBoardController> {
  OnBoardView({super.key});

  final animationCurve = Curves.easeInOutCubicEmphasized;
  final animationDuration = Durations.long4 + 500.ms;

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
          Row(
            children: [
              LanguageSwitcher(),
              ThemeSwitcher(),
            ]
                .animate(
                  interval: const Duration(milliseconds: 100),
                )
                .scaleXY(
                  begin: 0,
                  end: 1,
                  duration: Durations.long1,
                  curve: animationCurve,
                  delay: 250.ms,
                ),
          )
        ],
      ),
      body: Column(
        children: [
          imageIntroduction(context),
          getStartedBottomSheet(context),
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
              duration: animationDuration,
              curve: animationCurve,
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
                        duration: animationDuration,
                        curve: animationCurve,
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
                const SizedBox(width: 10),
                Text(
                  "Truck Fleet",
                  style: Theme.of(context).textTheme.headlineLarge!.merge(
                        GoogleFonts.playfairDisplay(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                ),
              ]
                  .animate(
                    interval: const Duration(milliseconds: 100),
                  )
                  .scaleXY(
                    begin: 0,
                    end: 1,
                    duration: Durations.extralong1,
                    curve: animationCurve,
                    delay: 150.ms,
                  )
                  .blurXY(
                    begin: 5,
                    end: 0,
                    duration: Durations.extralong1,
                    curve: animationCurve,
                    delay: 150.ms,
                  ),
            ),
          ),
          Obx(
            () => Align(
              alignment: const Alignment(0, 0.9),
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
                          Gaimon.light();
                          controller.height.value = MediaQuery.sizeOf(context).height * 0.4;
                        },
                        child: Text(
                          "get_started".tr,
                          style: Theme.of(context).textTheme.titleMedium!.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.onPrimary,
                              ),
                        ),
                      )
                          .animate(delay: 400.ms)
                          .fade(
                            begin: 0,
                            end: 1,
                            duration: Durations.extralong1,
                            curve: animationCurve,
                            delay: 200.ms,
                          )
                          .slideY(
                            begin: 2.5,
                            end: 0,
                            duration: Durations.extralong1,
                            curve: animationCurve,
                            // delay: 150.ms,
                          )
                          .scaleXY(
                            begin: 0.6,
                            end: 1,
                            duration: Durations.extralong1,
                            curve: animationCurve,
                            // delay: 150.ms,
                          )
                          .blurXY(
                            begin: 5,
                            end: 0,
                            duration: Durations.extralong1,
                            curve: animationCurve,
                            // delay: 150.ms,
                          ),
                    ),
                  ],
                ),
              ),
            )
                .animate(
                  target: controller.height.value > 0 ? 1 : 0,
                )
                .fade(begin: 1, end: 0, duration: Durations.short1, curve: animationCurve)
                .scaleXY(begin: 1, end: 0.75, duration: Durations.long2, curve: animationCurve)
                .slideY(begin: 0, end: 1, duration: Durations.long2, curve: animationCurve),
          ),
        ],
      ),
    );
  }

  Obx getStartedBottomSheet(BuildContext context) {
    return Obx(
      () => AnimatedContainer(
        duration: animationDuration,
        curve: animationCurve,
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
                        Gaimon.light();
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
                          Gaimon.light();
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
