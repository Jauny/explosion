var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var Particle = function(x, y) {
  this.color = randomColor();
  this.r = 3;

  this.x = x;
  this.y = y;

  this.vx = 0;
  this.vy = 0;
  this.friction = 0.2;

  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x - this.r, this.y - this.r, this.r, 0, Math.PI*2);
    ctx.fill();
  };

  this.push = function(vx, vy) {
    this.vx += vx;
    this.vy += vy;
  };

  this.update = function() {
    this.vx = this.vx * (1 - this.friction);
    this.vy = this.vy * (1 - this.friction);

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) {
      this.x = canvas.width;
    } else if (this.x > canvas.width) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = canvas.height;
    } else if (this.y > canvas.height) {
      this.y = 0;
    }
  };
};

var getMousePos = function(evt, canvas) {
  var rect = canvas.getBoundingClientRect();
  return {
    y: evt.clientY - rect.top,
    x: evt.clientX - rect.left
  };
};

var push = function(evt, particles) {
  var mousePos = getMousePos(evt, canvas);

  for (var i = 0; i < particles.length; i++) {
    var el = particles[i];

    var dist = Math.sqrt(
      Math.pow(el.x - mousePos.x, 2) +
      Math.pow(el.y - mousePos.y, 2)
    );

    var vx = 0;
    var vy = 0;
    var distx = el.x - mousePos.x;
    var disty = el.y - mousePos.y;

    if (Math.abs(distx) > 5) {
      vx = 1 / (distx / dist) * 4;
    }
    if (Math.abs(disty) > 5) {
      vy = 1 / (disty / dist * 4);
    }

    if (dist < 50) {
      el.vx = vx;
      el.vy = vy;
    }
  }
};

var explode = function(evt, particles) {
  for (var i = 0; i < particles.length; i++) {
    var el = particles[i];
    var vx = Math.random() * 50;
    el.vx = Math.random() * 2 < 1 ? -vx : vx;

    var vy = Math.random() * 50;
    el.vy = Math.random() * 2 < 1 ? -vy : vy;
  }
};

var randomColor = function() {
  r = Math.floor(Math.random() * 255);
  g = Math.floor(Math.random() * 255);
  b = Math.floor(Math.random() * 255);
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
};

var draw = function(elements) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < elements.length; i++) {
    elements[i].draw();
  }
};

var setup = function() {
  var particles = [];
  for (var i = 0; i < 400; i++) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    particles.push(new Particle(x, y));
  }
  draw(particles);
  window.setInterval(function() {
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    draw(particles);
  }, 1000/60);

  canvas.addEventListener('mousemove', function(evt) {
    push(evt, particles);
  });
  canvas.addEventListener('mousedown', function(evt) {
    explode(evt, particles);
  });
};

setup();
