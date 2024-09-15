import 'dart:io';
import 'dart:ui' as ui;

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:croppy/croppy.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:truck_fleet_mobile/app/components/media_picker_view.dart';
import 'package:truck_fleet_mobile/app/modules/home/views/home_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/introduction_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/join_organization_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/password_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/phone_view.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/photo_view.dart';
import 'package:smooth_sheets/smooth_sheets.dart';
import 'package:truck_fleet_mobile/app/services/auth_service.dart';
import 'package:flutter_animate/flutter_animate.dart';

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
  final companyId = "".obs;

  final organizationCodeHasText = false.obs;
  final joinedOrganization = false.obs;
  final joinedOrganizationError = false.obs;
  final organizationName = "".obs;

  final profilePicture = Rx<XFile?>(null);
  final profilePictureBytes = Rx<Uint8List?>(null);
  final isProfilePictureFocused = false.obs;

  final isPasswordVisible = false.obs;

  Future<void> nextPage() async {
    if (pageController.page == pages.length - 1) {
      await signUp();
      return;
    }

    if (pageController.page == 0) {
      if (!introductionFormKey.currentState!.validate()) {
        return;
      }
    }

    if (pageController.page == 1) {
      if (!passwordFormKey.currentState!.validate()) {
        return;
      }
    }

    if (pageController.page == 2) {
      if (!phoneFormKey.currentState!.validate()) {
        return;
      }
    }

    if (pageController.page == 3) {
      if (profilePicture.value == null) {
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

  Future<void> joinOrganization() async {
    if (!organizationCodeHasText.value) {
      return;
    }

    FirebaseFirestore.instance
        .collection("users")
        .where("companyCode", isEqualTo: organizationCodeController.text.trim())
        .get()
        .then((value) {
      if (value.docs.isNotEmpty) {
        companyId.value = value.docs.first.id;
        joinedOrganization.value = true;
        joinedOrganizationError.value = false;
        organizationName.value = value.docs.first.data()["name"];
      } else {
        joinedOrganizationError.value = true;
        joinedOrganization.value = false;
      }
    });
  }

  Future signUp() async {
    showDialog(
      context: Get.context!,
      builder: (context) => BackdropFilter(
        filter: ui.ImageFilter.blur(sigmaX: 5, sigmaY: 5),
        child: Center(
          child: const CircularProgressIndicator()
              .animate()
              .blur(
                  duration: Durations.long2,
                  curve: Curves.easeInOutCubicEmphasized,
                  begin: const Offset(10, 10),
                  end: Offset.zero)
              .scaleXY(duration: Durations.long2, curve: Curves.easeInOutCubicEmphasized),
        ),
      ),
    );

    await AuthService.signUp(
      email: emailController.text.trim(),
      password: passwordController.text.trim(),
      fullName: nameController.text.trim(),
      phone: "+${phoneController.text.trim()}",
      profilePicture: profilePictureBytes.value!,
      companyId: companyId.value,
    );

    await Navigator.of(Get.context!)
        .pushAndRemoveUntil(MaterialPageRoute(builder: (context) => const HomeView()), (route) => false);

    await FirebaseAnalytics.instance.logEvent(name: "signup_success");
    ScaffoldMessenger.of(Get.context!).showSnackBar(SnackBar(content: Text("signup_success".tr)));

    emailController.clear();
    passwordController.clear();
    nameController.clear();
    phoneController.clear();
    profilePicture.value = null;
    profilePictureBytes.value = null;
    companyId.value = "";
    organizationCodeController.clear();
    organizationName.value = "";
    joinedOrganization.value = false;
    joinedOrganizationError.value = false;
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

    final cropper = await showMaterialImageCropper(
      Get.context!,
      imageProvider: FileImage(File(response.path)),
      allowedAspectRatios: [
        const CropAspectRatio(width: 1, height: 1),
      ],
      themeData: Theme.of(Get.context!),
      locale: Get.locale,
    );

    if (cropper == null) {
      return;
    }

    final image = await cropper.uiImage.toByteData(format: ui.ImageByteFormat.png);

    final croppedImage = XFile.fromData(image!.buffer.asUint8List());

    profilePictureBytes.value = await croppedImage.readAsBytes();
    profilePicture.value = croppedImage;
  }

  void goBack() {
    HapticFeedback.lightImpact();
    if (pageController.page! < 0.8) {
      Navigator.of(Get.context!).pop();
    } else {
      pageController.previousPage(duration: Durations.long2, curve: Curves.easeInOutCubicEmphasized);
    }
  }
}
