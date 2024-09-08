import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import '../../../constants.dart';
import '../../AtlasDetails/atlas_details_screen.dart';

class Body extends StatefulWidget {
  const Body({Key? key}) : super(key: key);

  @override
  State<Body> createState() => _BodyState();
}

class _BodyState extends State<Body> {
  String dropdownCategoriaValue = 'Categoria';
  String dropdownCelulaValue = 'Célula';
  List<String> categories = [
    'Categoria',
    'Neutrófilos',
    'Linfócitos',
    'Eosinófilos',
    'Basófilos',
    'Monócitos',
    'Células eritroides',
    'Célula rompida',
  ];

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            alignment: Alignment.centerLeft,
            child: const Padding(
              padding: EdgeInsets.symmetric(horizontal: 30, vertical: 20),
              child: Text(
                'Atlas',
                textAlign: TextAlign.left,
                style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 25,
                ),
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(
              horizontal: size.width * 0.08,
              vertical: size.height * 0.01,
            ),
            child: DropdownButtonFormField<String>(
              decoration: InputDecoration(
                enabledBorder: OutlineInputBorder(
                  borderSide: const BorderSide(color: kGreyColor),
                  borderRadius: BorderRadius.circular(20),
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                filled: true,
                fillColor: kGreyColor,
              ),
              dropdownColor: kGreyColor,
              value: dropdownCategoriaValue,
              icon: const Icon(
                Icons.arrow_drop_down_circle,
                color: kPrimaryColor,
                size: 30,
              ),
              style: const TextStyle(
                color: Colors.black,
                fontSize: 20,
              ),
              onChanged: (String? newValue) {
                setState(() {
                  dropdownCategoriaValue = newValue!;
                  dropdownCelulaValue = 'Célula';
                });
              },
              items: categories.map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
          ),
          StreamBuilder<QuerySnapshot>(
            stream: FirebaseFirestore.instance
                .collection('celula')
                .where('categoria', isEqualTo: dropdownCategoriaValue)
                .snapshots(),
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                List<String> celulas = ['Célula'];

                for (int i = 0; i < snapshot.data!.docs.length; i++) {
                  DocumentSnapshot snap = snapshot.data!.docs[i];
                  celulas.add(snap.get('nome'));
                }

                return Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: size.width * 0.08,
                    vertical: size.height * 0.01,
                  ),
                  child: DropdownButtonFormField<String>(
                    decoration: InputDecoration(
                      enabledBorder: OutlineInputBorder(
                        borderSide: const BorderSide(color: kGreyColor),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                      filled: true,
                      fillColor: kGreyColor,
                    ),
                    dropdownColor: kGreyColor,
                    value: dropdownCelulaValue,
                    icon: const Icon(
                      Icons.arrow_drop_down_circle,
                      color: kPrimaryColor,
                      size: 30,
                    ),
                    style: const TextStyle(
                      color: Colors.black,
                      fontSize: 20,
                    ),
                    isExpanded: true,
                    onChanged: (String? newValue) {
                      setState(() {
                        dropdownCelulaValue = newValue!;
                        if (newValue != "Célula") {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) {
                                return AtlasDetailsScreen(
                                  categoria: dropdownCategoriaValue,
                                  celula: dropdownCelulaValue,
                                );
                              },
                            ),
                          );
                        }
                      });
                    },
                    items:
                        celulas.map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                  ),
                );
              } else if (snapshot.hasError) {
                return const Center(child: Text('Something went wrong'));
              } else {
                return const Center(child: CircularProgressIndicator());
              }
            },
          ),
        ],
      ),
    );
  }
}
