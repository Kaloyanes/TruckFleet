import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/chat_controller.dart';

class ChatView extends GetView<ChatController> {
  const ChatView({super.key});
  @override
  Widget build(BuildContext context) {
    Get.put(ChatController());

    return Scaffold(
      appBar: AppBar(
        title: const Text('ChatView'),
        centerTitle: true,
      ),
      body: ListView.builder(
        controller: controller.scrollController,
        itemBuilder: (context, index) {
          return ListTile(
            title: Center(child: Text('Item $index')),
          );
        },
      ),
    );
  }
}
