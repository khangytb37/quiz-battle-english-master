

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');
const path = require('path');
const QRCode = require('qrcode');
const QUIZ_DATA = require('./questions');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

app.get('/api/server-info', (req, res) => {
  const ips = getLocalIPs();
  res.json({
    port: PORT,
    lanIp: ips[0] || null,
    allIps: ips
  });
});

app.get('/api/qrcode', async (req, res) => {
  const text = req.query.text;
  if (!text) return res.status(400).json({ error: 'Missing text parameter' });
  try {
    const dataUrl = await QRCode.toDataURL(String(text), {
      width: 240,
      margin: 2,
      color: {
        dark: '#00f0ff',
        light: '#0a0a1a'
      }
    });
    res.json({ dataUrl });
  } catch (err) {
    res.status(500).json({ error: 'QR generation failed' });
  }
});

const rooms = new Map();

const CATEGORY_MAP = {
  All: ['Grammar', 'Vocabulary', 'Phonetics', 'Synonym', 'Reading'],
  Grammar: ['Grammar', 'Vocabulary'],
  Phonetics: ['Phonetics'],
  Synonym: ['Synonym'],
  Reading: ['Reading']
};

const BOT_PROFILES = [
  { name: 'CyberFox_AI', avatar: '🦊', accuracy: 0.78, minMs: 2200, maxMs: 9500 },
  { name: 'NeonDragon', avatar: '🐉', accuracy: 0.85, minMs: 1800, maxMs: 8500 },
  { name: 'QuantumOwl', avatar: '🦉', accuracy: 0.72, minMs: 3200, maxMs: 12000 },
  { name: 'ViperBot_99', avatar: '🐺', accuracy: 0.65, minMs: 2600, maxMs: 11000 },
  { name: 'AlphaLion', avatar: '🦁', accuracy: 0.80, minMs: 2500, maxMs: 10000 },
  { name: 'ApexShark', avatar: '🦈', accuracy: 0.68, minMs: 3000, maxMs: 13500 }
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRoomCode() {
  let code;
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
  } while (rooms.has(code));
  return code;
}

function buildQuestionSet({ questionCount, source, category, customQuestions }) {
  const targetCount = [5, 10, 15, 20].includes(Number(questionCount)) ? Number(questionCount) : 10;

  if (source === 'custom' && Array.isArray(customQuestions) && customQuestions.length > 0) {
    const sanitized = customQuestions
      .filter(q => q && q.question && Array.isArray(q.options) && q.options.length === 4)
      .map((q, idx) => ({
        id: q.id || idx + 1,
        category: q.category || 'Custom',
        question: String(q.question).trim(),
        options: q.options.map(o => String(o).trim()),
        answerIndex: Number(q.answerIndex) >= 0 && Number(q.answerIndex) <= 3 ? Number(q.answerIndex) : 0,
        explanation: String(q.explanation || 'Không có giải thích bổ sung.').trim(),
        timeLimit: 30
      }));
    if (sanitized.length > 0) {
      return shuffleArray(sanitized).slice(0, Math.min(targetCount, sanitized.length));
    }
  }

  const allowedCats = CATEGORY_MAP[category] || CATEGORY_MAP.All;
  let pool = QUIZ_DATA.filter(q => allowedCats.includes(q.category));
  if (pool.length < targetCount) {
    const extras = QUIZ_DATA.filter(q => !allowedCats.includes(q.category));
    pool = [...pool, ...shuffleArray(extras)];
  }
  return shuffleArray(pool).slice(0, Math.min(targetCount, pool.length)).map(q => ({
    ...q,
    timeLimit: 30
  }));
}

function sortRankings(players) {
  return [...players]
    .sort((a, b) => {
      if (b.correctCount !== a.correctCount) {
        return b.correctCount - a.correctCount;
      }
      return a.totalResponseTimeMs - b.totalResponseTimeMs;
    })
    .map((p, index) => ({
      rank: index + 1,
      id: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      isHost: p.isHost,
      isBot: p.isBot,
      correctCount: p.correctCount,
      totalResponseTimeMs: Math.round(p.totalResponseTimeMs)
    }));
}

function sanitizeRoomState(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    status: room.status,
    source: room.source,
    category: room.category,
    questionCount: room.questions.length,
    currentQuestionIndex: room.currentQuestionIndex,
    players: room.players.map(p => ({
      id: p.id,
      nickname: p.nickname,
      avatar: p.avatar,
      isHost: p.isHost,
      isBot: p.isBot,
      correctCount: p.correctCount,
      totalResponseTimeMs: Math.round(p.totalResponseTimeMs)
    }))
  };
}

