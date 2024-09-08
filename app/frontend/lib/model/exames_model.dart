
class ExamesModel {
  String? id;
  String? title;
  String? description;
  String? userUid;
  DateTime? createdAt;

  ExamesModel({
    this.id,
    this.title,
    this.description,
    this.userUid,
    this.createdAt,
  });

  // Receiving data from server
  factory ExamesModel.fromMap(map) {
    return ExamesModel(
      id: map['id'],
      title: map['title'],
      description: map['description'],
      userUid: map['userUid'],
      createdAt: map['createdAt'],
    );
  }

  // Sending data to server
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'userUid': userUid,
      'createdAt': createdAt,
    };
  }
}
