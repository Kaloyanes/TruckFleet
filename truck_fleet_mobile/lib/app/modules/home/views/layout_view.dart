import 'package:animations/animations.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_drawer_plus/flutter_drawer_plus.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';

import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/home/components/home_navigation_bar.dart';

import '../controllers/home_controller.dart';

class LayoutView extends GetView<HomeController> {
  const LayoutView({super.key});
  @override
  Widget build(BuildContext context) {
    Get.put(HomeController());

    return Scaffold(
      body: Obx(
        () => PageTransitionSwitcher(
          duration: const Duration(milliseconds: 300),
          reverse: controller.previousIndex.value > controller.selectedIndex.value,
          transitionBuilder: (child, animation, secondAnimation) {
            return SharedAxisTransition(
              animation: animation,
              secondaryAnimation: secondAnimation,
              transitionType: SharedAxisTransitionType.horizontal,
              child: child,
            );
          },
          child: controller.pages[controller.selectedIndex.value]['view'] as Widget,
        ),
      ),
      // extendBody: true,
      // bottomNavigationBar: Padding(
      //   padding: EdgeInsets.only(bottom: MediaQuery.viewPaddingOf(context).bottom + 10),
      //   child: const HomeNavigationBar(),
      // ),
      bottomNavigationBar: Obx(
        () => NavigationBar(
          labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
          destinations: [
            for (var i = 0; i < controller.pages.length; i++)
              NavigationDestination(
                icon: Icon(controller.pages[i]['icon'] as IconData),
                selectedIcon: Icon(
                  controller.pages[i]['activeIcon'] as IconData,
                ),
                label: (controller.pages[i]['label'] as String).tr,
              ),
          ],
          height: 60,
          selectedIndex: controller.selectedIndex.value,
          onDestinationSelected: (index) {
            HapticFeedback.mediumImpact();
            controller.previousIndex.value = controller.selectedIndex.value;
            controller.selectedIndex.value = index;
          },
        ),
      ),
    );
  }
}
