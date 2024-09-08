import 'package:flutter/material.dart';
import '../../constants.dart';
import 'components/body.dart';

class AtlasDetailsScreen extends StatelessWidget {
  final String categoria;
  final String celula;

  const AtlasDetailsScreen(
      {Key? key, required this.categoria, required this.celula})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: kPrimaryColor,
      ),
      body: Body(
        categoria: categoria,
        celula: celula,
      ),
    );
  }
}
