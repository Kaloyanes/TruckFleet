import 'dart:async';
import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:fl_location/fl_location.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:get/get.dart';
import 'package:permission_handler/permission_handler.dart';

class BackgroundLocationService {
  static final BackgroundLocationService instance = BackgroundLocationService();

  final ValueNotifier<Location?> locationNotifier = ValueNotifier(null);
  bool isInitialized = false;

  // private
  Future<void> requestPlatformPermissions() async {
    final NotificationPermission notificationPermission = await FlutterForegroundTask.checkNotificationPermission();
    if (notificationPermission != NotificationPermission.granted) {
      await FlutterForegroundTask.requestNotificationPermission();
    }

    if (Platform.isAndroid) {
      if (!await FlutterForegroundTask.isIgnoringBatteryOptimizations) {
        await FlutterForegroundTask.requestIgnoreBatteryOptimization();
      }
    }
  }

  Future<void> requestLocationPermission() async {
    final LocationPermission locationPermission = await FlLocation.requestLocationPermission();
    if (locationPermission == LocationPermission.denied || locationPermission == LocationPermission.deniedForever) {
      throw Exception('To start location service, you must grant location permission.');
    }
  }

  Future<void> initService() async {
    await requestLocationPermission();
    await requestPlatformPermissions();

    FlutterForegroundTask.init(
      androidNotificationOptions: AndroidNotificationOptions(
        channelId: 'location_service',
        channelName: 'Location Service',
        channelImportance: NotificationChannelImportance.HIGH,
        priority: NotificationPriority.LOW,
      ),
      iosNotificationOptions: const IOSNotificationOptions(
        showNotification: true,
        playSound: false,
      ),
      foregroundTaskOptions: ForegroundTaskOptions(
        eventAction: ForegroundTaskEventAction.repeat(2000),
        autoRunOnBoot: true,
        autoRunOnMyPackageReplaced: true,
        allowWakeLock: true,
        allowWifiLock: true,
      ),
    );
    isInitialized = true;
  }

  Future<void> startService() async {
    if (!isInitialized) await initService();

    final ServiceRequestResult result = await FlutterForegroundTask.startService(
        serviceId: 200,
        notificationTitle: 'Location Service',
        notificationText: '',
        callback: startLocationService,
        notificationButtons: [
          const NotificationButton(
            id: 'stopButton',
            text: 'Stop',
          ),
        ]);

    if (!result.success) {
      throw result.error ?? Exception('An error occurred and the service could not be started.');
    }
  }

  Future<void> stopService() async {
    final ServiceRequestResult result = await FlutterForegroundTask.stopService();

    if (!result.success) {
      throw result.error ?? Exception('An error occurred and the service could not be stopped.');
    }
    isInitialized = false;
  }

  void _onReceiveTaskData(Object data) {
    if (data is String) {
      final Map<String, dynamic> locationJson = jsonDecode(data);
      final Location location = Location.fromJson(locationJson);
      locationNotifier.value = location;
    }
  }

  void _handleError(Object e, StackTrace s) {
    String errorMessage;
    if (e is PlatformException) {
      errorMessage = '${e.code}: ${e.message}';
    } else {
      errorMessage = e.toString();
    }

    // print error to console.
    log('$errorMessage\n${s.toString()}');

    // show error to user.
    final SnackBar snackBar = SnackBar(content: Text(errorMessage));
    ScaffoldMessenger.of(Get.context!).showSnackBar(snackBar);
  }

  Future<void> init() async {
    FlutterForegroundTask.addTaskDataCallback(_onReceiveTaskData);

    try {
      // check permissions -> if granted -> start service
      requestPlatformPermissions().then((_) {
        requestLocationPermission().then((_) async {
          // already started
          if (await FlutterForegroundTask.isRunningService) {
            return;
          }

          await initService();
          startService();
        });
      });
    } catch (e, s) {
      // _handleError(e, s);
    }
  }

  void dispose() {
    FlutterForegroundTask.removeTaskDataCallback(_onReceiveTaskData);
    locationNotifier.dispose();
  }
}

@pragma('vm:entry-point')
void startLocationService() {
  FlutterForegroundTask.setTaskHandler(LocationServiceHandler());
}

class LocationServiceHandler extends TaskHandler {
  StreamSubscription<Location>? _streamSubscription;

  @override
  Future<void> onStart(DateTime timestamp, TaskStarter starter) async {
    // _streamSubscription = FlLocation.getLocationStream().listen((location) {
    //   final double lat = location.latitude;
    //   final double lon = location.longitude;

    //   // Update notification content.
    //   final String text = 'lat: $lat, lon: $lon';
    //   FlutterForegroundTask.updateService(notificationText: text);

    //   // Send data to main isolate.
    //   final String locationJson = jsonEncode(location.toJson());
    //   FlutterForegroundTask.sendDataToMain(locationJson);
    // });
  }

  @override
  void onRepeatEvent(DateTime timestamp) {
    // not use
    log('onRepeatEvent: $timestamp');

    FlutterForegroundTask.updateService(notificationText: 'onRepeatEvent: $timestamp');
  }

  @override
  void onNotificationButtonPressed(String id) {
    log('onNotificationButtonPressed: $id');
    super.onNotificationButtonPressed(id);
  }

  @override
  Future<void> onDestroy(DateTime timestamp) async {
    _streamSubscription?.cancel();
    _streamSubscription = null;
  }
}
