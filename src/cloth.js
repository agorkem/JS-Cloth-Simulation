import {map} from './utils';

export default class Cloth {
  constructor(canvas, x, y, sideLength, nodeDistance) {
    if (typeof canvas === "string") {
      canvas = document.getElementById(canvas);
    }

    this.x = x;
    this.y = y;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.sideLength = sideLength;
    this.nodeDistance = nodeDistance;

    this.nodes = [];
    this.sticks = [];
    this.accuracy = 4;
    this.friction = 0.99;
    this.bounce = 0.5;
    this.gravity = 0.2;
    this.colorRange = 100;

    this.fabric();
    this.render();
  }

  colorGenerator(index) {
    let sourceMax = this.sideLength * this.sideLength;
    return 'hsla(' + map(index, 0, sourceMax, 0, this.colorRange) + ', 100%, 50%, 1)';
  }

  distance(firstNode, secondNode) {
    let distanceX = firstNode.x - secondNode.x;
    let distanceY = firstNode.y - secondNode.y;
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }

  reset() {
    this.nodes = [];
    this.sticks = [];
    this.fabric();
  }

  fabric() {
    for (let row = 0; row < this.sideLength; row++) {
      let y = row * this.nodeDistance + this.y;

      for (let col = 0; col < this.sideLength; col++) {
        let x = col * this.nodeDistance + this.x;

        this.addNode({
          x: x,
          y: y,
          color: this.colorGenerator(this.nodes.length),
        });

        if (col) {
          let first = this.nodes[this.nodes.length - 2];
          let second = this.nodes[this.nodes.length - 1];

          this.addStick({
            firstNode: first,
            secondNode: second,
            length: this.distance(first, second)
          });
        }

        if (row) {
          let first = this.nodes[this.nodes.length - this.sideLength - 1];
          let second = this.nodes[this.nodes.length - 1];

          this.addStick({
            firstNode: first,
            secondNode: second,
            length: this.distance(first, second)
          });
        }
      }
    }
  }

  addNode(node) {
    return this.nodes.push({
      x: node.x,
      y: node.y,
      oldx: node.oldx || node.x,
      oldy: node.oldy || node.y,
      fixed: node.fixed || false,
      color: node.color
    }) - 1;
  }

  addStick(stick) {
    return this.sticks.push({
      firstNode: stick.firstNode,
      secondNode: stick.secondNode,
      length: stick.length
    }) - 1;
  }

  fixNode(index) {
    let node = this.nodes[index];
    if (node) {
      node.fixed = true;
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  render() {
    this.beforeRender && this.beforeRender();

    let i = this.accuracy;
    while (--i) {
      this.updateSticks();
      this.updateNodes();
    }

    this.clear();
    this.renderNodes();
    this.renderSticks();

    this.afterRender && this.afterRender();

    window.requestAnimationFrame(this.render.bind(this));
  }

  updateNodes() {
    for (let i = 0, len = this.nodes.length; i < len; i++) {
      let node = this.nodes[i];

      if (!node.fixed) {
        let vx = (node.x - node.oldx) * this.friction;
        let vy = (node.y - node.oldy) * this.friction;

        node.oldx = node.x;
        node.oldy = node.y;
        node.x += vx;
        node.y += vy + this.gravity;

        if (node.x > this.width) {
          node.x = this.width;
          node.oldx = node.x + vx * this.bounce;
        } else if (node.x < 0) {
          node.x = 0;
          node.oldx = node.x + vx * this.bounce;
        }

        if (node.y > this.height) {
          node.y = this.height;
          node.oldy = node.y + vy * this.bounce;
        } else if (node.y < 0) {
          node.y = 0;
          node.oldy = node.y + vy * this.bounce;
        }
      }
    }
  }

  updateSticks() {
    for (let i = 0, len = this.sticks.length; i < len; i++) {
      let stick = this.sticks[i],
          dx = stick.secondNode.x - stick.firstNode.x,
          dy = stick.secondNode.y - stick.firstNode.y,
          distance = Math.sqrt(dx * dx + dy * dy),
          percent = (stick.length - distance) / distance / 2,
          offsetX = dx * percent,
          offsetY = dy * percent;

      if (distance > (stick.length * 9.0531478708944287)) {
        stick.removed = true;
      }

      if (!stick.firstNode.fixed && !stick.removed) {
        stick.firstNode.x -= offsetX;
        stick.firstNode.y -= offsetY;
      }

      if (!stick.secondNode.fixed && !stick.removed) {
        stick.secondNode.x += offsetX;
        stick.secondNode.y += offsetY;
      }
    }
  }

  renderNodes() {
    let ctx = this.context;
    for (let i = 0, len = this.nodes.length; i < len; i++) {
      let node = this.nodes[i];
      ctx.beginPath();
      ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
    }
  }

  renderSticks() {
    let ctx = this.context;
    ctx.beginPath();
    for (let i = 0, len = this.sticks.length; i < len; i++) {
      let stick = this.sticks[i];
      if(stick.removed)
        continue;

      ctx.moveTo(stick.firstNode.x, stick.firstNode.y);
      ctx.lineTo(stick.secondNode.x, stick.secondNode.y);
    }
    ctx.strokeStyle = 'hsla(260, 100%, 100%, 0.6)';
    ctx.stroke();
  }
}
