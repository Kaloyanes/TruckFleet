import 'dart:math';
import 'package:flutter/material.dart';

class OnBoardPage extends StatelessWidget {
  const OnBoardPage({super.key, required this.image, required this.title, required this.subtitle});
  final String image;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Stack(
        children: [
          Image.network(image),
          Positioned(
            bottom: 50,
            child: Column(
              children: [
                Text(title),
                Text(subtitle),
              ],
            ),
          )
        ],
      ),
    );
  }
}
