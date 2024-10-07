class AtlasModel {
  String? abreviatura;
  String? categoria;
  String? celula;
  String? imagem;

  AtlasModel({
    this.abreviatura,
    this.categoria,
    this.celula,
    this.imagem,
  });

  factory AtlasModel.fromMap(map) {
    return AtlasModel(
      abreviatura: map['abreviatura'],
      categoria: map['categoria'],
      celula: map['celula'],
      imagem: map['imagem'],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'abreviatura': abreviatura,
      'categoria': categoria,
      'celula': celula,
      'imagem': imagem,
    };
  }
}
