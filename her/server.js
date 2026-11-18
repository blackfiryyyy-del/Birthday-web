// Zero-dependency backend: serves /public and a wish-wall API. Run: node server.js
const http=require('http'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000,PUB=path.join(__dirname,'public'),DB=path.join(__dirname,'data','wishes.json');
const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp3':'audio/mpeg','.ogg':'audio/ogg','.svg':'image/svg+xml'};
const read=()=>{try{return JSON.parse(fs.readFileSync(DB,'utf8'))}catch{return[]}};
http.createServer((req,res)=>{
  const url=req.url.split('?')[0];
  if(url==='/api/wishes'&&req.method==='GET'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(read()))}
  if(url==='/api/wishes'&&req.method==='POST'){let b='';req.on('data',d=>{b+=d;if(b.length>5e3)req.destroy()});
    req.on('end',()=>{try{const j=JSON.parse(b),name=String(j.name||'Friend').slice(0,40),text=String(j.text||'').slice(0,400);
      if(!text.trim()){res.statusCode=400;return res.end('{"error":"empty"}')}
      const all=read();all.push({name,text,at:new Date().toISOString()});fs.writeFileSync(DB,JSON.stringify(all.slice(-200),null,1));
      res.setHeader('Content-Type','application/json');res.end('{"ok":true}')}catch{res.statusCode=400;res.end('{"error":"bad"}')}});return}
  let f=path.normalize(path.join(PUB,url==='/'?'index.html':url));
  if(!f.startsWith(PUB)){res.statusCode=403;return res.end()}
  fs.readFile(f,(e,d)=>{if(e){res.statusCode=404;return res.end('Not found')}res.setHeader('Content-Type',T[path.extname(f)]||'application/octet-stream');res.end(d)});
}).listen(PORT,()=>console.log('🎂 http://localhost:'+PORT));
