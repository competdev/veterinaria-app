import 'package:flutter/material.dart';
import 'package:flutter_application/Screens/Menus/components/body.dart';
import 'package:flutter_application/constants.dart';

class MenusScreen extends StatelessWidget {
  const MenusScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Container(
            alignment: Alignment.center, child: const Text('Cell-IA')),
        backgroundColor: kPrimaryColor,
      ),
      body: const Body(),
    );
  }
}
