import 'dart:async';
import 'dart:convert';
import 'dart:developer';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../../../components/rounded_button.dart';
import '../../../constants.dart';
import '../../ResultsDetails/results_details_screen.dart';

List<Map> cardsExam = [];

class Body extends StatefulWidget {
  const Body({Key? key}) : super(key: key);

  // getDate(Timestamp exameDate) {
  //   DateTime date = DateTime.parse(exameDate.toDate().toString());
  //
  //   return DateFormat('dd-MM-yyy').format(date);
  // }
  @override
  State<Body> createState() => _BodyState();
}

class _BodyState extends State<Body> {

  @override
  void initState() {
    super.initState();
    getUserExam();
  }

  @override
  void dispose(){
    super.dispose();
    cardsExam.clear();
  }

  // Timer? _timers;
  // int _start = 5;
  //
  // void startTimer() {
  //   const oneSec = Duration(seconds: 1);
  //   _timers = Timer.periodic(
  //     oneSec,
  //         (Timer timer) {
  //       if (_start == 0) {
  //         setState(() {
  //           _start = 6;
  //           getUserExam();
  //         });
  //       } else {
  //         setState(() {
  //           _start--;
  //         });
  //       }
  //     },
  //   );
  // }

  @override
  Widget build(BuildContext context) {
    User? user = FirebaseAuth.instance.currentUser;
    Size size = MediaQuery.of(context).size;

    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            alignment: Alignment.centerLeft,
            child: const Padding(
              padding: EdgeInsets.symmetric(horizontal: 30, vertical: 20),
              child: Text(
                'Resultados',
                textAlign: TextAlign.left,
                style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 25,
                ),
              ),
            ),
          ),
          Padding(
            padding:
            EdgeInsets.symmetric(vertical: size.height * 0.03),
            child: RoundedButton(
              text: "Atualizar",
              color: kPrimaryColor,
              press: () async {
                getUserExam();
                //print(cardsExam.toString());
              },
            ),
          ),
          // StreamBuilder<QuerySnapshot>(
          //   stream: FirebaseFirestore.instance
          //       .collection('exames')
          //       .where('userUid', isEqualTo: user!.uid)
          //       .snapshots(),
          //   builder: (context, snapshot) {
          //     if (snapshot.hasData) {
          //       List<Map> exames = [];
          //
          //       for (int i = 0; i < snapshot.data!.docs.length; i++) {
          //         DocumentSnapshot snap = snapshot.data!.docs[i];
          //         exames.add({
          //           'id': snap.id,
          //           'title': snap.get('title'),
          //           'description': snap.get('description'),
          //           'createdAt': snap.get('createdAt'),
          //         });
          //       }

          DataTable(
            columns: const [
              DataColumn(
                label: Text(
                  'Exame',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 20,
                  ),
                ),
              ),
              DataColumn(
                label: Text(
                  'Status',
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 20,
                  ),
                ),
              ),
            ],
            rows: cardsExam
                .reversed
                .map(
                  ((cardExame) => DataRow(
                        cells: <DataCell>[
                          DataCell(
                            GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) {
                                      return ResultsDetailsScreen(
                                        title: cardExame['title'],
                                        description: cardExame['description'],
                                        exameId: cardExame['resultPhotoId'].toString(),
                                        cellCount: cardExame['cellCount'].toString(),
                                      );
                                    },
                                  ),
                                );
                              },
                              child: Text(
                                cardExame['title'],
                                style: const TextStyle(
                                  color: kBlueColor,
                                  fontSize: 15,
                                ),
                              ),
                            ),
                          ),
                          DataCell(
                            Text(
                              cardExame['status']['value'],
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 17,
                              ),
                            ),
                          ),
                        ],
                      )),
                ).toList(),
          )
          //     } else if (snapshot.hasError) {
          //       return const Center(child: Text('Something went wrong'));
          //     } else {
          //       return const Center(child: CircularProgressIndicator());
          //     }
          //   },
          // )
          ,
        ],
      ),
    );
  }

  void getUserExam() async {
    final prefs = await SharedPreferences.getInstance();
    var authToken = prefs.getString('authToken');

    try{
      var headers = {
        'Authorization': 'Bearer $authToken'
      };
      var request = http.Request('GET', Uri.parse('https://api.cellcount.online/api/hemogram-exam/user'));

      request.headers.addAll(headers);

      http.StreamedResponse response = await request.send();
      var resposta = await http.Response.fromStream(response);

      if (resposta.statusCode == 200 || resposta.statusCode == 201) {
        var decodedResponse = ExamModelMulti.fromJson(jsonDecode(resposta.body));
        var resultsExams = decodedResponse.data?.content;
        int numberOfExams = decodedResponse.data?.size ?? 0;
        try {
        cardsExam.clear();
        for (int i = 0; i < numberOfExams; i++) {
          if(resultsExams?[i].status?.id == 13){
            cardsExam.add(
                {
                  "id": resultsExams![i].id,
                  "title": resultsExams[i].title,
                  "description": resultsExams[i].description,
                  "cellCount": resultsExams[i].cellCount,
                  "resultPhotoId": resultsExams[i].hemogramExamDocuments![1].document?.id,
                  "status": {
                    "id": resultsExams[i].status!.id,
                    "value": resultsExams[i].status!.value,
                    "description": resultsExams[i].status!.description,
                    "active": resultsExams[i].status!.active
                  }
                }
            );
          } else {
            cardsExam.add(
                {
                  "id": resultsExams![i].id,
                  "title": resultsExams[i].title,
                  "description": resultsExams[i].description,
                  "cellCount": resultsExams[i].cellCount,
                  "resultPhotoId": "",
                  "status": {
                    "id": resultsExams[i].status!.id,
                    "value": resultsExams[i].status!.value,
                    "description": resultsExams[i].status!.description,
                    "active": resultsExams[i].status!.active
                  }
                }
            );
          }
          log(resposta.body);
          setState(() {

          });
        }
        }catch(err) {
          log(err.toString());
        }
      }
      else {
        print(resposta.body);
      }

    } catch (err) {
      Fluttertoast.showToast(msg: "Não foi possivel carregar seus exames", toastLength: Toast.LENGTH_LONG, timeInSecForIosWeb: 4);
    }

  }

}

