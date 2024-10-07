import 'dart:convert';
import 'dart:developer';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../../../components/rounded_button.dart';
import '../../../constants.dart';
import '../../../model/user_model.dart';
import '../../Welcome/welcome_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
var logger = Logger();

class Body extends StatefulWidget {
  const Body({Key? key}) : super(key: key);

  @override
  State<Body> createState() => _BodyState();
}

var url = Uri.https('api.cellcount.online', '/api/user');


class _BodyState extends State<Body> {
  final _auth = FirebaseAuth.instance;

  String? errorMessage;
  final _formKey = GlobalKey<FormState>();
  final nameEditingController = TextEditingController();
  final emailEditingController = TextEditingController();
  final passwordEditingController = TextEditingController();
  final confirmPasswordEditingController = TextEditingController();
  bool isCheckedProfessor = false;
  bool isCheckedAluno = false;

  String professor = 'Professor role';
  String professorDescription = 'Role with professor privileges';

  String student = 'Student role';
  String studentDescription = 'Role with student privileges';

  Future<String> test() async {
    var response = await http.get(url);

    logger.e('Response status: ${response.statusCode}');
    logger.d('Response body: ${response.body}');

    return "done";
}

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            Container(
              alignment: Alignment.centerLeft,
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 50, vertical: 60),
                child: Text(
                  'Olá, \nCadastre-se!',
                  textAlign: TextAlign.left,
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 30,
                  ),
                ),
              ),
            ),
            const RegisterLabels(label: 'Nome:'),
            RegisterTextField(
              controller: nameEditingController,
              keyboardType: TextInputType.name,
              obscureText: false,
              validator: (value) {
                RegExp regex = RegExp(r'^.{3,}$');
                if (value!.isEmpty) {
                  return ("Nome não pode ser vazio");
                }
                if (!regex.hasMatch(value)) {
                  return ("Utilize um nome válido(Min. 3 Caracteres)");
                }
                return null;
              },
            ),
            const RegisterLabels(label: 'Email:'),
            RegisterTextField(
              controller: emailEditingController,
              keyboardType: TextInputType.emailAddress,
              obscureText: false,
              validator: (value) {
                if (value!.isEmpty) {
                  return ("Por favor insira um email");
                }
                // reg expression for email validation
                if (!RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+.[a-z]")
                    .hasMatch(value)) {
                  return ("Por favor insira um email válido");
                }
                return null;
              },
            ),
            const RegisterLabels(label: 'Senha:'),
            RegisterTextField(
              controller: passwordEditingController,
              keyboardType: TextInputType.text,
              obscureText: true,
              validator: (value) {
                RegExp regex = RegExp(r'^.{6,}$');
                if (value!.isEmpty) {
                  return ("A senha é obrigatória");
                }
                if (!regex.hasMatch(value)) {
                  return ("Insira uma senha válida(Min. 6 Caracteres)");
                }
              },
            ),
            const RegisterLabels(label: 'Confirmar senha:'),
            RegisterTextField(
              controller: confirmPasswordEditingController,
              keyboardType: TextInputType.text,
              obscureText: true,
              validator: (value) {
                if (confirmPasswordEditingController.text !=
                    passwordEditingController.text) {
                  return "Senhas não são as mesmas";
                }
                return null;
              },
            ),
            Row(
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 50),
                  child: Checkbox(
                    value: isCheckedProfessor,
                    onChanged: (bool? value) {
                      setState(() {
                        isCheckedProfessor = value!;
                      });
                    },
                  ),
                ),
                const Text(
                  'Sou professor(a)',
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
              ],
            ),
            Row(
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 50),
                  child: Checkbox(
                    value: isCheckedAluno,
                    onChanged: (bool? value) {
                      setState(() {
                        isCheckedAluno = value!;
                      });
                    },
                  ),
                ),
                const Text(
                  'Sou aluno(a)',
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
              ],
            ),
            RoundedButton(
              text: "Cadastrar",
              press: () {
                signUpToAPI(
                    emailEditingController.text,
                    nameEditingController.text,
                    passwordEditingController.text
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  void signUp(String email, String password) async {
    if (_formKey.currentState!.validate()) {
      try {
        if (!isCheckedAluno && !isCheckedProfessor) {
          Fluttertoast.showToast(msg: "Selecione um tipo de usuário");
          throw FirebaseAuthException(code: "empty-user-type");
        }

        await _auth
            .createUserWithEmailAndPassword(email: email, password: password)
            .then((value) => {postDetailsToFirestore()})
            .catchError((e) {
          Fluttertoast.showToast(msg: e!.message);
        });
      } on FirebaseAuthException catch (error) {
        switch (error.code) {
          case "invalid-email":
            errorMessage = "Email inválido";
            break;
          case "wrong-password":
            errorMessage = "Credenciais inválidas";
            break;
          case "user-not-found":
            errorMessage = "Não existe usuário com este email";
            break;
          case "user-disabled":
            errorMessage = "Usuário desabilitado";
            break;
          case "too-many-requests":
            errorMessage = "Muitas requisições";
            break;
          case "operation-not-allowed":
            errorMessage = "Operação não foi permitida";
            break;
          case "empty-user-type":
            errorMessage = "Selecione um tipo de usuário";
            break;
          default:
            errorMessage = "Um erro ainda indefinido aconteceu";
        }
        Fluttertoast.showToast(msg: errorMessage!);
        print(error.code);
      }
    }
  }

  void signUpToAPI(String email, String nome, String password) async {

    if (_formKey.currentState!.validate()) {
      try {
        if (!isCheckedAluno && !isCheckedProfessor) {
          Fluttertoast.showToast(msg: "Selecione um tipo de usuário");
          return;
        }

        var registerResponse = await http.post( Uri.parse('https://api.cellcount.online/api/user'),
            headers: <String, String>{
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body: jsonEncode(<String, dynamic>{
              "email": email,
              "name": nome,
              "password": password,
              "roles": [
                {
                  "id": 2,
                  "value": isCheckedAluno ? student : professor,
                  "description": isCheckedAluno ? student : professor,
                  "active": true
                }
              ]
            })
        );

        if (registerResponse.statusCode == 201) {
         // Fluttertoast.showToast(msg: "Conta Cadastrada Na API");

          var loginResponse = await http.post( Uri.parse('https://api.cellcount.online/api/auth/login'),
              headers: <String, String>{
                'Content-Type': 'application/json; charset=UTF-8',
              },
              body: jsonEncode(<String, dynamic>{
                "email": email,
                "password": password
              })
          );

          final prefs = await SharedPreferences.getInstance();
          var decodeAuthToken = LoginResponseModel.fromJson(jsonDecode(loginResponse.body));
          var authToken = decodeAuthToken.data?.authToken ?? "";
          await prefs.setString('authToken', authToken);

          signUp(email, password);
        } else {
          var decodedResponse = MessageError.fromJson(jsonDecode(registerResponse.body)) ;

          Fluttertoast.showToast(msg: decodedResponse.data?.message ?? "");
          logger.i(decodedResponse.data?.message ?? "");

        }
      } catch (error) {
          Fluttertoast.showToast(msg: "Erro Inesperado: " + error.toString());
        }
      }
  }

  postDetailsToFirestore() async {
    FirebaseFirestore firebaseFirestore = FirebaseFirestore.instance;
    User? user = _auth.currentUser;

    UserModel userModel = UserModel();

    userModel.email = user!.email;
    userModel.uid = user.uid;
    userModel.name = nameEditingController.text;
    if (isCheckedAluno) {
      userModel.isStudent = true;
    }
    if (isCheckedProfessor) {
      userModel.isStudent = false;
    }

    await firebaseFirestore
        .collection("users")
        .doc(user.uid)
        .set(userModel.toMap());
    Fluttertoast.showToast(msg: "Conta criada com sucesso");

    Navigator.pushAndRemoveUntil(
        (context),
        MaterialPageRoute(builder: (context) => WelcomeScreen()),
        (route) => false);
  }
}

class RegisterLabels extends StatelessWidget {
  final String label;

  const RegisterLabels({
    Key? key,
    required this.label,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.centerLeft,
      padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 10),
      child: Text(
        label,
        textAlign: TextAlign.left,
        style: const TextStyle(
          color: Colors.black,
          fontWeight: FontWeight.bold,
          fontSize: 20,
        ),
      ),
    );
  }
}


class MessageError {
  int? statusCode;
  String? message;
  Data? data;
  String? time;

  MessageError({this.statusCode, this.message, this.data, this.time});

  MessageError.fromJson(Map<String, dynamic> json) {
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
  String? message;

  Data({this.message});

  Data.fromJson(Map<String, dynamic> json) {
    message = json['message'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['message'] = this.message;
    return data;
  }
}


class RegisterTextField extends StatelessWidget {
  final TextEditingController controller;
  final TextInputType keyboardType;
  final bool obscureText;
  final String? Function(String?)? validator;

  const RegisterTextField({
    Key? key,
    required this.controller,
    required this.keyboardType,
    required this.obscureText,
    required this.validator,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 5),
      width: size.width * 0.75,
      decoration: BoxDecoration(
        color: kGreyColor,
        borderRadius: BorderRadius.circular(15),
      ),
      child: TextFormField(
        autofocus: false,
        controller: controller,
        keyboardType: keyboardType,
        obscureText: obscureText,
        scrollPadding: const EdgeInsets.symmetric(horizontal: 20),
        decoration: const InputDecoration(
          border: InputBorder.none,
        ),
        onSaved: (value) {
          controller.text = value!;
        },
        textInputAction: TextInputAction.done,
        validator: validator,
      ),
    );
  }
}

class LoginResponseModel {
  int? statusCode;
  String? message;
  DataLogin? data;
  String? time;

  LoginResponseModel({this.statusCode, this.message, this.data, this.time});

  LoginResponseModel.fromJson(Map<String, dynamic> json) {
    statusCode = json['statusCode'];
    message = json['message'];
    data = json['data'] != null ? new DataLogin.fromJson(json['data']) : null;
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

class DataLogin {
  UserAPI? user;
  List<Roles>? roles;
  String? authToken;
  int? expiresIn;

  DataLogin({this.user, this.roles, this.authToken, this.expiresIn});

  DataLogin.fromJson(Map<String, dynamic> json) {
    user = json['user'] != null ? new UserAPI.fromJson(json['user']) : null;
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

class UserAPI {
  int? id;
  String? name;
  String? email;
  bool? active;

  UserAPI({this.id, this.name, this.email, this.active});

  UserAPI.fromJson(Map<String, dynamic> json) {
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
