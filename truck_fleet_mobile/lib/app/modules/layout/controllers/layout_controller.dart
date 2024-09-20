import 'package:flutter/material.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:get/get.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:truck_fleet_mobile/app/modules/chat/views/chat_view.dart';
import 'package:truck_fleet_mobile/app/modules/docs/views/docs_view.dart';
import 'package:truck_fleet_mobile/app/modules/home/views/home_view.dart';
import 'package:truck_fleet_mobile/app/modules/more/views/more_view.dart';

class LayoutController extends GetxController {
  final selectedIndex = 0.obs;
  final previousIndex = (-1).obs;
  final changePageBool = false.obs;

  final hideNavigationBar = false.obs;

  final pages = [
    {
      'icon': Symbols.home,
      'activeIcon': Icons.home_filled,
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
      'icon': TablerIcons.adjustments,
      'activeIcon': TablerIcons.adjustments_filled,
      'view': const MoreView(),
      'label': "More",
    },
  ];
}
