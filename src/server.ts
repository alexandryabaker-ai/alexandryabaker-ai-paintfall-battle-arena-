import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { WebSocketServer, WebSocket } from 'ws';

const publicDir = path.join(process.cwd(), 'public');
const rooms = new Map<string, any>();

const server = http.createServer((req, res) => {
  let pathname = (req.url || '/').split('?')[0];
  if (pathname === '/') pathname = '/index.html';
  const file = path.join(publicDir, pathname);
  if (!file.startsWith(publicDir)) return res.writeHead(403).end();
  fs.readFile(file, (err, data) => {
    if (err) return res.writeHead(404).end('Not found');
    const ext = path.extname(file);
    const types: Record<string, string> = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8'
    };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server });

function send(ws: WebSocket, data: unknown) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}

function broadcast(room: any, data: unknown) {
  for (const p of room.players.values()) send(p.ws, data);
}

function state(room: any) {
  return {
    type: 'state',
    players: [...room.players.values()].map((p: any) => ({
      id: p.id, name: p.name, x: p.x, y: p.y, hp: p.hp,
      color: p.color, alive: p.alive
    })),
    mode: room.mode, started: room.started, boss: room.boss
  };
}

function roomState(room: any) { broadcast(room, state(room)); }

function makeRoomCode() {
  let c: string;
  do c = Math.random().toString(36).slice(2, 6).toUpperCase();
  while (rooms.has(c));
  return c;
}

function resetRoom(room: any) {
  let i = 0;
  for (const p of room.players.values()) {
    p.x = 160 + (i % 4) * 180;
    p.y = 160 + Math.floor(i / 4) * 180;
    p.hp = 100;
    p.alive = true;
    i++;
  }
  room.started = true;
  room.boss = room.mode === 'zombies'
    ? { hp: 1000, x: 600, y: 350, fire: 0, lava: [] }
    : null;
  roomState(room);
}

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).slice(2, 9);

  ws.on('message', (raw) => {
    let m: any;
    try { m = JSON.parse(raw.toString()); } catch { return; }

    if (m.type === 'create') {
      const code = makeRoomCode();
      const room = { code, mode: m.mode || 'paintball', started: false, players: new Map(), boss: null };
      rooms.set(code, room);
      const p = {
        id, name: m.name || 'Player', x: 160, y: 160, hp: 100,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
        alive: true, ws
      };
      room.players.set(id, p);
      (ws as any).room = room;
      (ws as any).pid = id;
      send(ws, { type: 'joined', code, id });
      roomState(room);
    } else if (m.type === 'join') {
      const room = rooms.get((m.code || '').toUpperCase());
      if (!room || room.players.size >= 8) return send(ws, { type: 'error', message: 'Room unavailable' });
      const p = {
        id, name: m.name || 'Player',
        x: 160 + (room.players.size % 4) * 180,
        y: 160 + Math.floor(room.players.size / 4) * 180,
        hp: 100,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
        alive: true, ws
      };
      room.players.set(id, p);
      (ws as any).room = room;
      (ws as any).pid = id;
      send(ws, { type: 'joined', code: room.code, id });
      roomState(room);
    } else if (m.type === 'start' && (ws as any).room) {
      resetRoom((ws as any).room);
    } else if (m.type === 'move' && (ws as any).room) {
      const room = (ws as any).room;
      const p = room.players.get((ws as any).pid);
      if (!p || !p.alive) return;
      p.x = Math.max(30, Math.min(1170, Number(m.x) || p.x));
      p.y = Math.max(30, Math.min(670, Number(m.y) || p.y));
      roomState(room);
    } else if (m.type === 'shoot' && (ws as any).room) {
      const room = (ws as any).room;
      const shooter = room.players.get((ws as any).pid);
      if (!shooter || !shooter.alive) return;
      const hit = room.players.get(m.target);
      if (hit && hit.alive && hit.id !== shooter.id) {
        hit.hp -= m.damage || 20;
        if (hit.hp <= 0) { hit.hp = 0; hit.alive = false; }
        roomState(room);
      }
    } else if (m.type === 'bossHit' && (ws as any).room && (ws as any).room.boss) {
      const room = (ws as any).room;
      room.boss.hp = Math.max(0, room.boss.hp - (m.damage || 20));
      if (room.boss.hp === 0) room.boss.defeated = true;
      roomState(room);
    }
  });

  ws.on('close', () => {
    const room = (ws as any).room;
    if (room) {
      room.players.delete((ws as any).pid);
      if (!room.players.size) rooms.delete(room.code);
      else roomState(room);
    }
  });
});

export default server;
