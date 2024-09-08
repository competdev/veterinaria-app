import 'package:flutter/material.dart';
import 'package:flutter_application/constants.dart';

class RoundedButton extends StatelessWidget {
  final String text;
  final VoidCallback? press;
  final Color color, textColor;

  const RoundedButton({
    Key? key,
    required this.text,
    required this.press,
    this.color = kRedLightColor,
    this.textColor = Colors.white,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return SizedBox(
      width: size.width * 0.7,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(15),
        child: newTextButton(),
      ),
    );
  }

  TextButton newTextButton() {
    return TextButton(
      style: TextButton.styleFrom(
        foregroundColor: Colors.white, backgroundColor: color,
        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 18),
        textStyle: const TextStyle(
            color: Colors.white, fontSize: 20, fontWeight: FontWeight.w500),
      ),
      onPressed: press,
      child: Text(
        text,
        style: TextStyle(color: textColor),
      ),
    );
  }
}
