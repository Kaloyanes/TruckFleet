import 'dart:async';
import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/introduction_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/media_picker_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/phone_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/photo_view.dart';
import 'package:smooth_sheets/smooth_sheets.dart';

class SignUpController extends GetxController {
  var pages = <Widget>[
    const IntroductionView(),
    const PhoneView(),
    const PhotoView(),
  ];

  PageController pageController = PageController();
  final page = 1.0.obs;
  final progress = 0.0.obs;

  @override
  void onInit() {
    super.onInit();
    progress.value = 1 / 3;

    pageController.addListener(() {
      final page = pageController.page ?? 0;
      progress.value = (page + 1) / 3;
    });
  }

  @override
  void onClose() {
    pageController.dispose();
    progress.value = 0;
    super.onClose();
  }

// TODO: CHANGE VALUE
  var canGoNext = true.obs;

  void nextPage() {
    if (!canGoNext.value) {
      return;
    }
    FocusScope.of(Get.context!).unfocus();

    final nextPageIndex = (pageController.page?.round() ?? 0) + 1;
    if (nextPageIndex < 3) {
      HapticFeedback.lightImpact();
      pageController.nextPage(duration: Durations.long4, curve: Curves.easeInOutCubicEmphasized);
    }
  }

  final image = Rx<XFile?>(null);

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

    image.value = response;
    debugPrint(response.toString());
  }
}
