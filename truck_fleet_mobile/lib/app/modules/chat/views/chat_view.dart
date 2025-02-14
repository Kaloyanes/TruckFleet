import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/chat_controller.dart';

class ChatView extends GetView<ChatController> {
  const ChatView({super.key});
  @override
  Widget build(BuildContext context) {
    Get.put(ChatController());

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('ChatView'),
        centerTitle: true,
        backgroundColor: Theme.of(context).colorScheme.surface.withValues(alpha: 0.5),
        flexibleSpace: ClipRect(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              color: Colors.transparent,
            ),
          ),
        ),
      ),
      body: ListView.builder(
        // controller: controller.scrollController,
        itemBuilder: (context, index) {
          return ListTile(
            title: Center(child: Text('Item $index')),
          );
        },
      ),
    );
  }
}
