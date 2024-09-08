import 'package:flutter/material.dart';
import 'package:flutter_application/constants.dart';

import '../Screens/Register/register_screen.dart';

class RegisterButton extends StatelessWidget {
  const RegisterButton({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) {
                  return const RegisterScreen();
                },
              ),
            );
          },
          child: const Text(
            "Registre-se",
            style: TextStyle(
              color: kPrimaryColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        )
      ],
    );
  }
}
