import 'package:flutter/material.dart';

import '../../constants.dart';
import 'components/body.dart';

class AtlasScreen extends StatelessWidget {
  const AtlasScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: kPrimaryColor,
      ),
      body: const Body(),
    );
  }
}