// class ExamModel {
//   int? statusCode;
//   String? message;
//   Data? data;
//   String? time;
//
//   ExamModel({this.statusCode, this.message, this.data, this.time});
//
//   ExamModel.fromJson(Map<String, dynamic> json) {
//     statusCode = json['statusCode'];
//     message = json['message'];
//     data = json['data'] != null ? new Data.fromJson(json['data']) : null;
//     time = json['time'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['statusCode'] = this.statusCode;
//     data['message'] = this.message;
//     if (this.data != null) {
//       data['data'] = this.data!.toJson();
//     }
//     data['time'] = this.time;
//     return data;
//   }
// }
//
// class Data {
//   String? title;
//   String? description;
//   List<HemogramExamDocuments>? hemogramExamDocuments;
//   Status? status;
//   Null? cellCount;
//   int? id;
//
//   Data(
//       {this.title,
//         this.description,
//         this.hemogramExamDocuments,
//         this.status,
//         this.cellCount,
//         this.id});
//
//   Data.fromJson(Map<String, dynamic> json) {
//     title = json['title'];
//     description = json['description'];
//     if (json['hemogramExamDocuments'] != null) {
//       hemogramExamDocuments = <HemogramExamDocuments>[];
//       json['hemogramExamDocuments'].forEach((v) {
//         hemogramExamDocuments!.add(new HemogramExamDocuments.fromJson(v));
//       });
//     }
//     status =
//     json['status'] != null ? new Status.fromJson(json['status']) : null;
//     cellCount = json['cellCount'];
//     id = json['id'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['title'] = this.title;
//     data['description'] = this.description;
//     if (this.hemogramExamDocuments != null) {
//       data['hemogramExamDocuments'] =
//           this.hemogramExamDocuments!.map((v) => v.toJson()).toList();
//     }
//     if (this.status != null) {
//       data['status'] = this.status!.toJson();
//     }
//     data['cellCount'] = this.cellCount;
//     data['id'] = this.id;
//     return data;
//   }
// }
//
// class HemogramExamDocuments {
//   Document? document;
//   bool? isResult;
//
//   HemogramExamDocuments({this.document, this.isResult});
//
//   HemogramExamDocuments.fromJson(Map<String, dynamic> json) {
//     document = json['document'] != null
//         ? new Document.fromJson(json['document'])
//         : null;
//     isResult = json['isResult'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     if (this.document != null) {
//       data['document'] = this.document!.toJson();
//     }
//     data['isResult'] = this.isResult;
//     return data;
//   }
// }
//
// class Document {
//   int? id;
//   String? fileName;
//   String? fileHash;
//   String? fileType;
//
//   Document({this.id, this.fileName, this.fileHash, this.fileType});
//
//   Document.fromJson(Map<String, dynamic> json) {
//     id = json['id'];
//     fileName = json['fileName'];
//     fileHash = json['fileHash'];
//     fileType = json['fileType'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['id'] = this.id;
//     data['fileName'] = this.fileName;
//     data['fileHash'] = this.fileHash;
//     data['fileType'] = this.fileType;
//     return data;
//   }
// }
//
// class Status {
//   int? id;
//   String? value;
//   String? description;
//   bool? active;
//
//   Status({this.id, this.value, this.description, this.active});
//
//   Status.fromJson(Map<String, dynamic> json) {
//     id = json['id'];
//     value = json['value'];
//     description = json['description'];
//     active = json['active'];
//   }
//
//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['id'] = this.id;
//     data['value'] = this.value;
//     data['description'] = this.description;
//     data['active'] = this.active;
//     return data;
//   }
// }

