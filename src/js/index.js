import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express(), server=http.createServer(app), io=new Server(server,{cors:{origin:'*'}});
app.use(express.static(path.join(__dirname,'../client')));
const rooms=new Map(), MAX=4;
const code=()=>{const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from({length:5},()=>c[Math.floor(Math.random()*c.length)]).join('')};
function newRoom(){let c=code();while(rooms.has(c))c=code();rooms.set(c,{players:new Map(),bots:new Map()});return c}
function bots(room){const need=Math.max(0,MAX-room.players.size);const names=['Scout','Nova','Echo','Rex'];while(room.bots.size<need){const i=room.bots.size;room.bots.set(`bot_${i+1}`,{id:`bot_${i+1}`,name:names[i],x:(Math.random()-.5)*18,z:(Math.random()-.5)*18})}while(room.bots.size>need)room.bots.delete([...room.bots.keys()].pop())}
function state(c){const r=rooms.get(c);if(r)io.to(c).emit('roomState',{players:[...r.players.values()],bots:[...r.bots.values()]})}
io.on('connection',s=>{
 s.on('createRoom',({name='Player'}={},cb)=>{const c=newRoom(),r=rooms.get(c);r.players.set(s.id,{id:s.id,name:String(name).slice(0,16),x:0,z:5,rot:0});s.join(c);s.data.room=c;bots(r);cb?.({ok:true,roomCode:c,self:s.id});state(c)});
 s.on('joinRoom',({roomCode,name='Player'}={},cb)=>{const c=String(roomCode||'').toUpperCase(),r=rooms.get(c);if(!r)return cb?.({ok:false,error:'Room not found.'});if(r.players.size>=MAX)return cb?.({ok:false,error:'Room is full.'});r.players.set(s.id,{id:s.id,name:String(name).slice(0,16),x:0,z:5,rot:0});s.join(c);s.data.room=c;bots(r);cb?.({ok:true,roomCode:c,self:s.id});state(c)});
 s.on('state',d=>{const r=rooms.get(s.data.room),p=r?.players.get(s.id);if(!p)return;p.x=Number(d.x)||0;p.z=Number(d.z)||0;p.rot=Number(d.rot)||0;s.to(s.data.room).emit('playerState',p)});
 s.on('disconnect',()=>{const c=s.data.room,r=rooms.get(c);if(!r)return;r.players.delete(s.id);bots(r);if(!r.players.size)rooms.delete(c);else state(c)})
});
setInterval(()=>{for(const [c,r] of rooms){const lead=[...r.players.values()][0];for(const b of r.bots.values()){if(lead){b.x+=(lead.x+Math.sin(Date.now()/1400+b.id.length)*3-b.x)*.018;b.z+=(lead.z+Math.cos(Date.now()/1700+b.id.length)*3-b.z)*.018}}io.to(c).emit('botState',[...r.bots.values()])}},80);
app.get('/health',(_,res)=>res.json({ok:true,service:'island-zero'}));
const PORT=process.env.PORT||3000;server.listen(PORT,()=>console.log(`Island Zero listening on ${PORT}`));
