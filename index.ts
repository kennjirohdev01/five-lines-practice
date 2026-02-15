
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum rawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

interface FallingState{
  isFalling():boolean;
  moveHorizontal(tile:Tile,dx:number):void;
}

class Falling implements FallingState{
  isFalling(){ return true; }
  moveHorizontal(tile:Tile,dx:number){}
}
class Resting implements FallingState{
  isFalling(){ return false; }
  moveHorizontal(tile:Tile,dx:number){
    if (map[playery][playerx + dx + dx].isAir()
    && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = tile;
      moveToTile(playerx + dx, playery);
    }
  }
}

class FallStrategy{
  
  constructor(private falling :FallingState){

  }
  update(tile:Tile,x:number,y:number){
    if (map[y + 1][x].isAir()) {
      this.falling = new Falling();
      map[y + 1][x] = tile;
      map[y][x] = new Air;
    } else if (this.falling.isFalling()) {
      this.falling = new Resting();
    }
  }
  getFalling(){return this.falling;}
}

interface Tile{
  isAir():boolean;
  isLock1():boolean;
  isLock2():boolean;

  color(g: CanvasRenderingContext2D) : void;
  draw(g:CanvasRenderingContext2D,x:number,y:number): void;
  moveHorizontal(dx: number):void;
  moveVertical(dy:number):void;
  update(x:number,y:number):void;
}
class Air implements Tile{
  isAir(){ return true;}
  isPlayer(){ return false;}
  isLock1(){ return false;}
  isLock2(){ return false;}
  
  color(g:CanvasRenderingContext2D){}
  draw(g : CanvasRenderingContext2D,x:number,y:number){}
  moveHorizontal(dx: number){
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
     moveToTile(playerx, playery + dy);
  }
  update(x:number,y:number){};
}

class Flux implements Tile{
  isAir(){ return false;}
  isPlayer(){ return false;}
  isLock1(){ return false;}
  isLock2(){ return false;}
  color(g:CanvasRenderingContext2D){
    g.fillStyle = "#ccffcc";
  }
  draw(g:CanvasRenderingContext2D,x:number,y:number){
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  isEdible(){return true;}
  isPushable(){return false;}
  moveHorizontal(dx: number){
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
     moveToTile(playerx, playery + dy);
  }
  update(x:number,y:number){};
}
class Unbreakable implements Tile{
  isAir(){ return false;}  isPlayer(){ return false;}
  isLock1(){ return false;}
  isLock2(){ return false;}
  
