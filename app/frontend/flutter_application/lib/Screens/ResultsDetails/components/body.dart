import 'dart:convert';
import 'dart:developer';

import 'package:carousel_slider/carousel_slider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:progress_dialog_null_safe/progress_dialog_null_safe.dart';

import '../../../components/rounded_button.dart';
import '../../../constants.dart';

class Body extends StatefulWidget {
  final String titulo;
  final String description;
  final String exameId;
  final String cellCount;

  const Body({Key? key,
    required this.titulo,
    required this.description,
    required this.exameId,
    required this.cellCount})
      : super(key: key);

  @override
  State<Body> createState() => _BodyState();
}

class _BodyState extends State<Body> {

  late String titulo;
  late String description;
  late String exameId;
  late String cellCount;
  late String _imageBase64;

  @override
  void initState() {
    super.initState();
    titulo = widget.titulo;
    description = widget.description;
    exameId = widget.exameId;
    cellCount = widget.cellCount;
    _imageBase64 = "";
    downloadImage();
  }
  // Widget buildImage(String urlImage, int index) => Container(
  //       margin: const EdgeInsets.symmetric(horizontal: 1),
  //       color: Colors.grey,
  //       child: InteractiveViewer(
  //         child: Image.network(
  //           urlImage,
  //           fit: BoxFit.cover,
  //         ),
  //       ),
  //     );

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    log(exameId);

    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
              child: Text(
                titulo,
                textAlign: TextAlign.left,
                style: const TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                ),
              ),
            ),
          ),
          Container(
            alignment: Alignment.center,
            padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
            child: _imageBase64 == "" ? Container() : Image.memory(base64Decode(_imageBase64)),
          ),
          // StreamBuilder<QuerySnapshot>(
          //   stream: FirebaseFirestore.instance
          //       .collection('exame_images')
          //       .where('exameId', isEqualTo: exameId)
          //       .snapshots(),
          //   builder: (context, snapshot) {
          //     if (snapshot.hasData) {
          //       List<Map> exameImages = [];
          //
          //       for (int i = 0; i < snapshot.data!.docs.length; i++) {
          //         DocumentSnapshot snap = snapshot.data!.docs[i];
          //         exameImages.add({
          //           'id': snap.id,
          //           'url': snap.get('url'),
          //           'exameId': snap.get('exameId'),
          //           'createdAt': snap.get('createdAt'),
          //         });
          //       }
          //
          //       return CarouselSlider.builder(
          //         options: CarouselOptions(
          //           height: size.height * 0.5,
          //           enableInfiniteScroll: false,
          //           enlargeCenterPage: true,
          //           enlargeStrategy: CenterPageEnlargeStrategy.height,
          //         ),
          //         itemCount: exameImages.length,
          //         itemBuilder: (context, index, realIndex) {
          //           final urlImage = exameImages[index]['url'];
          //
          //           return buildImage(urlImage, index);
          //         },
          //       );
          //     } else if (snapshot.hasError) {
          //       return const Center(child: Text('Something went wrong'));
          //     } else {
          //       return const Center(child: CircularProgressIndicator());
          //     }
          //   },
          // ),
          Container(
            alignment: Alignment.centerLeft,
            child: const Padding(
              padding: EdgeInsets.symmetric(horizontal: 30, vertical: 20),
              child: Text(
                "Descrição",
                textAlign: TextAlign.left,
                style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                ),
              ),
            ),
          ),
          Container(
            color: kGreyColor,
            width: size.width * 0.85,
            height: size.height * 0.05,
            child: Text(description),
          ),
          Container(
            alignment: Alignment.centerLeft,
            child: const Padding(
              padding: EdgeInsets.symmetric(horizontal: 30, vertical: 20),
              child: Text(
                "Resultado",
                textAlign: TextAlign.left,
                style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                ),
              ),
            ),
          ),
          Container(
            color: kGreyColor,
            width: size.width * 0.85,
            height: size.height * 0.05,
            child: Text(cellCount),
          )
        ],
      ),
    );
  }

  void downloadImage() async {
    final prefs = await SharedPreferences.getInstance();
    var authToken = prefs.getString('authToken');

    try{
      var headers = {
        'Authorization': 'Bearer $authToken'
      };
      var request = http.Request('GET', Uri.parse('http://cellia:3000/document/download/$exameId'));

      request.headers.addAll(headers);

      http.StreamedResponse response = await request.send();
      var resposta = await http.Response.fromStream(response);

      if (resposta.statusCode == 200 || resposta.statusCode == 201) {
        var decodedResponse = DownloadPhotoModel.fromJson(jsonDecode(resposta.body));
        _imageBase64 = decodedResponse.data?.base64File ?? "";
        setState(() {

        });
      }
      else {
        Fluttertoast.showToast(msg: response.reasonPhrase ?? "Erro.");
      }
    }catch (err){
      Fluttertoast.showToast(msg: "Não Foi Possivel Recuperar imagem");
    }
  }
}

class DownloadPhotoModel {
  int? statusCode;
  String? message;
  DataPhoto? data;
  String? time;

  DownloadPhotoModel({this.statusCode, this.message, this.data, this.time});

  DownloadPhotoModel.fromJson(Map<String, dynamic> json) {
    statusCode = json['statusCode'];
    message = json['message'];
    data = json['data'] != null ? new DataPhoto.fromJson(json['data']) : null;
    time = json['time'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['statusCode'] = this.statusCode;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    data['time'] = this.time;
    return data;
  }
}

class DataPhoto {
  String? fileName;
  String? fileType;
  String? base64File;

  DataPhoto({this.fileName, this.fileType, this.base64File});

  DataPhoto.fromJson(Map<String, dynamic> json) {
    fileName = json['fileName'];
    fileType = json['fileType'];
    base64File = json['base64File'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['fileName'] = this.fileName;
    data['fileType'] = this.fileType;
    data['base64File'] = this.base64File;
    return data;
  }
}
