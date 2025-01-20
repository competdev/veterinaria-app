import 'dart:convert';
import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_application/Screens/Atlas/atlas_screen.dart';

import 'package:flutter_application/Screens/SendCapture/send_capture_screen.dart';
import 'package:flutter_application/constants.dart';
import 'package:flutter_application/model/user_model.dart';
import 'package:flutter_application/presentation/drawer_icon_icons.dart';
import 'package:flutter_application/presentation/microscope_icon_icons.dart';
import 'package:flutter_application/presentation/spreadsheet_icon_icons.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart' as path_provider;

import '../../../components/top_main_menus.dart';
import '../../Results/results_screen.dart';
import '../../Welcome/welcome_screen.dart';


class Body extends StatefulWidget {
  final String name;
  const Body({
    Key? key,
    this.name = 'Usuário',
  }) : super(key: key);

  @override
  State<Body> createState() => _BodyState();
}

class _BodyState extends State<Body> {
  User? user = FirebaseAuth.instance.currentUser;
  UserModel loggedInUser = UserModel();
  File? image;
  Future<Directory?>? _tempDirectory;

  Future<File?> testCompressAndGetFile(File file, String targetPath) async {
    var result = await FlutterImageCompress.compressAndGetFile(
      file.absolute.path, targetPath,
      quality: 30,
    );

    print(file.lengthSync());
    print(result?.lengthSync());

    return result;
  }


