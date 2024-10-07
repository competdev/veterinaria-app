import 'dart:convert';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_application/Screens/Menus/menus_screen.dart';
import 'package:flutter_application/Screens/Welcome/components/background.dart';
import 'package:flutter_application/components/register_button.dart';
import 'package:flutter_application/components/rounded_button.dart';
import 'package:flutter_application/components/rounded_input_field.dart';
import 'package:flutter_application/components/rounded_password_field.dart';
import 'package:flutter_application/constants.dart';
import 'package:flutter_application/provider/google_sign_in.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:logger/logger.dart';
var logger = Logger();


class Body extends StatefulWidget {
  const Body({Key? key}) : super(key: key);

  @override
  State<Body> createState() => _BodyState();
}

class _BodyState extends State<Body> {
  // Login function
  static Future<User?> loginUsingEmailPassword(
      {required String email,
      required String password,
      required BuildContext context}) async {
    FirebaseAuth auth = FirebaseAuth.instance;
    User? user;
    try {
      UserCredential userCredential = await auth.signInWithEmailAndPassword(
          email: email, password: password);
      user = userCredential.user as User?;
    } on FirebaseAuthException catch (e) {
      if (e.code == "user-not-found") {
        print("No user found for that email");
      }
    }

    return user;
  }

  @override
  Widget build(BuildContext context) {
    // This size provide us total height and width of our screen
    Size size = MediaQuery.of(context).size;
    TextEditingController _emailController = TextEditingController();
    TextEditingController _passwordController = TextEditingController();

    return Background(
      child: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            SizedBox(height: size.height * 0.5),
            RoundedInputField(
              hintText: "Email",
              onChanged: (value) {},
              controller: _emailController,
            ),
            SizedBox(height: size.height * 0.02),
            RoundedPasswordField(
              onChanged: (value) {},
              controller: _passwordController,
            ),
            SizedBox(height: size.height * 0.02),
            RoundedButton(
              text: "Entrar",
              press: () {
                loginUserApi(
                  _emailController.text.trim(),
                  _passwordController.text.trim()
              );
              },
            ),
            // const Text(
            //   "ou",
            //   textAlign: TextAlign.center,
            //   style: TextStyle(
            //     color: kDarkGreyColor,
            //     fontWeight: FontWeight.bold,
            //   ),
            // ),
            // ElevatedButton.icon(
            //   onPressed: () {
            //     final provider =
            //         Provider.of<GoogleSignInProvider>(context, listen: false);
            //     provider.googleLogin();
            //   },
            //   icon: const FaIcon(FontAwesomeIcons.google, color: kPrimaryColor),
            //   label: const Text('Faça login com Google',
            //       style: TextStyle(
            //           color: Colors.black,
            //           fontSize: 15,
            //           fontWeight: FontWeight.w500)),
            //   style: ElevatedButton.styleFrom(
            //     primary: kGreyColor,
            //     padding:
            //         const EdgeInsets.symmetric(horizontal: 40, vertical: 18),
            //   ),
            // ),
            SizedBox(height: size.height * 0.02),
            const RegisterButton(),
          ],
        ),
      ),
    );
  }

  void loginUserApi(String email, String password) async {
    final prefs = await SharedPreferences.getInstance();

    try{
      var loginResponse = await http.post( Uri.parse('https://api.cellcount.online/api/auth/login'),
          headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          },
          body: jsonEncode(<String, dynamic>{
            "email": email,
            "password": password
          })
      );

      if (loginResponse.statusCode == 200 || loginResponse.statusCode == 201){

        var decodeAuthToken = LoginResponseModel.fromJson(jsonDecode(loginResponse.body));
        var authToken = decodeAuthToken.data?.authToken ?? "";

        if(authToken.isNotEmpty) {
          try {
            await prefs.setString('authToken', authToken);
          }catch (err){
            Fluttertoast.showToast(msg: "Falha na autenticaçao, tente novamente");
            logger.e(err);
            return;
          }
        } else {
          Fluttertoast.showToast(msg: "Falha na autenticaçao, tente novamente");
          return;
        }
          //Fluttertoast.showToast(msg: "Logado na API");
          User? user = await loginUsingEmailPassword(
              email: email,
              password: password,
              context: context);
          if (user != null) {
            Navigator.of(context).pushReplacement(MaterialPageRoute(
              builder: (context) => const MenusScreen(),
            ));
          } else {
            Fluttertoast.showToast(msg: "Conta desativada, Use Uma nova conta");
          }
        } else {
        Fluttertoast.showToast(msg: "Erro Inesperado, tente novamente");
      }
      } catch (err){
        //Fluttertoast.showToast(msg: "Erro Inesperado");
    }
  }
}

class LoginResponseModel {
  int? statusCode;
  String? message;
  Data? data;
  String? time;

  LoginResponseModel({this.statusCode, this.message, this.data, this.time});

  LoginResponseModel.fromJson(Map<String, dynamic> json) {
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
  User? user;
  List<Roles>? roles;
  String? authToken;
  int? expiresIn;

  Data({this.user, this.roles, this.authToken, this.expiresIn});

  Data.fromJson(Map<String, dynamic> json) {
    user = json['user'] != null ? new User.fromJson(json['user']) : null;
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

class User {
  int? id;
  String? name;
  String? email;
  bool? active;

  User({this.id, this.name, this.email, this.active});

  User.fromJson(Map<String, dynamic> json) {
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
