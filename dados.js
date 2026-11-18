/* =========================================================
   dados.js  ·  É AQUI que você edita o conteúdo do site.
   Não precisa mexer no HTML nem no script.js.

   REGRA DAS FOTOS E VÍDEOS
   - Se você escrever só o nome do arquivo (ex.: "foto1.jpg"),
     o site procura dentro da pasta daquele item
     (veja o comentário de cada seção).
   - Se escrever um caminho completo (ex.: "assets/historia/a.jpg")
     ou um link (https://...), ele usa exatamente o que você escreveu.
   - Vídeos: pode ser arquivo .mp4 na pasta OU link do YouTube.
   - Foto que ainda não existe aparece como um quadro azul
     escrito "Adicionar foto". Isso é normal.
   ========================================================= */

/* ---------- REDES SOCIAIS ---------- */
const REDES = [
  { nome: "Facebook",  icone: "facebook",  texto: "Siga nossa página", url: "https://www.facebook.com/share/1CVGjoiYuP/" },
  { nome: "Instagram", icone: "instagram", texto: "@ieqcampinasdosul", url: "https://www.instagram.com/ieqcampinasdosul?evlk=bnJiemxmczRhbzVw" },
  { nome: "YouTube",   icone: "youtube",   texto: "@ieqcampinasdosul", url: "https://youtube.com/@ieqcampinasdosul?si=yeI5D8udtM89T8ZH" },
  { nome: "Gmail",     icone: "mail",      texto: "ieqcampinasdosul@gmail.com", url: "mailto:ieqcampinasdosul@gmail.com" }
];

/* ---------- NOSSA HISTÓRIA ----------
   Pasta das fotos: assets/historia/
   Adicione quantos slides quiser. */
const HISTORIA = {
  texto: "Escreva aqui um resumo da história da igreja: quando começou, quem fundou, marcos importantes.",
  slides: [
    { foto: "historia1.jpg", titulo: "Os primeiros passos", texto: "Descreva este momento da história da igreja." },
    { foto: "historia2.jpg", titulo: "Crescendo na fé",     texto: "Descreva este momento da história da igreja." },
    { foto: "historia3.jpg", titulo: "Nossa igreja hoje",   texto: "Descreva este momento da história da igreja." }
  ]
};

/* ---------- LIDERANÇAS ----------
   Pasta das fotos: assets/liderancas/
   Cada grupo tem nome, descrição e uma lista de membros.
   Os grupos abaixo são EXEMPLOS: renomeie, apague ou crie outros. */
const LIDERANCAS = [
  {
    grupo: "Pastoral",
    descricao: "Pastores responsáveis por conduzir e cuidar da igreja.",
    membros: [
      { nome: "Nome do Pastor",   cargo: "Pastor Presidente", foto: "pastor.jpg",  descricao: "" },
      { nome: "Nome da Pastora",  cargo: "Pastora",           foto: "pastora.jpg", descricao: "" }
    ]
  },
  {
    grupo: "Diaconia",
    descricao: "Servos que auxiliam nos cultos e no cuidado da casa de Deus.",
    membros: [
      { nome: "Nome do Diácono", cargo: "Diácono", foto: "diacono1.jpg", descricao: "" },
      { nome: "Nome do Diácono", cargo: "Diácono", foto: "diacono2.jpg", descricao: "" }
    ]
  },
  {
    grupo: "Louvor",
    descricao: "Ministério de música e adoração.",
    membros: [
      { nome: "Nome do Líder", cargo: "Líder de Louvor", foto: "louvor1.jpg", descricao: "" }
    ]
  },
  {
    grupo: "Jovens",
    descricao: "Departamento de jovens da igreja.",
    membros: [
      { nome: "Gláuber Ribeiro", cargo: "Líder de Jovens", foto: "/ieqcampinasdosul/assets/liderancas/jovens.jpeg", descricao: "" }
    ]
  },
  {
    grupo: "Mulheres",
    descricao: "Círculo de oração e ação das mulheres.",
    membros: [
      { nome: "Nome da Líder", cargo: "Líder do Departamento", foto: "mulheres1.jpg", descricao: "" }
    ]
  },
  {
    grupo: "Crianças",
    descricao: "Ministério infantil.",
    membros: [
      { nome: "Nome da Líder", cargo: "Líder Infantil", foto: "criancas1.jpg", descricao: "" }
    ]
  }
];

/* ---------- EVENTOS · BATISMOS ----------
   Cada batismo tem uma data (AAAA-MM-DD).
   Pasta: assets/batismos/<pasta>/   (ex.: assets/batismos/2026-11-15/)
   Para adicionar um batismo novo, copie um bloco { ... }, e mude os dados. */
const BATISMOS = [
  {
    data: "2026-11-15",
    titulo: "Batismo nas águas",
    descricao: "Exemplo: batismo realizado após o culto. Edite este texto.",
    pasta: "assets/batismos/2026-11-15/",
    fotos: [],   // ex.: ["foto1.jpg", "foto2.jpg"]
    videos: []   // ex.: ["video1.mp4", "https://youtu.be/XXXXXXXXXXX"]
  }
];

/* ---------- EVENTOS · OUTROS ----------
   Pasta: assets/eventos/<pasta>/   (ex.: assets/eventos/congresso-2026/) */
const EVENTOS = [
  {
    nome: "Nome do evento (exemplo)",
    data: "2026-12-20",
    descricao: "Descrição do evento. Edite este texto.",
    pasta: "assets/eventos/exemplo/",
    fotos: [],
    videos: []
  }
];

/* ---------- CULTOS ----------
   O site cria sozinho todos os DOMINGOS de 2026 a 2030.
   Você só precisa registrar aqui o que tem de foto/vídeo em cada domingo.
   Chave = data do culto (AAAA-MM-DD).
   Pasta automática: assets/cultos/AAAA/MM/AAAA-MM-DD/

   Exemplo:
   "2026-11-15": {
     titulo: "Culto de Celebração",        // opcional
     fotos:  ["foto1.jpg", "foto2.jpg"],
     videos: ["video1.mp4", "https://youtu.be/XXXXXXXXXXX"]
   },
*/
const CULTOS_ANOS = [2026, 2027, 2028, 2029, 2030];

const CULTOS = {
  // "2026-11-15": { titulo: "Culto de Celebração", fotos: [], videos: [] },
};

/* ---------- EQUIPE DE MÍDIA ----------
   Pasta das fotos: assets/midia/ */
const MIDIA = [
  { nome: "Gláuber Ribeiro",      funcao: "Líder da Mídia · Criador do site", foto: "/ieqcampinasdosul/assets/midia/glauber.jpeg" },
  { nome: "Yasmin Voloski", funcao: "Secretária da Equipe de Mídia",    foto: "/ieqcampinasdosul/assets/midia/yasmin.jpeg" },
  { nome: "Laís Bampi", funcao: "Mídia · Fotos e vídeos",           foto: "/ieqcampinasdosul/assets/midia/lais.jpeg" },
  { nome: "Rosceli Ribeiro", funcao: "Mídia · Fotos e vídeos",           foto: "/ieqcampinasdosul/assets/midia/rosceli.jpeg" }
];