  Future pickImage() async {
    try {
      final image = await ImagePicker().pickImage(source: ImageSource.camera, imageQuality: 10);
      if (image == null) return;

      final imageTemporary = File(image.path);

      setState(() => this.image = imageTemporary);
      if (this.image != null) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) {
              return SendCaptureScreen(
                image: this.image!,
              );
            },
          ),
        );
      }
    } on PlatformException catch (e) {
      print('Failed to pick image: $e');
    }
  }

  Future pickImageFromGallery() async {
    try {
      final image = await ImagePicker().pickImage(source: ImageSource.gallery, imageQuality: 10);
      if (image == null) return;

      final imageTemporary = File(image.path);
      setState(() => this.image = imageTemporary);

      if (this.image != null) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) {
              return SendCaptureScreen(
                image: this.image!,
              );
            },
          ),
        );
      }
    } on PlatformException catch (e) {
      print('Failed to pick image: $e');
    }
  }

  @override
  void initState() {
    super.initState();
    // TODO: RETIRAR FIREBASE.
    FirebaseFirestore.instance
        .collection('users')
        .doc(user!.uid)
        .get()
        .then((value) {
      loggedInUser = UserModel.fromMap(value.data());
      setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    refreshToken(context);

    String? name = "Visitante";
    if (loggedInUser.name == null) {
      name = user!.displayName;
    } else {
      name = loggedInUser.name;
    }

    return SingleChildScrollView(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          TopMainMenusWidget(user: user),
          SizedBox(height: size.height * 0.02),
          Container(
            alignment: Alignment.centerLeft,
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: size.width * 0.1),
              child: Text(
                'Olá, \n$name!',
                textAlign: TextAlign.left,
                style: const TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 30,
                ),
              ),
            ),
          ),
          SizedBox(height: size.height * 0.05),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              primary: kLightGreyColor,
              padding: EdgeInsets.symmetric(
                  horizontal: size.width * 0.16, vertical: size.height * 0.04),
              textStyle: const TextStyle(
                  color: Colors.black,
                  fontSize: 20,
                  fontWeight: FontWeight.bold),
            ),
            onPressed: () {
              pickImage();
            },
            icon: const CustomIcons(icon: MicroscopeIcon.microscope),
            label: const Text(
              "Realizar Captura",
              style: TextStyle(color: Colors.white),
            ),
          ),
          SizedBox(height: size.height * 0.05),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
              primary: kLightGreyColor,
              padding: EdgeInsets.symmetric(
                  horizontal: size.width * 0.16, vertical: size.height * 0.04),
              textStyle: const TextStyle(
                  color: Colors.black,
                  fontSize: 20,
                  fontWeight: FontWeight.bold),
            ),
            onPressed: () {
              pickImageFromGallery();
            },
            icon: const CustomIcons(icon: MicroscopeIcon.microscope),
            label: const Text(
              "imagem da galeria",
              style: TextStyle(color: Colors.white),
            ),
          ),
          SizedBox(height: size.height * 0.05),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  primary: kPrimaryColor,
                  padding: EdgeInsets.symmetric(
                    horizontal: size.width * 0.07,
                    vertical: size.height * 0.09,
                  ),
                  textStyle: const TextStyle(
                    color: Colors.black,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) {
                        return const ResultsScreen();
                      },
                    ),
                  );
                },
                child: Column(
                  children: [
                    const CustomIcons(icon: SpreadsheetIcon.spreadsheet),
                    SizedBox(height: size.height * 0.02),
                    const Text(
                      "Resultados",
                      style: TextStyle(color: Colors.white),
                    ),
                  ],
                ),
              ),
              SizedBox(width: size.width * 0.06),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                  primary: kRedLightColor,
                  padding: EdgeInsets.symmetric(
                    horizontal: size.width * 0.13,
                    vertical: size.height * 0.09,
                  ),
                  textStyle: const TextStyle(
                      color: Colors.black,
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) {
                        return const AtlasScreen();
                      },
                    ),
                  );
                },
                child: Column(
                  children: [
                    const CustomIcons(icon: DrawerIcon.drawer),
                    SizedBox(height: size.height * 0.02),
                    const Text(
                      "Atlas",
                      style: TextStyle(color: Colors.white),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

//   void tentativa(File image) async{
//
//     final prefs = await SharedPreferences.getInstance();
//     var authToken = prefs.getString('authToken');
//
//     print('bateu aqui');
//
//     final mimeTypeData =
//     lookupMimeType(image.path, headerBytes: [0xFF, 0xD8])?.split('/');
//
//     final request = http.MultipartRequest('POST', Uri.parse('http://localhost:3000/document/upload'));
//
//     var headers = {
//       'Authorization': 'Bearer $authToken'
//     };
//     final file = await http.MultipartFile.fromPath(
//         'file', image.path,
//         contentType: MediaType(mimeTypeData![0], mimeTypeData[1]));
//
//     request.headers.addAll(headers);
//     request.files.add(file);
//
//
//     try {
//       var response = await request.send();
//
//       if (response.statusCode == 200 || response.statusCode == 201) {
//         print(await response.stream.bytesToString());
//       }
//       else {
//         print(await response.stream.bytesToString());
//       }
//     } catch (err) {
//       print(err);
//     }
//   }
}

void refreshToken(BuildContext context) async{
  try {
    final prefs = await SharedPreferences.getInstance();
    var authToken = prefs.getString('authToken');

    var headers = {
      'Authorization': 'Bearer $authToken'
    };
    var request = http.Request('GET', Uri.parse('http://cellia:3000/auth/refresh'));

    request.headers.addAll(headers);

    http.StreamedResponse response = await request.send();

    if (response.statusCode ==  200 || response.statusCode == 201) {

      //print(await "REX: ${response.stream.bytesToString()}");

      var decodeAuthToken = RefreshTokenModel.fromJson(jsonDecode(await response.stream.bytesToString()));
      var newAuthToken = decodeAuthToken.data?.authToken ?? "";

      await prefs.setString('authToken', newAuthToken);

      // final prefs = await SharedPreferences.getInstance();
      // var decodeAuthToken = LoginResponseModel.fromJson(response.stream.bytesToString());
      // var authToken = decodeAuthToken.data?.authToken ?? "";
      // await prefs.setString('authToken', authToken);
    }
    else {
      // logger.d(response.stream.bytesToString());
      // print("REX: ${response.reasonPhrase}");
      print("REX: Deu erro");
      Fluttertoast.showToast(msg: "Login Expirado");
      logOutAPI(context);
    }
  } catch (err){
    print("REX: Deu erro");
    Fluttertoast.showToast(msg: "Login Expirado");
    logOutAPI(context);
  }
}

void logOutAPI(BuildContext context) async {
  await FirebaseAuth.instance.signOut();
  Navigator.of(context).pushReplacement(
    MaterialPageRoute(
      builder: (context) => const WelcomeScreen(),
    ),
  );
}

class CustomIcons extends StatelessWidget {
  final IconData icon;
  const CustomIcons({
    Key? key,
    required this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(5),
      child: Container(
        color: Colors.white,
        child: Icon(
          icon,
          color: kVeryDarkGreyColor,
          size: 50,
        ),
      ),
    );
  }
}


class RefreshTokenModel {
  int? statusCode;
  String? message;
  Data? data;
  String? time;

  RefreshTokenModel({this.statusCode, this.message, this.data, this.time});

  RefreshTokenModel.fromJson(Map<String, dynamic> json) {
    statusCode = json['statusCode'];
    message = json['message'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
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

class Data {
  UserToken? user;
  List<Roles>? roles;
  String? authToken;
  int? expiresIn;

  Data({this.user, this.roles, this.authToken, this.expiresIn});

  Data.fromJson(Map<String, dynamic> json) {
    user = json['user'] != null ? new UserToken.fromJson(json['user']) : null;
    if (json['roles'] != null) {
      roles = <Roles>[];
      json['roles'].forEach((v) {
        roles!.add(new Roles.fromJson(v));
      });
    }
    authToken = json['authToken'];
    expiresIn = json['expiresIn'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.user != null) {
      data['user'] = this.user!.toJson();
    }
    if (this.roles != null) {
      data['roles'] = this.roles!.map((v) => v.toJson()).toList();
    }
    data['authToken'] = this.authToken;
    data['expiresIn'] = this.expiresIn;
    return data;
  }
}

class UserToken {
  int? id;
  String? name;
  String? email;
  bool? active;

  UserToken({this.id, this.name, this.email, this.active});

  UserToken.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    email = json['email'];
    active = json['active'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['name'] = this.name;
    data['email'] = this.email;
    data['active'] = this.active;
    return data;
  }
}

class Roles {
  int? id;
  String? value;
  String? description;
  bool? active;

  Roles({this.id, this.value, this.description, this.active});

  Roles.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    value = json['value'];
    description = json['description'];
    active = json['active'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['value'] = this.value;
    data['description'] = this.description;
    data['active'] = this.active;
    return data;
  }
}
