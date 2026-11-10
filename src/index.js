const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static('public'));

// Função auxiliar para gravar logs de auditoria
async function registrarLog(acao, entidade, registroId, dados) {
  try {
    await prisma.logAuditoria.create({
      data: {
        acao,
        entidade,
        registroId: registroId ? Number(registroId) : null,
        detalhes: JSON.stringify(dados)
      }
    });
  } catch (err) {
    console.error("Erro ao gravar log de auditoria:", err);
  }
}

// Listar Autores
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// Listar Sistemas
app.get('/sistemas', async (req, res) => {
  try {
    const sistemas = await prisma.sistemaRPG.findMany();
    res.json(sistemas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar sistemas' });
  }
});

// READ: Listar Logs de Auditoria com paginação blindada (Mais novos primeiro)
app.get('/logs', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      prisma.logAuditoria.findMany({
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: Number(limit)
      }),
      prisma.logAuditoria.count()
    ]);

    res.json({
      data: logs || [],
      meta: {
        total: total || 0,
        hasMore: skip + (logs ? logs.length : 0) < total
      }
    });
  } catch (error) {
    console.error("Erro na rota /logs:", error);
    res.status(500).json({ data: [], meta: { total: 0, hasMore: false }, error: 'Erro ao buscar logs' });
  }
});

// READ Otimizado: Busca com Paginação, Filtro por Sistema, por Autor e por Título
app.get('/homebrews', async (req, res) => {
  try {
    const { search, sistemaId, autorId, page = 1, limit = 4 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = {};

    if (search) {
      where.titulo = { contains: search, mode: 'insensitive' };
    }
    if (sistemaId && sistemaId !== 'todos') {
      where.sistemaId = Number(sistemaId);
    }
    if (autorId && autorId !== 'todos') {
      where.autorId = Number(autorId);
    }

    const [homebrews, total] = await Promise.all([
      prisma.homebrew.findMany({
        where,
        include: { autor: true, sistema: true },
        skip: skip,
        take: Number(limit),
        orderBy: { id: 'desc' }
      }),
      prisma.homebrew.count({ where })
    ]);

    res.json({
      data: homebrews || [],
      meta: {
        total: total || 0,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)) || 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar homebrews', details: error.message });
  }
});

// CREATE Homebrew + Log de Auditoria
app.post('/homebrews', async (req, res) => {
  try {
    const { titulo, tipo, conteudo, sistemaId, autorId } = req.body;
    
    const novo = await prisma.homebrew.create({
      data: {
        titulo,
        tipo,
        conteudo,
        sistemaId: Number(sistemaId),
        autorId: Number(autorId)
      },
      include: { autor: true, sistema: true }
    });

    await registrarLog('CREATE', 'Homebrew', novo.id, req.body);

    res.status(201).json(novo);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar', details: error.message });
  }
});

// UPDATE Homebrew + Log de Auditoria
app.put('/homebrews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, tipo, conteudo, sistemaId, autorId } = req.body;

    const homebrewAtualizado = await prisma.homebrew.update({
      where: { id: Number(id) },
      data: {
        titulo,
        tipo,
        conteudo,
        sistemaId: Number(sistemaId),
        autorId: Number(autorId)
      },
      include: { autor: true, sistema: true }
    });

    await registrarLog('UPDATE', 'Homebrew', id, req.body);

    res.json({ mensagem: "Atualizado com sucesso!", homebrewAtualizado });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar homebrew', details: error.message });
  }
});

// DELETE Homebrew + Log de Auditoria
app.delete('/homebrews/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const homebrewParaApagar = await prisma.homebrew.findUnique({
      where: { id: Number(id) },
      include: { autor: true, sistema: true }
    });

    await prisma.homebrew.delete({ where: { id: Number(id) } });

    await registrarLog('DELETE', 'Homebrew', id, {
      mensagem: "Homebrew apagada do sistema",
      registroDeletado: homebrewParaApagar
    });

    res.json({ mensagem: 'Deletado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});