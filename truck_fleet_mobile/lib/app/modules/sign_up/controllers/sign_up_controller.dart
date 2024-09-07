import 'dart:async';
import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:truck_fleet_mobile/app/components/media_picker_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/introduction_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/join_organization_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/password_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/phone_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/photo_view.dart';
import 'package:smooth_sheets/smooth_sheets.dart';

class SignUpController extends GetxController {
  var pages = <Widget>[
    const IntroductionView(),
    const PasswordView(),
    const PhoneView(),
    const PhotoView(),
    const JoinOrganizationView(),
  ];

  PageController pageController = PageController();
  final page = 0.0.obs;
  final progress = 0.0.obs;

  @override
  void onInit() {
    super.onInit();
    progress.value = 1 / (pages.length);

    pageController.addListener(() {
      final page = pageController.page ?? 0;
      progress.value = (page + 1) / (pages.length);
    });
  }

  @override
  void onClose() {
    pageController.dispose();
    progress.value = 0;
    super.onClose();
  }

  final introductionFormKey = GlobalKey<FormState>();
  final passwordFormKey = GlobalKey<FormState>();
  final phoneFormKey = GlobalKey<FormState>();
  final photoFormKey = GlobalKey<FormState>();

  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final phoneController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final organizationCodeController = TextEditingController();

  final organizationCodeHasText = false.obs;

  final profilePicture = Rx<XFile?>(null);

// TODO: CHANGE VALUE
  var canGoNext = false.obs;

  final isPasswordVisible = false.obs;

  void nextPage() {
    if (!canGoNext.value) {
      return;
    }

    if (pageController.page == 0) {
      if (!introductionFormKey.currentState!.validate()) {
        canGoNext.value = false;
        return;
      }
    }

    if (pageController.page == 1) {
      if (!passwordFormKey.currentState!.validate()) {
        canGoNext.value = false;
        return;
      }
    }

    if (pageController.page == 2) {
      if (!phoneFormKey.currentState!.validate()) {
        canGoNext.value = false;
        return;
      }
    }

    if (pageController.page == 3) {
      if (profilePicture.value == null) {
        canGoNext.value = false;
        return;
      }
    }

    FocusScope.of(Get.context!).unfocus();

    final nextPageIndex = (pageController.page?.round() ?? 0) + 1;
    if (nextPageIndex < pages.length) {
      HapticFeedback.lightImpact();
      pageController.nextPage(duration: Durations.long4, curve: Curves.easeInOutCubicEmphasized);
    }
  }

  final draggableScrollableController = DraggableScrollableController();
  void addPhotos() async {
    // final source = await showModalBottomSheet<ImageSource>(
    //   context: Get.context!,
    //   builder: (context) => MediaPickerView(controller: draggableScrollableController),
    //   sheetAnimationStyle: AnimationStyle(
    //     curve: Curves.elasticOut,
    //     duration: Durations.medium2,
    //     reverseCurve: Curves.easeOutQuad.flipped,
    //     reverseDuration: Durations.medium2,
    //   ),
    // );

    final modalRoute = ModalSheetRoute<ImageSource>(
      builder: (context) => const MediaPickerView(),
      transitionCurve: Curves.easeInOutCubicEmphasized,
      transitionDuration: Durations.long2,
      swipeDismissible: true,
      fullscreenDialog: true,
      swipeDismissSensitivity: const SwipeDismissSensitivity(
        minFlingVelocityRatio: 2.0,
        minDragDistance: 200.0,
      ),
    );
    HapticFeedback.lightImpact();
    var source = await Navigator.push<ImageSource>(Get.context!, modalRoute);

    if (source == null) return;

    final ImagePicker picker = ImagePicker();

    final XFile? response = await picker.pickImage(
      source: source,
      preferredCameraDevice: CameraDevice.front,
      imageQuality: 80,
    );

    if (response == null) {
      return;
    }

    canGoNext.value = true;

    profilePicture.value = response;
    debugPrint(response.toString());
  }
}
