export class User {
  nome: string;
  apelido: string;
  email: string;
  curso: [];
  contacto: number;
  estado: string;
  id: number;
  token?: string;
}

export class UserDados {
  nome: string;
  apelido: string;
  email: string;
  contacto: string;
  datanasc: string;
  nacionalidade: string;
  naturalidade: string;
  bi: string;
  localemissao: string;
  dataemissao: string;
  datavalidade: string;
  nivelformacao: string;
}

export class UserConvidados {
  AlunosCovidados: [{
    codigo: number;
    createdAt: string;
    desconto_aluno: string;
    descunto_conv: string;
    email_aluno_conv: string;
    estado: string;
    id: number;
    id_aluno: string;
    id_convidado: string;
  }]
  FotoAlunos: [];
  apelido: string;
  contacto: number;
  email: string;
  id: number;
  nome: string;
}

export class Convidados {
  codigo: number;
  createdAt: string;
  desconto_aluno: string;
  descunto_conv: string;
  email_aluno_conv: string;
  estado: string;
  id: number;
  id_aluno: string;
  id_convidado: string;
}