class ExamModelMulti {
  int? statusCode;
  String? message;
  Data? data;
  String? time;

  ExamModelMulti({this.statusCode, this.message, this.data, this.time});

  ExamModelMulti.fromJson(Map<String, dynamic> json) {
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
  int? size;
  List<Content>? content;

  Data({this.size, this.content});

  Data.fromJson(Map<String, dynamic> json) {
    size = json['size'];
    if (json['content'] != null) {
      content = <Content>[];
      json['content'].forEach((v) {
        content!.add(new Content.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['size'] = this.size;
    if (this.content != null) {
      data['content'] = this.content!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Content {
  int? id;
  String? title;
  String? description;
  int? cellCount;
  List<HemogramExamDocuments>? hemogramExamDocuments;
  Status? status;

  Content(
      {this.id,
        this.title,
        this.description,
        this.cellCount,
        this.hemogramExamDocuments,
        this.status});

  Content.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    title = json['title'];
    description = json['description'];
    cellCount = json['cellCount'];
    if (json['hemogramExamDocuments'] != null) {
      hemogramExamDocuments = <HemogramExamDocuments>[];
      json['hemogramExamDocuments'].forEach((v) {
        hemogramExamDocuments!.add(new HemogramExamDocuments.fromJson(v));
      });
    }
    status =
    json['status'] != null ? new Status.fromJson(json['status']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['title'] = this.title;
    data['description'] = this.description;
    data['cellCount'] = this.cellCount;
    if (this.hemogramExamDocuments != null) {
      data['hemogramExamDocuments'] =
          this.hemogramExamDocuments!.map((v) => v.toJson()).toList();
    }
    if (this.status != null) {
      data['status'] = this.status!.toJson();
    }
    return data;
  }
}

class HemogramExamDocuments {
  bool? isResult;
  Document? document;

  HemogramExamDocuments({this.isResult, this.document});

  HemogramExamDocuments.fromJson(Map<String, dynamic> json) {
    isResult = json['isResult'];
    document = json['document'] != null
        ? new Document.fromJson(json['document'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['isResult'] = this.isResult;
    if (this.document != null) {
      data['document'] = this.document!.toJson();
    }
    return data;
  }
}

class Document {
  int? id;
  String? fileName;
  String? fileHash;
  String? fileType;

  Document({this.id, this.fileName, this.fileHash, this.fileType});

  Document.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    fileName = json['fileName'];
    fileHash = json['fileHash'];
    fileType = json['fileType'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['fileName'] = this.fileName;
    data['fileHash'] = this.fileHash;
    data['fileType'] = this.fileType;
    return data;
  }
}

class Status {
  int? id;
  String? value;
  String? description;
  bool? active;

  Status({this.id, this.value, this.description, this.active});

  Status.fromJson(Map<String, dynamic> json) {
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
