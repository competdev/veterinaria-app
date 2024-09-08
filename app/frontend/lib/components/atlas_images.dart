import 'package:flutter/material.dart';


class AtlasDetailsWidget extends StatefulWidget {
  const AtlasDetailsWidget({Key? key}) : super(key: key);

  @override
  State<AtlasDetailsWidget> createState() => _AtlasDetailsWidgetState();
}

class _AtlasDetailsWidgetState extends State<AtlasDetailsWidget> {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return const Text(
      'Atlas',
    );
  }
}
