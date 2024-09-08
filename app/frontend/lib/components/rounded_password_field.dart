import 'package:flutter/material.dart';
import 'package:flutter_application/components/text_field_container.dart';

class RoundedPasswordField extends StatelessWidget {
  final ValueChanged<String> onChanged;
  final TextEditingController controller;

  const RoundedPasswordField({
    Key? key,
    required this.onChanged,
    required this.controller,
  }) : super(key: key);

  get kBlueColor => null;

  @override
  Widget build(BuildContext context) {
    return TextFieldContainer(
      child: TextField(
        controller: controller,
        obscureText: true,
        onChanged: onChanged,
        decoration: InputDecoration(
          hintText: "Senha",
          icon: Icon(
            Icons.lock,
            color: kBlueColor,
          ),
          suffixIcon: const Icon(Icons.visibility),
          border: InputBorder.none,
        ),
      ),
    );
  }
}
