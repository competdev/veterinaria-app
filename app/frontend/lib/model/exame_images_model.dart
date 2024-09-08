
class ExameImagesModel {
  String? id;
  String? exameId;
  String? url;
  DateTime? createdAt;

  ExameImagesModel({
    this.id,
    this.exameId,
    this.url,
    this.createdAt,
  });

  // Receiving data from server
  factory ExameImagesModel.fromMap(map) {
    return ExameImagesModel(
      id: map['id'],
      exameId: map['exameId'],
      url: map['url'],
      createdAt: map['createdAt'],
    );
  }

  // Sending data to server
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'exameId': exameId,
      'url': url,
      'createdAt': createdAt,
    };
  }
}