function clearRoomTimers(room) {
  if (room.roundTimer) {
    clearTimeout(room.roundTimer);
    room.roundTimer = null;
  }
  if (room.advanceTimer) {
    clearTimeout(room.advanceTimer);
    room.advanceTimer = null;
  }
  if (room.botTimers && room.botTimers.length > 0) {
    room.botTimers.forEach(t => clearTimeout(t));
    room.botTimers = [];
  }
}

function startQuestionRound(room) {
  clearRoomTimers(room);

  if (room.currentQuestionIndex >= room.questions.length) {
    finishMatch(room);
    return;
  }

  const q = room.questions[room.currentQuestionIndex];
  room.answeredPlayerIds = new Set();
  room.questionStartAt = Date.now();

  io.to(room.code).emit('room-question', {
    index: room.currentQuestionIndex,
    total: room.questions.length,
    question: {
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options,
      timeLimit: 30
    },
    answeredCount: 0,
    totalPlayers: room.players.length
  });

  
  room.players.filter(p => p.isBot).forEach(bot => {
    const profile = bot.botProfile || BOT_PROFILES[0];
    const delay = profile.minMs + Math.random() * (profile.maxMs - profile.minMs);
    const timer = setTimeout(() => {
      if (!rooms.has(room.code) || room.status !== 'playing') return;
      if (room.answeredPlayerIds.has(bot.id)) return;

      const isCorrect = Math.random() < profile.accuracy;
      room.answeredPlayerIds.add(bot.id);
      if (isCorrect) {
        bot.correctCount += 1;
      }
      bot.totalResponseTimeMs += Math.round(delay);

      io.to(room.code).emit('player-answered', {
        playerId: bot.id,
        answeredCount: room.answeredPlayerIds.size,
        totalPlayers: room.players.length,
        standings: sortRankings(room.players)
      });

      checkRoundCompletion(room);
    }, delay);
    room.botTimers.push(timer);
  });

  
  room.roundTimer = setTimeout(() => {
    if (!rooms.has(room.code) || room.status !== 'playing') return;
    concludeRound(room);
  }, 30500);
}

function checkRoundCompletion(room) {
  if (room.answeredPlayerIds.size >= room.players.length) {
    concludeRound(room);
  }
}

function concludeRound(room) {
  clearRoomTimers(room);
  const q = room.questions[room.currentQuestionIndex];

  
  room.players.forEach(p => {
    if (!room.answeredPlayerIds.has(p.id)) {
      p.totalResponseTimeMs += 30000;
      if (!p.isBot) {
        io.to(p.id).emit('round-timeout', {
          questionIndex: room.currentQuestionIndex,
          correctIndex: q.answerIndex,
          explanation: q.explanation
        });
      }
    }
  });

  io.to(room.code).emit('round-ended', {
    questionIndex: room.currentQuestionIndex,
    correctIndex: q.answerIndex,
    explanation: q.explanation,
    standings: sortRankings(room.players)
  });

  room.advanceTimer = setTimeout(() => {
    if (!rooms.has(room.code) || room.status !== 'playing') return;
    room.currentQuestionIndex += 1;
    startQuestionRound(room);
  }, 2400);
}

function finishMatch(room) {
  clearRoomTimers(room);
  room.status = 'finished';
  const rankings = sortRankings(room.players);

  io.to(room.code).emit('match-finished', {
    roomCode: room.code,
    totalQuestions: room.questions.length,
    rankings
  });
}

