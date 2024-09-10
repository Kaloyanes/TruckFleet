import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/data/bg.dart';
import 'package:truck_fleet_mobile/app/data/en.dart';

class LocalMessages extends Translations {
  @override
  Map<String, Map<String, String>> get keys => {
        "en": en,
        "bg": bg,
      };
}
