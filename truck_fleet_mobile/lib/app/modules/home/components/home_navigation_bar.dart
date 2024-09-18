import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/home/controllers/home_controller.dart';
import 'package:truck_fleet_mobile/app/utils/themes.dart';

class HomeNavigationBar extends GetView<HomeController> {
  const HomeNavigationBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface.withOpacity(0.5),
        borderRadius: BorderRadius.circular(radius + 25),
        border: Border.all(
          color: Theme.of(context).colorScheme.primary.withOpacity(0.4),
          width: 1,
          style: BorderStyle.solid,
          strokeAlign: 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Colors.white12,
            blurRadius: 20,
            blurStyle: BlurStyle.inner,
          ),
        ],
      ),
      // padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 15),
      margin: EdgeInsets.symmetric(horizontal: MediaQuery.sizeOf(context).width * 0.1),
      width: double.infinity,
      clipBehavior: Clip.hardEdge,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            for (var i = 0; i < controller.pages.length; i++)
              Obx(
                () => Expanded(
                  child: GestureDetector(
                    onTap: () {
                      HapticFeedback.lightImpact();
                      controller.previousIndex.value = controller.selectedIndex.value;
                      controller.selectedIndex.value = i;
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 400),
                      curve: Curves.easeInOutCubicEmphasized,
                      decoration: BoxDecoration(
                        color: controller.selectedIndex.value == i
                            ? Theme.of(context).colorScheme.surfaceTint
                            : Theme.of(context).colorScheme.surfaceTint.withOpacity(0),
                        borderRadius: BorderRadius.circular(radius + 25),
                        border: Border.all(
                          color: controller.selectedIndex.value == i
                              ? Theme.of(context).colorScheme.primary.withOpacity(0.4)
                              : Theme.of(context).colorScheme.primary.withOpacity(0),
                          width: 1,
                          style: BorderStyle.solid,
                          strokeAlign: 1,
                        ),
                      ),
                      margin: const EdgeInsets.symmetric(horizontal: 7, vertical: 7),
                      height: 60,
                      width: controller.selectedIndex.value == i ? 60 : 0,
                      child: Icon(
                        controller.pages[i]['icon'] as IconData,
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