io.on('connection', (socket) => {
  socket.on('create-room', (payload = {}, ack) => {
    const code = generateRoomCode();
    const nickname = String(payload.nickname || 'Host').trim().slice(0, 15) || 'Host';
    const avatar = payload.avatar || '🦊';
    const questions = buildQuestionSet(payload);

    const hostPlayer = {
      id: socket.id,
      nickname,
      avatar,
      isHost: true,
      isBot: false,
      correctCount: 0,
      totalResponseTimeMs: 0
    };

    const room = {
      code,
      hostId: socket.id,
      status: 'waiting',
      source: payload.source || 'system',
      category: payload.category || 'All',
      rawConfig: {
        questionCount: payload.questionCount || 10,
        source: payload.source || 'system',
        category: payload.category || 'All',
        customQuestions: payload.customQuestions || []
      },
      questions,
      currentQuestionIndex: 0,
      players: [hostPlayer],
      answeredPlayerIds: new Set(),
      roundTimer: null,
      advanceTimer: null,
      botTimers: []
    };

    rooms.set(code, room);
    socket.join(code);
    socket.data.roomCode = code;

    const state = sanitizeRoomState(room);
    if (typeof ack === 'function') ack({ ok: true, room: state, playerId: socket.id });
    io.to(code).emit('room-updated', state);
  });

  socket.on('join-room', (payload = {}, ack) => {
    const code = String(payload.roomCode || '').trim();
    const room = rooms.get(code);

    if (!room) {
      if (typeof ack === 'function') ack({ ok: false, error: 'Không tìm thấy phòng với mã ' + code });
      return;
    }
    if (room.status !== 'waiting') {
      if (typeof ack === 'function') ack({ ok: false, error: 'Trận đấu trong phòng này đã bắt đầu!' });
      return;
    }
    if (room.players.length >= 20) {
      if (typeof ack === 'function') ack({ ok: false, error: 'Phòng đã đầy (tối đa 20 người chơi)!' });
      return;
    }

    let nickname = String(payload.nickname || 'Player').trim().slice(0, 15) || 'Player';
    if (room.players.some(p => p.nickname.toLowerCase() === nickname.toLowerCase())) {
      nickname = `${nickname.slice(0, 11)}_${Math.floor(10 + Math.random() * 89)}`;
    }

    const player = {
      id: socket.id,
      nickname,
      avatar: payload.avatar || '🐉',
      isHost: false,
      isBot: false,
      correctCount: 0,
      totalResponseTimeMs: 0
    };

    room.players.push(player);
    socket.join(code);
    socket.data.roomCode = code;

    const state = sanitizeRoomState(room);
    if (typeof ack === 'function') ack({ ok: true, room: state, playerId: socket.id });
    io.to(code).emit('room-updated', state);
  });

  socket.on('add-bot', ({ roomCode } = {}, ack) => {
    const room = rooms.get(String(roomCode || ''));
    if (!room || room.hostId !== socket.id || room.status !== 'waiting') {
      if (typeof ack === 'function') ack({ ok: false });
      return;
    }
    if (room.players.length >= 16) {
      if (typeof ack === 'function') ack({ ok: false, error: 'Phòng đã đạt giới hạn bot!' });
      return;
    }

    const usedNames = new Set(room.players.map(p => p.nickname));
    const available = BOT_PROFILES.filter(b => !usedNames.has(b.name));
    const chosen = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : {
          name: `AI_Bot_${Math.floor(10 + Math.random() * 89)}`,
          avatar: '🤖',
          accuracy: 0.72,
          minMs: 2500,
          maxMs: 11000
        };

    room.players.push({
      id: `bot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      nickname: chosen.name,
      avatar: chosen.avatar,
      isHost: false,
      isBot: true,
      botProfile: chosen,
      correctCount: 0,
      totalResponseTimeMs: 0
    });

    const state = sanitizeRoomState(room);
    io.to(room.code).emit('room-updated', state);
    if (typeof ack === 'function') ack({ ok: true, room: state });
  });

  socket.on('remove-player', ({ roomCode, playerId } = {}) => {
    const room = rooms.get(String(roomCode || ''));
    if (!room || room.hostId !== socket.id || room.status !== 'waiting') return;
    if (playerId === socket.id) return;

    const target = room.players.find(p => p.id === playerId);
    if (!target) return;

    room.players = room.players.filter(p => p.id !== playerId);
    if (!target.isBot) {
      io.to(playerId).emit('kicked-from-room');
      const targetSocket = io.sockets.sockets.get(playerId);
      if (targetSocket) targetSocket.leave(room.code);
    }
    io.to(room.code).emit('room-updated', sanitizeRoomState(room));
  });

  socket.on('start-match', ({ roomCode } = {}, ack) => {
    const room = rooms.get(String(roomCode || ''));
    if (!room || room.hostId !== socket.id) {
      if (typeof ack === 'function') ack({ ok: false, error: 'Chỉ chủ phòng mới có thể bắt đầu!' });
      return;
    }
    if (room.players.length < 1) {
      if (typeof ack === 'function') ack({ ok: false, error: 'Cần ít nhất 1 người chơi!' });
      return;
    }

    room.status = 'playing';
    room.currentQuestionIndex = 0;
    room.players.forEach(p => {
      p.correctCount = 0;
      p.totalResponseTimeMs = 0;
    });

    io.to(room.code).emit('match-started', sanitizeRoomState(room));
    if (typeof ack === 'function') ack({ ok: true });

    setTimeout(() => {
      if (rooms.has(room.code) && room.status === 'playing') {
        startQuestionRound(room);
      }
    }, 1500);
  });

  socket.on('submit-answer', ({ roomCode, questionIndex, answerIndex, responseTimeMs } = {}) => {
    const room = rooms.get(String(roomCode || ''));
    if (!room || room.status !== 'playing') return;
    if (questionIndex !== room.currentQuestionIndex) return;
    if (room.answeredPlayerIds.has(socket.id)) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    const q = room.questions[room.currentQuestionIndex];
    const cleanMs = Math.min(30000, Math.max(50, Math.round(Number(responseTimeMs) || (Date.now() - room.questionStartAt))));
    const isCorrect = Number(answerIndex) === q.answerIndex;

    room.answeredPlayerIds.add(socket.id);
    if (isCorrect) {
      player.correctCount += 1;
    }
    player.totalResponseTimeMs += cleanMs;

    socket.emit('answer-ack', {
      questionIndex,
      isCorrect,
      correctIndex: q.answerIndex,
      explanation: q.explanation,
      responseTimeMs: cleanMs,
      correctCount: player.correctCount,
      totalResponseTimeMs: Math.round(player.totalResponseTimeMs)
    });

    io.to(room.code).emit('player-answered', {
      playerId: socket.id,
      answeredCount: room.answeredPlayerIds.size,
      totalPlayers: room.players.length,
      standings: sortRankings(room.players)
    });

    checkRoundCompletion(room);
  });

  socket.on('use-powerup', ({ roomCode, type } = {}, ack) => {
    const room = rooms.get(String(roomCode || ''));
    if (!room || room.status !== 'playing') {
      if (typeof ack === 'function') ack({ ok: false });
      return;
    }
    const q = room.questions[room.currentQuestionIndex];
    if (!q) {
      if (typeof ack === 'function') ack({ ok: false });
      return;
    }

    if (type === '5050') {
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.answerIndex);
      const eliminate = shuffleArray(wrongIndices).slice(0, 2);
      if (typeof ack === 'function') ack({ ok: true, eliminate });
    } else if (type === 'hint') {
      const letter = ['A', 'B', 'C', 'D'][q.answerIndex];
      const hintText = `Gợi ý: Hãy chú ý đáp án ${letter} hoặc cấu trúc (${q.category})!`;
      if (typeof ack === 'function') ack({ ok: true, hintText });
    } else {
      if (typeof ack === 'function') ack({ ok: true });
    }
  });

  socket.on('reset-room', ({ roomCode } = {}) => {
    const room = rooms.get(String(roomCode || ''));
    if (!room || room.hostId !== socket.id) return;

    clearRoomTimers(room);
    room.status = 'waiting';
    room.currentQuestionIndex = 0;
    room.questions = buildQuestionSet(room.rawConfig);
    room.players.forEach(p => {
      p.correctCount = 0;
      p.totalResponseTimeMs = 0;
    });

    io.to(room.code).emit('room-reset', sanitizeRoomState(room));
  });

  function handleDisconnectOrLeave() {
    const code = socket.data.roomCode;
    if (!code || !rooms.has(code)) return;

    const room = rooms.get(code);
    room.players = room.players.filter(p => p.id !== socket.id);
    socket.leave(code);
    socket.data.roomCode = null;

    const remainingHumans = room.players.filter(p => !p.isBot);
    if (remainingHumans.length === 0) {
      clearRoomTimers(room);
      rooms.delete(code);
      return;
    }

    if (room.hostId === socket.id) {
      remainingHumans[0].isHost = true;
      room.hostId = remainingHumans[0].id;
    }

    io.to(code).emit('room-updated', sanitizeRoomState(room));
  }

  socket.on('leave-room', handleDisconnectOrLeave);
  socket.on('disconnect', handleDisconnectOrLeave);
});

server.listen(PORT, () => {
  const ips = getLocalIPs();
  console.log(`\n⚔️  Quiz Battle: English Master Server running!`);
  console.log(`   Local:   http://localhost:${PORT}`);
  if (ips.length > 0) {
    console.log(`   Network: http://${ips[0]}:${PORT}  (Dùng link này để quét QR trên điện thoại!)`);
  }
});
