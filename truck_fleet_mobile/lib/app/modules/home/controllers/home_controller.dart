import 'dart:ui';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_drawer_plus/flutter_drawer_plus.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/chat/views/chat_view.dart';
import 'package:truck_fleet_mobile/app/modules/docs/views/docs_view.dart';
import 'package:truck_fleet_mobile/app/modules/home/views/home_view.dart';
import 'package:truck_fleet_mobile/app/modules/more/views/more_view.dart';

import 'package:truck_fleet_mobile/app/modules/on_board/views/on_board_view.dart';
import 'package:truck_fleet_mobile/app/services/toast_service.dart';

class HomeController extends GetxController {
  final selectedIndex = 0.obs;
  final previousIndex = (-1).obs;
  final changePageBool = false.obs;

  final pages = [
    {
      'icon': TablerIcons.home,
      'activeIcon': TablerIcons.home,
      'view': const HomeView(),
      'label': "Home",
    },
    {
      'icon': TablerIcons.message,
      'activeIcon': TablerIcons.message_filled,
      'view': const ChatView(),
      'label': "Chat",
    },
    {
      'icon': TablerIcons.file,
      'activeIcon': TablerIcons.file_filled,
      'view': const DocsView(),
      'label': "Docs",
    },
    {
      'icon': TablerIcons.dots,
      'activeIcon': TablerIcons.dots,
      'view': const MoreView(),
      'label': "More",
    },
  ];
}
