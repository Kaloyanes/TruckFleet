import 'dart:ui';

import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:gaimon/gaimon.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/layout/controllers/layout_controller.dart';

class LayoutView extends GetView<LayoutController> {
  const LayoutView({super.key});
  @override
  Widget build(BuildContext context) {
    Get.put(LayoutController());
    return Scaffold(
      extendBody: true,
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
      bottomNavigationBar: Obx(
        () => ClipRRect(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: NavigationBar(
              backgroundColor: Theme.of(context).colorScheme.surface.withValues(alpha: 0.5),
              labelBehavior: NavigationDestinationLabelBehavior.alwaysHide,
              destinations: [
                for (var i = 0; i < controller.pages.length; i++)
                  NavigationDestination(
                    icon: Icon(
                      controller.pages[i]['icon'] as IconData,
                      color: Colors.grey,
                    ),
                    selectedIcon: Icon(
                      controller.pages[i]['activeIcon'] as IconData,
                    ),
                    label: (controller.pages[i]['label'] as String).tr,
                  ),
              ],
              selectedIndex: controller.selectedIndex.value,
              onDestinationSelected: (index) {
                Gaimon.light();
                controller.previousIndex.value = controller.selectedIndex.value;
                controller.selectedIndex.value = index;
              },
            )
                .animate(
                  target: controller.hideNavigationBar.value ? 1 : 0,
                )
                .slideY(
                  begin: 0,
                  end: 1,
                  duration: Durations.long2,
                  curve: Curves.easeInOutCubicEmphasized,
                ),
          ),
        ),
      ),
    );
  }
}
