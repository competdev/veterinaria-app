import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../Screens/Welcome/welcome_screen.dart';

class TopMainMenusWidget extends StatelessWidget {
  final User? user;

  const TopMainMenusWidget({
    Key? key,
    required this.user,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    ImageProvider photo =
        const AssetImage("assets/images/default-user-image.png");

    if (user != null && user?.photoURL != null) {
      photo = NetworkImage(user!.photoURL!);
    }

    return Row(
      children: [
        Container(
          alignment: Alignment.topLeft,
          margin:
              EdgeInsets.symmetric(horizontal: size.width * 0.07, vertical: 20),
          child: CircleAvatar(
            backgroundImage: photo,
            radius: 30,
          ),
        ),
        SizedBox(width: size.width * 0.4),
        GestureDetector(
          child: Container(
            width: size.width * 0.26,
            height: size.height * 0.1,
            decoration: const BoxDecoration(
              color: Colors.white,
              image: DecorationImage(
                image: AssetImage("assets/images/out.png"),
                scale: 1.5,
              ),
            ),
          ),
          onTap: () {
            _signOut(context);
          },
        ),
      ],
    );
  }

  Future<void> _signOut(BuildContext context) async {
    await FirebaseAuth.instance.signOut();
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) => const WelcomeScreen(),
      ),
    );
  }
}
