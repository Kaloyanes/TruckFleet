import 'dart:async';
import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:fl_location/fl_location.dart';
import 'package:flutter/material.dart';
import 'package:flutter_foreground_task/flutter_foreground_task.dart';
import 'package:get/get.dart';
import 'package:intl/intl.dart';

@pragma('vm:entry-point')
void startLocationService() {
  FlutterForegroundTask.setTaskHandler(LocationServiceHandler());
}

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
    if (!await FlLocation.isLocationServicesEnabled) {
      throw Exception('To start location service, you must enable location services.');
    }

    var permission = await FlLocation.checkLocationPermission();

    if (permission == LocationPermission.deniedForever) {
      throw Exception('To start location service, you must grant location permission.');
    } else if (permission == LocationPermission.denied) {
      permission = await FlLocation.requestLocationPermission();
      if (permission == LocationPermission.denied || permission == LocationPermission.deniedForever) {
        throw Exception('To start location service, you must grant location permission.');
      }
    }

    if (permission == LocationPermission.whileInUse) {
      permission = await FlLocation.requestLocationPermission();
      throw Exception('To start location service, you must grant location permission for always in use.');
    }
  }

  Future<void> initService() async {
    try {
      await requestLocationPermission();
      await requestPlatformPermissions();
    } catch (e) {
      showDialog(context: Get.context!, builder: (_) => AlertDialog(title: Text(e.toString())));
    }

    FlutterForegroundTask.init(
      androidNotificationOptions: AndroidNotificationOptions(
        channelId: 'location_service',
        channelName: 'Location Service',
        channelImportance: NotificationChannelImportance.LOW,
        priority: NotificationPriority.LOW,
      ),
      iosNotificationOptions: const IOSNotificationOptions(
        showNotification: true,
        playSound: false,
      ),
      foregroundTaskOptions: ForegroundTaskOptions(
        eventAction: ForegroundTaskEventAction.repeat(60 * 1000),
        autoRunOnBoot: true,
        autoRunOnMyPackageReplaced: true,
        allowWakeLock: true,
        allowWifiLock: true,
      ),
    );
    isInitialized = true;
  }

  Future<void> startService() async {
    FlutterForegroundTask.addTaskDataCallback(_onReceiveTaskData);

    await initService();

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

  Future<void> _onReceiveTaskData(Object data) async {
    log("data: $data");
    await FlutterForegroundTask.updateService(notificationText: "Sending Location");

    if (data is String) {
      log("data is string");
      final Location location = Location.fromJson(jsonDecode(data));

      var userId = FirebaseAuth.instance.currentUser!.uid;
      log("userId: $userId");
      await FirebaseFirestore.instance.collection("users").doc(userId).update({
        "location ": location.toJson(),
      });
      log("Location sent");
    }

    if (data is Map<String, dynamic>) {}

    var is24Hour = MediaQuery.alwaysUse24HourFormatOf(Get.context!);
    var formatter = is24Hour ? DateFormat('HH:mm') : DateFormat('hh:mm a');

    await FlutterForegroundTask.updateService(notificationText: "Sent Location at ${formatter.format(DateTime.now())}");
  }

  @mustCallSuper
  void attach(State state) {
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
      log('Error starting location service', error: e, stackTrace: s);
    }
  }

  @mustCallSuper
  void detach() {
    FlutterForegroundTask.removeTaskDataCallback(_onReceiveTaskData);
  }

  @mustCallSuper
  void dispose() {
    detach();
    locationNotifier.dispose();
  }
}

class LocationServiceHandler extends TaskHandler {
  @override
  Future<void> onStart(DateTime timestamp, TaskStarter starter) async {
    log("onStart");
    sendLocation(timestamp);
  }

  @override
  void onRepeatEvent(DateTime timestamp) {
    log("onRepeatEvent $timestamp");
    sendLocation(timestamp);
  }

  @override
  void onNotificationButtonPressed(String id) {
    log('onNotificationButtonPressed: $id');
    super.onNotificationButtonPressed(id);
    switch (id) {
      case 'stopButton':
        BackgroundLocationService.instance.stopService();
        break;
    }
  }

  Future<void> sendLocation(DateTime timestamp) async {
    final Location location = await FlLocation.getLocation();
    log('Sending location: $location');

    FlutterForegroundTask.sendDataToMain(jsonEncode(location.toJson()));
  }

  @override
  Future<void> onDestroy(DateTime timestamp) async {
    log("onDestroy");
    BackgroundLocationService.instance.dispose();
  }
}
