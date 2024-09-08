import 'package:flutter/material.dart';
import '../constants.dart';

class TextFieldContainer extends StatelessWidget {
  final Widget child;
  const TextFieldContainer({
    Key? key,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      //margin: EdgeInsets.symmetric(vertical: 10),
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 8),
      width: size.width * 0.7,
      decoration: BoxDecoration(
        color: kGreyColor,
        borderRadius: BorderRadius.circular(15),
      ),
      child: child,
    );
  }
}
