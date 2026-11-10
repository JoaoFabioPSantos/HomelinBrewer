const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Limpando o banco de dados (Homebrews, Logs, Usuários e Sistemas)...');

  // Limpa na ordem correta para respeitar as chaves estrangeiras
  await prisma.logAuditoria.deleteMany();
  await prisma.homebrew.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.sistemaRPG.deleteMany();

  console.log('🎲 Criando 5 Sistemas de RPG...');
  const sistemas = await Promise.all([
    prisma.sistemaRPG.create({ data: { nome: 'D&D 5e', editora: 'Wizards of the Coast' } }),
    prisma.sistemaRPG.create({ data: { nome: 'Tormenta20', editora: 'Jambô Editora' } }),
    prisma.sistemaRPG.create({ data: { nome: 'Pathfinder 2e', editora: 'Paizo' } }),
    prisma.sistemaRPG.create({ data: { nome: 'Call of Cthulhu', editora: 'Chaosium' } }),
    prisma.sistemaRPG.create({ data: { nome: 'Savage Worlds', editora: 'Pinnacle Entertainment' } }),
  ]);

  console.log('👥 Criando Autores...');
  const autores = await Promise.all([
    prisma.usuario.create({ data: { nome: 'João Desenvolvedor', email: 'joao@email.com' } }),
    prisma.usuario.create({ data: { nome: 'Mestre Caverna', email: 'mestre@email.com' } }),
    prisma.usuario.create({ data: { nome: 'Elfo das Trevas', email: 'elfo@email.com' } }),
  ]);

  console.log('📚 Gerando 300 Homebrews distribuídas...');
  
  const tipos = ['Magia', 'Raça', 'Classe', 'Item Mágico', 'Talento'];
  const adjetivos = ['Sombrio', 'Celestial', 'Ancestral', 'Lendário', 'Profano', 'Etéreo', 'Dracônico', 'Carmesim', 'Estelar', 'Abissal'];
  const substantivos = ['Fogo', 'Lâmina', 'Escudo', 'Manto', 'Grimório', 'Anel', 'Amuleto', 'Sopro', 'Eco', 'Vórtice'];

  const batchHomebrews = [];

  for (let i = 1; i <= 300; i++) {
    const adj = adjetivos[Math.floor(Math.random() * adjetivos.length)];
    const subs = substantivos[Math.floor(Math.random() * substantivos.length)];
    const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
    const sistemaAleatorio = sistemas[Math.floor(Math.random() * sistemas.length)];
    const autorAleatorio = autores[Math.floor(Math.random() * autores.length)];

    batchHomebrews.push({
      titulo: `${tipoAleatorio} ${adj} ${subs} #${i}`,
      tipo: tipoAleatorio,
      conteudo: `Descrição balanceada e detalhada para a homebrew ${i}, focada em enriquecer a mecânica de jogo da mesa.`,
      sistemaId: sistemaAleatorio.id,
      autorId: autorAleatorio.id
    });
  }

  // Inserção em lote para máxima performance
  await prisma.homebrew.createMany({
    data: batchHomebrews
  });

  console.log('📜 Gerando 45 Logs de Auditoria simulados...');
  const acoes = ['CREATE', 'UPDATE', 'DELETE'];
  const batchLogs = [];

  for (let i = 1; i <= 45; i++) {
    const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];
    
    batchLogs.push({
      acao: acaoAleatoria,
      entidade: 'Homebrew',
      registroId: Math.floor(Math.random() * 300) + 1,
      detalhes: JSON.stringify({
        origem: "Seed Automático",
        mensagem: `Log gerado automaticamente na carga inicial número ${i}`,
        timestampExecucao: new Date().toISOString()
      }),
      // Espalha a data dos logs retroativamente para testar ordenação
      createdAt: new Date(Date.now() - i * 1000 * 60 * 15) 
    });
  }

  await prisma.logAuditoria.createMany({
    data: batchLogs
  });

  console.log('✅ Banco populado com sucesso: 300 Homebrews e 45 Logs registrados!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular o banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });