import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'package:get/get.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:truck_fleet_mobile/app/modules/on_board/views/on_board_page.dart';

import '../controllers/on_board_controller.dart';

class OnBoardView extends GetView<OnBoardController> {
  const OnBoardView({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // indicato

          PageView(
            controller: controller.pageController,
            children: const [
              OnBoardPage(image: '', title: 'Title 1', subtitle: 'Subtitle 1'),
              OnBoardPage(image: 'assets/images/on_board/2.png', title: 'Title 2', subtitle: 'Subtitle 2'),
              OnBoardPage(image: 'assets/images/on_board/3.png', title: 'Title 3', subtitle: 'Subtitle 3'),
            ],
          ),
          Positioned(
            top: 50,
            left: MediaQuery.of(context).size.width / 2 - 50,
            child: SmoothPageIndicator(
              controller: controller.pageController, // PageController
              count: 3,

              effect: ExpandingDotsEffect(
                dotColor: Theme.of(context).colorScheme.secondary,
                activeDotColor: Theme.of(context).colorScheme.primary,
                spacing: 10,
              ),
              onDotClicked: (index) {},
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: controller.nextPage,
        child: const Icon(Icons.arrow_forward),
      )
          .animate(delay: Durations.medium2)
          .scaleXY(begin: 0, duration: Durations.long3, curve: Curves.easeOutQuart)
          .moveY(begin: 150, end: 0, duration: Durations.medium4, curve: Curves.easeOutQuart)
          .blurXY(begin: 20, end: 0, duration: Durations.medium4, curve: Curves.easeOutQuart),
      floatingActionButtonAnimator: FloatingActionButtonAnimator.noAnimation,
    );
  }
}