  color(g:CanvasRenderingContext2D){
    g.fillStyle = "#999999";
  }
  draw(g : CanvasRenderingContext2D,x:number,y:number){
  g.fillStyle = "#999999";
  g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number){}
  moveVertical(dy: number): void {}
  update(x:number,y:number){};
}
class Player implements Tile{
  isAir(){ return false;}
  isPlayer(){ return true;}
  isLock1(){ return false;}
  isLock2(){ return false;}
  color(g:CanvasRenderingContext2D){}
  draw(g : CanvasRenderingContext2D,x:number,y:number){}
  moveHorizontal(dx: number){}
  moveVertical(dy: number): void {}
  update(x:number,y:number){};
}
class Stone implements Tile{
  private fallstrategy:FallStrategy
  constructor(falling:FallingState){
    this.fallstrategy = new FallStrategy(falling);
  }
  isAir(){ return false;}
  isPlayer(){ return false;}
  isLock1(){ return false;}
  isLock2(){ return false;}
  color(g:CanvasRenderingContext2D){
    g.fillStyle = "#0000cc";
  }
  draw(g : CanvasRenderingContext2D,x:number,y:number){
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number){
    this.fallstrategy.getFalling().moveHorizontal(this,dx);
  }
  moveVertical(dy: number): void {}
  update(x:number,y:number){
    this.fallstrategy.update(this,x,y);
  }
};

class Box implements Tile{
  private fallstrategy:FallStrategy
  constructor(
    falling:FallingState
  ){
    this.fallstrategy = new FallStrategy(falling);
  }
  isAir(){ return false;}
  isPlayer(){ return false;}
  isLock1(){ return false;}
  isLock2(){ return false;}
  color(g:CanvasRenderingContext2D){
    g.fillStyle = "#8b4513";
  }
  draw(g : CanvasRenderingContext2D,x:number,y:number){
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number){
    this.fallstrategy.getFalling().moveHorizontal(this,dx);
  }
  moveVertical(dy: number): void {}
  update(x:number,y:number){
    this.fallstrategy.update(this,x,y);
  }
}
class Key1 implements Tile{
  isAir(){ return false;}
  isPlayer(){ return false;}
  isLock1(){ return false;}
  isLock2(){ return false;}
  color(g:CanvasRenderingContext2D){
    g.fillStyle = "#ffcc00";
  }
  draw(g : CanvasRenderingContext2D,x:number,y:number){
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number){
    removeLock1();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number){
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
  update(x:number,y:number){};
}
class Key2 implements Tile{
  isAir(){ return false;}
  isPlayer(){ return false;}
  isLock1(){ return false;}
  isLock2(){ return false;}
  color(g:CanvasRenderingContext2D){
    g.fillStyle = "#00ccff";
  }
  draw(g : CanvasRenderingContext2D,x:number,y:number){
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number){
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number): void {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
  update(x:number,y:number){};
}
class Lock1 implements Tile{
  isAir(){ return false;}
  isPlayer(){ return false;}
  isLock1(){ return true;}
  isLock2(){ return false;}
  color(g:CanvasRenderingContext2D){
    g.fillStyle = "#ffcc00";
  }
  draw(g : CanvasRenderingContext2D,x:number,y:number){
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number){}
  moveVertical(dx:number){}
  update(x:number,y:number){};
}
class Lock2 implements Tile{
  isAir(){ return false;}
  isPlayer(){ return false;}
  isLock1(){ return false;}
  isLock2(){ return true;}
  color(g:CanvasRenderingContext2D){
    g.fillStyle = "#00ccff";
  }
  draw(g : CanvasRenderingContext2D,x:number,y:number){
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number){}
  moveVertical(dx:number){}
  update(x:number,y:number){};
}
interface Input{
  handle():void;
}

class Right implements Input{
  handle(){
      moveHorizontal(1);
  }
}
class Left implements Input{
  handle(){
      moveHorizontal(-1);
}
}
class Up implements Input{
  handle(){
      moveVertical(-1);
  }
}
class Down implements Input{
  handle(){
      moveVertical(1);
  }
}

let playerx = 1;
let playery = 1;
let rawmap: rawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map :Tile[][];
function assertExhausted(x:never):never{
  throw new Error("Unexpected object:" + x);
}
function transformTile(tile:rawTile){
  switch(tile){
    case rawTile.AIR:return new Air;
    case rawTile.FLUX :return new Flux;
    case rawTile.UNBREAKABLE: return new Unbreakable;
    case rawTile.PLAYER: return new Player;
    case rawTile.STONE: return new Stone(new Resting);
    case rawTile.FALLING_STONE: return new Stone(new Falling);
    case rawTile.BOX: return new Box(new Resting);
    case rawTile.FALLING_BOX: return new Box(new Falling);
    case rawTile.KEY1: return new Key1;
    case rawTile.LOCK1: return new Lock1;
    case rawTile.KEY2: return new Key2;
    case rawTile.LOCK2: return new Lock2;
    default: assertExhausted(tile); // 列挙型をすべて条件に入れているかを確認するための関数
    }
}

function transformMap(){
  map = new Array(rawmap.length);
  for(let y = 0 ;y < rawmap.length;y++){
    map[y] = new Array(rawmap[y].length);
    for(let x = 0;x < rawmap[y].length;x++){
      map[y][x]=transformTile(rawmap[y][x]);
    }
  }
}

let inputs: Input[] = [];

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air;
      }
    }
  }
}

function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air;
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] =  new Air;
  map[newy][newx] = new Player;
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  map[playery][playerx + dx].moveHorizontal(dx);
}

function moveVertical(dy: number) {
  map[playery + dy][playerx].moveVertical(dy);
}

function update() {
  handleInputs();
  updateMap();
}
function handleInputs(){
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle();
  }
}

function updateMap(){
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
        updateTile(x,y);
    }
  }
}

function updateTile(x:number,y:number){
  map[y][x].update(x,y);
}

function createGraphics(){
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");
  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function drawMap(g : CanvasRenderingContext2D){
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g,x,y);
    }
  }
}

function drawPlayer(g : CanvasRenderingContext2D){
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  transformMap();
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") { inputs.push(new Left); e.preventDefault(); }
  else if (e.key === UP_KEY || e.key === "w") { inputs.push(new Up); e.preventDefault(); }
  else if (e.key === RIGHT_KEY || e.key === "d") { inputs.push(new Right); e.preventDefault(); }
  else if (e.key === DOWN_KEY || e.key === "s") { inputs.push(new Down); e.preventDefault(); }
});
