import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/services.dart';

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
    required Uint8List profilePicture,
    String? companyId,
  }) async {
    User? user;
    try {
      UserCredential userCredential = await _auth.createUserWithEmailAndPassword(email: email, password: password);
      user = userCredential.user;
    } catch (e) {
      return null;
    }

    if (user == null) {
      return null;
    }

    final photoRef = FirebaseStorage.instance.ref("users/${user.uid}/profilePicture.png");

    var uploadTask = photoRef.putData(profilePicture);

    await uploadTask.whenComplete(() async {
      String downloadUrl = await photoRef.getDownloadURL();
      await FirebaseFirestore.instance.collection("users").doc(user!.uid).set({
        "name": fullName,
        "phone": phone,
        "email": email,
        "photoUrl": downloadUrl,
        "companyId": companyId,
        "type": "driver",
      });
    });

    return user;
  }
}
