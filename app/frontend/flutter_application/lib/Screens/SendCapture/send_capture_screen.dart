import 'package:flutter/material.dart';
import 'dart:io';

import '../../constants.dart';
import 'components/body.dart';

class SendCaptureScreen extends StatelessWidget {
  final File image;
  const SendCaptureScreen({Key? key, required this.image}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: kPrimaryColor,
      ),
      body: Body(image: image),
    );
  }
}
