import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get/get.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/controllers/sign_up_controller.dart';
import 'package:truck_fleet_mobile/app/modules/sign_up/views/join_organization_view.dart';

void main() {
  group("Organization Join", () {
    testWidgets("Failed organization join", (WidgetTester tester) async {
      await tester.pumpWidget(const GetMaterialApp(home: JoinOrganizationView()));
      Get.put(SignUpController());

      await tester.pumpAndSettle();

      expect(find.text("Join Organization"), findsOneWidget);

      await tester.enterText(find.byKey(const Key("organization_code")), "123456");

      await tester.pumpAndSettle();

      expect(find.text("Join"), findsOneWidget);

      await tester.tap(find.text("Join"));

      await tester.pumpAndSettle();

      expect(find.text("Organization not found"), findsOneWidget);
    });
  });
}
