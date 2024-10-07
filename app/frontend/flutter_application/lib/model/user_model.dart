class UserModel {
  String? uid;
  String? name;
  String? email;
  bool? isStudent;

  UserModel({
    this.uid,
    this.name,
    this.email,
    this.isStudent,
  });

  // Receiving data from server
  factory UserModel.fromMap(map) {
    return UserModel(
      uid: map['uid'],
      name: map['name'],
      email: map['email'],
      isStudent: map['is_student'],
    );
  }

  // Sending data to server
  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'name': name,
      'email': email,
      'is_student': isStudent,
    };
  }
}
