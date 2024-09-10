import 'package:firebase_auth/firebase_auth.dart';
import 'package:image_picker/image_picker.dart';

class AuthService {
  static final FirebaseAuth _auth = FirebaseAuth.instance;

  static Future<User?> signInWithEmailAndPassword(String email, String password) async {
    try {
      UserCredential userCredential = await _auth.signInWithEmailAndPassword(email: email, password: password);
      return userCredential.user;
    } catch (e) {
      return null;
    }
  }

  static Future signOut() async {
    await _auth.signOut();
  }

  static Future<User?> signUp({
    required String email,
    required String password,
    required String fullName,
    required String phone,
    required XFile profilePicture,
  }) async {
    return null;
  }
}
