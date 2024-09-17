import 'package:flutter/material.dart';

import 'package:get/get.dart';

import '../controllers/docs_controller.dart';

class DocsView extends GetView<DocsController> {
  const DocsView({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('DocsView'),
        centerTitle: true,
      ),
      body: const Center(
        child: Text(
          'DocsView is working',
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
