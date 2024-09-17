import 'package:firebase_auth/firebase_auth.dart';
import 'package:get/get.dart';

import '../modules/chat/bindings/chat_binding.dart';
import '../modules/chat/views/chat_view.dart';
import '../modules/docs/bindings/docs_binding.dart';
import '../modules/docs/views/docs_view.dart';
import '../modules/home/bindings/home_binding.dart';
import '../modules/home/views/layout_view.dart';
import '../modules/more/bindings/more_binding.dart';
import '../modules/more/views/more_view.dart';
import '../modules/on_board/bindings/on_board_binding.dart';
import '../modules/on_board/views/on_board_view.dart';
import '../modules/profile/bindings/profile_binding.dart';
import '../modules/profile/views/profile_view.dart';
import '../modules/settings/bindings/settings_binding.dart';
import '../modules/settings/views/settings_view.dart';
import '../modules/sign_in/bindings/sign_in_binding.dart';
import '../modules/sign_in/views/sign_in_view.dart';
import '../modules/sign_up/bindings/sign_up_binding.dart';
import '../modules/sign_up/views/sign_up_view.dart';

// ignore_for_file: non_constant_identifier_names

part 'app_routes.dart';

class AppPages {
  AppPages._();

  static var INITIAL =
      FirebaseAuth.instance.currentUser != null ? Routes.HOME : Routes.ON_BOARD;

  static final routes = [
    GetPage(
      name: _Paths.HOME,
      page: () => const LayoutView(),
      binding: HomeBinding(),
    ),
    GetPage(
      name: _Paths.ON_BOARD,
      page: () => const OnBoardView(),
      binding: OnBoardBinding(),
    ),
    GetPage(
      name: _Paths.SIGN_IN,
      page: () => const SignInView(),
      binding: SignInBinding(),
    ),
    GetPage(
      name: _Paths.SIGN_UP,
      page: () => const SignUpView(),
      binding: SignUpBinding(),
    ),
    GetPage(
      name: _Paths.CHAT,
      page: () => const ChatView(),
      binding: ChatBinding(),
    ),
    GetPage(
      name: _Paths.MORE,
      page: () => const MoreView(),
      binding: MoreBinding(),
    ),
    GetPage(
      name: _Paths.DOCS,
      page: () => const DocsView(),
      binding: DocsBinding(),
    ),
    GetPage(
      name: _Paths.PROFILE,
      page: () => const ProfileView(),
      binding: ProfileBinding(),
    ),
    GetPage(
      name: _Paths.SETTINGS,
      page: () => const SettingsView(),
      binding: SettingsBinding(),
    ),
  ];
}
