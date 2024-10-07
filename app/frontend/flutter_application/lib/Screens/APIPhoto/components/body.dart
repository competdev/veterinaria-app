import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_application/Screens/Welcome/welcome_screen.dart';
import 'package:flutter_application/constants.dart';
import 'package:flutter_application/model/exame_images_model.dart';
import 'package:flutter_application/model/exames_model.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:image_picker/image_picker.dart';

import 'package:http/http.dart' as http;
import 'package:progress_dialog_null_safe/progress_dialog_null_safe.dart';
import 'dart:convert';
import 'package:http_parser/http_parser.dart';

import '../../../components/rounded_button.dart';
import '../../Register/components/body.dart';

import 'package:camera/camera.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:logger/logger.dart';

