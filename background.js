// Subtle matrix-style code rain, fixed behind all page content. Respects
// prefers-reduced-motion and pauses when the tab isn't visible.
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.prepend(canvas);
  var ctx = canvas.getContext('2d');

  var chars = '01アイウエオカキクケコサシスセソ$#{}<>/\\;:=+-*'.split('');
  var fontSize = 18;
  var columns, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(function () {
      return Math.random() * -100;
    });
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(10, 14, 18, 0.14)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px ui-monospace, "Cascadia Code", monospace';
    for (var i = 0; i < columns; i++) {
      var char = chars[Math.floor(Math.random() * chars.length)];
      var y = drops[i] * fontSize;
      // Leading character brighter, rest of the trail dimmer.
      ctx.fillStyle = 'rgba(52, 211, 153, 0.5)';
      ctx.fillText(char, i * fontSize, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  var running = true;
  var frame = 0;
  function loop() {
    if (!running) return;
    // Throttle to ~20fps — plenty smooth for this effect, much lighter on CPU.
    frame++;
    if (frame % 3 === 0) draw();
    requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', function () {
    running = document.visibilityState === 'visible';
    if (running) requestAnimationFrame(loop);
  });

  requestAnimationFrame(loop);
})();
