import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/services/background_location_service.dart';

class HomeController extends GetxController {
  @override
  void dispose() {
    BackgroundLocationService.instance.dispose();
    super.dispose();
  }
}
