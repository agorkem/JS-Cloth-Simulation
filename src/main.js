import Cloth from './cloth';
import Stats from 'stats.js';
import datgui from 'dat-gui';
import './style/style.scss';

let stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);
document.body.appendChild(stats.domElement);

let sideLength = 30,
    nodeDistance = 15,
    x = (canvas.width - sideLength * nodeDistance) / 2,
    y = (canvas.height - sideLength * nodeDistance) / 2 - 100;

let cloths = new Cloth(canvas, x, y, 30, 15);

function stickToTop() {
  cloths.fixNode(0);
  cloths.fixNode(14);
  cloths.fixNode(29);
}

stickToTop();

cloths.beforeRender = () => stats.begin();
cloths.afterRender = () => stats.end();

let gui = new datgui.GUI();
gui.add(cloths, 'gravity').min(0).max(1).step(0.1).name('Gravity');
gui.add(cloths, 'accuracy').min(2).max(10).step(1).name('Speed');
gui.add(cloths, 'friction').min(0).max(1).step(0.01).name('Friction');
gui.add(cloths, 'colorRange')
  .min(0).max(360).step(0.01)
  .name('Color Range')
  .onChange(function() {
    cloths.reset();
    stickToTop();
  });
