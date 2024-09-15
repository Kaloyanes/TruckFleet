import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_drawer_plus/flutter_drawer_plus.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';

import 'package:get/get.dart';

import '../controllers/home_controller.dart';

class HomeView extends GetView<HomeController> {
  const HomeView({super.key});
  @override
  Widget build(BuildContext context) {
    Get.put(HomeController());

    return DrawerPlus(
      leftChild: Container(
        color: Colors.blue,
      ),
      borderRadius: 35,
      key: controller.drawerController,
      scale: const DPOffset.horizontal(0.8),
      leftAnimationType: DrawerPlusAnimation.quadratic,
      rightAnimationType: DrawerPlusAnimation.quadratic,
      duration: Durations.extralong1,
      backgroundDecoration: const BoxDecoration(
        color: Colors.red,
      ),
      onTapClose: true,
      proportionalChildArea: true,
      offset: const DPOffset.horizontal(0.2),
      velocity: 0.05,
      colorTransitionScaffold: Colors.black.withOpacity(0.2),
      drawerPlusCallback: (isOpened) {
        // controller.drawerIsOpen.value = isOpened;
      },
      onDragUpdate: (value, direction) {
        controller.drawerTarget.value = value;
      },
      scaffold: Obx(
        () => Scaffold(
          appBar: AppBar(
            leading: IconButton(
              onPressed: controller.toggleDrawer,
              icon: const Icon(TablerIcons.menu_2),
            ),
            title: const Text('HomeView'),
            centerTitle: true,
          ),
          body: Center(
            child: ElevatedButton(
              onPressed: controller.signOut,
              child: const Text('Sign Out'),
            ),
          ),
        )
            .animate(
              target: controller.drawerTarget.value,
            )
            .blur(
              begin: Offset.zero,
              end: const Offset(1, 1),
              duration: Durations.long1,
              curve: Curves.easeInOutCubicEmphasized,
            ),
      ),
    );
  }
}
