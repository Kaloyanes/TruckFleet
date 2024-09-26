import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:get/get.dart';
import 'package:material_symbols_icons/material_symbols_icons.dart';
import 'package:truck_fleet_mobile/app/modules/chat/views/chat_view.dart';
import 'package:truck_fleet_mobile/app/modules/docs/views/docs_view.dart';
import 'package:truck_fleet_mobile/app/modules/home/views/home_view.dart';
import 'package:truck_fleet_mobile/app/modules/more/views/more_view.dart';
import 'package:truck_fleet_mobile/app/services/background_location_service.dart';

class HomeController extends GetxController {
  @override
  void dispose() {
    BackgroundLocationService.instance.dispose();
    super.dispose();
  }

  void _onReceiveTaskData(Object data) {
    if (data is Map<String, dynamic>) {
      final dynamic timestampMillis = data["timestampMillis"];
      if (timestampMillis != null) {
        final DateTime timestamp = DateTime.fromMillisecondsSinceEpoch(timestampMillis, isUtc: true);
        print('timestamp: ${timestamp.toString()}');
      }
    }
  }
}
