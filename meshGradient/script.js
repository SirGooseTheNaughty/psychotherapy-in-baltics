"use strict";

const meshData = {
  colors: {
      tl: '#91AED8',
      tr: '#9FB7DE',
      bl: '#AABEE1',
      br: '#AABEE1'
  },
  canvasId: 'mesh-canvas',
  dots: [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
      [-0.9, -0.8],
      [1, 1],
  ],
  moving: [
    { index: 4, revert: false, add: { vert: 0.3, hor: 0.3 } },
    { index: 5, revert: true, add: { vert: -0.5, hor: 0.5 } },
    // { index: 6, revert: true, add: { vert: -0.25, hor: -0.5 } },
  ],
  target: [
      [-1, 0.5],
      [1, -0.5],
  ]
};

// const meshData = {
//   colors: {
//       tl: '#91AED8',
//       tr: '#9FB7DE',
//       bl: '#AABEE1',
//       br: '#AABEE1'
//   },
//   canvasId: 'mesh-canvas',
//   dots: [
//       [-1, -1],
//       [-1, 1],
//       [1, -1],
//       [0, 0],
//       [0.9, 0.8],
//   ],
//   moving: [
//     { index: 4, revert: false },
//   ],
//   target: [
//       [-1, 0.5],
//   ]
// };

let warps,
  gradient,
  texture,
  MAX_POINTS = 32,
  colors = meshData.colors;

function load_resource(s) {
  let M = new XMLHttpRequest();
  return (
    M.open("GET", s, !1),
    M.overrideMimeType("text/plain; charset=x-user-defined"),
    M.send(null),
    200 != M.status && 0 != M.status ? null : M.responseText
  );
}
function load_source(s) {
  let M = document.getElementById(s);
  if (!M) throw Error("element '" + s + "' not found");
  return M.hasAttribute("src") ? load_resource(M.src) : M.text;
}
function Warp(s, M, t, e) {
  (this.parent = s),
    (this.which = M),
    (this.src = t),
    (this.dst = e),
    (this.s2 = []),
    (this.w = []);
}
function linsolve(s, M) {
  let t = s.length,
    e = s[0].length,
    w = M[0].length;
  for (let L = 0; L < e - 1; L++) {
    let D = L,
      i = D + 1,
      r = Math.abs(s[D][L]),
      N = D;
    for (let M = D + 1; M < t; M++) {
      let t = Math.abs(s[M][L]);
      r < t && ((r = t), (N = M));
    }
    if (N != D) {
      let t = s[D];
      (s[D] = s[N]), (s[N] = t);
      let e = M[D];
      (M[D] = M[N]), (M[N] = e);
    }
    for (let r = i; r < t; r++) {
      let t = s[D][L],
        i = s[r][L];
      for (let M = L; M < e; M++) s[r][M] = t * s[r][M] - i * s[D][M];
      for (let s = 0; s < w; s++) M[r][s] = t * M[r][s] - i * M[D][s];
    }
  }
  for (let e = t - 1; e >= 0; e--) {
    for (let L = t - 1; L > e; L--) {
      let t = s[e][L];
      s[e][L] = 0;
      for (let s = 0; s < w; s++) M[e][s] -= t * M[L][s];
    }
    for (let t = 0; t < w; t++) M[e][t] /= s[e][e];
    s[e][e] = 1;
  }
  return M;
}
function Warps(s = [], M = [], t = 0) {
  (this.npoints = t), (this.src = s), (this.dst = M);
  this.src.map(s =>
    "number" != typeof s[0] || "number" != typeof s[1] ? [0, 0] : s
  ),
    this.dst.map(s =>
      "number" != typeof s[0] || "number" != typeof s[1] ? [0, 0] : s
    ),
    (this.warps = [
      new Warp(this, 0, this.src, this.dst),
      new Warp(this, 1, this.dst, this.src)
    ]);
}
function Canvas(s, M, t, e) {
  (this.warp = s),
    (this.id = t),
    (this.canvas = M),
    M.setAttribute("tabIndex", s.which + 1),
    (this.ctx = M.getContext("webgl", { preserveDrawingBuffer: !0 })),
    (this.isClone = e),
    (this.errors = null),
    (this.texture = null),
    (this.position_buffer = null),
    (this.texcoord_buffer = null),
    (this.index_buffer = null),
    (this.num_indices = null),
    (this.warp_program = null),
    (this.drag = null),
    (this.radius = 10),
    this.setup();
}
function flatten(s, M) {
  if (!M) return s;
  let t = [];
  for (let e = 0; e < s.length; e++) {
    let w = s[e];
    M > 1 && (w = flatten(w, M - 1));
    for (let s = 0; s < w.length; s++) t.push(w[s]);
  }
  return t;
}
(Warp.prototype = new Object()),
  (Warp.prototype.npoints = function() {
    return this.parent.npoints;
  }),
  (Warp.prototype.get_src = function() {
    let s = this.src.slice(0, this.npoints());
    for (let M = 0; M < s.length; M++) s[M] = s[M].slice();
    return s;
  }),
  (Warp.prototype.get_dst = function() {
    let s = this.dst.slice(0, this.npoints());
    for (let M = 0; M < s.length; M++) s[M] = s[M].slice();
    return s;
  }),
  (Warp.prototype.distance_squared = function(s, M, t) {
    if (t) {
      let M = [];
      for (let t = 0; t < s.length; t++) {
        let e = [];
        for (let M = 0; M < s.length; M++)
          e.push(s[t][0] * s[M][0] + s[t][1] * s[M][1]);
        M.push(e);
      }
      let t = [];
      for (let e = 0; e < s.length; e++) {
        let w = [];
        for (let t = 0; t < s.length; t++)
          w.push(M[e][e] + M[t][t] - 2 * M[e][t]);
        t.push(w);
      }
      return t;
    }
    {
      let t = [];
      for (let e = 0; e < s.length; e++) {
        let w = [];
        for (let t = 0; t < M.length; t++)
          w.push(s[e][0] * M[t][0] + s[e][1] * M[t][1]);
        t.push(w);
      }
      let e = [];
      for (let M = 0; M < s.length; M++)
        e.push(s[M][0] * s[M][0] + s[M][1] * s[M][1]);
      let w = [];
      for (let s = 0; s < M.length; s++)
        w.push(M[s][0] * M[s][0] + M[s][1] * M[s][1]);
      let L = [];
      for (let D = 0; D < s.length; D++) {
        let s = [];
        for (let L = 0; L < M.length; L++) s.push(e[D] + w[L] - 2 * t[D][L]);
        L.push(s);
      }
      return L;
    }
  }),
  (Warp.prototype.rbf = function(s, M, t) {
    let e = this.distance_squared(s, M, t);
    if (t) {
      let s = e[0][0];
      for (let M = 0; M < e.length; M++)
        for (let t = 0; t < e[M].length; t++) s < e[M][t] && (s = e[M][t]);
      let M = [];
      for (let t = 0; t < e.length; t++) {
        let w = [];
        for (let M = 0; M < e[t].length; M++) w.push(t == M ? s : e[t][M]);
        M.push(w);
      }
      for (let s = 0; s < M[0].length; s++) {
        let t = M[0][s];
        for (let e = 1; e < M.length; e++) t > M[e][s] && (t = M[e][s]);
        this.s2[s] = t;
      }
    }
    let w = [];
    for (let s = 0; s < e.length; s++) {
      let M = [];
      for (let t = 0; t < e[s].length; t++)
        M.push(Math.sqrt(e[s][t] + this.s2[t]));
      w.push(M);
    }
    return w;
  }),
  (Warp.prototype.update = function() {
    if (this.npoints() < 4) return;
    let s = this.get_src(),
      M = this.get_dst(),
      t = linsolve(this.rbf(s, s, !0), M);
    for (let s = 0; s < t.length; s++) this.w[s] = t[s];
  }),
  (Warp.prototype.warp = function(s) {
    if (this.npoints() < 4) return s.slice();
    let M = this.rbf(s, this.get_src()),
      t = [];
    for (let s = 0; s < M.length; s++) {
      let e = [];
      for (let t = 0; t < 2; t++) {
        let w = 0;
        for (let e = 0; e < M[s].length; e++) w += M[s][e] * this.w[e][t];
        e.push(w);
      }
      t.push(e);
    }
    return t;
  }),
  (Warps.prototype = new Object()),
  (Warps.prototype.update = function() {
    for (let s = 0; s < this.warps.length; s++) this.warps[s].update();
  }),
  (Warps.prototype.add = function(s, M, t, e, w) {
    if (w) {
      let w = s;
      (s = t), (t = w);
      let L = M;
      (M = e), (e = L);
    }
    (this.src[this.npoints] = [s, M]),
      (this.dst[this.npoints] = [t, e]),
      this.npoints++,
      this.update();
  }),
  (Warps.prototype.add_pair = function(s, M, t) {
    let e = s ? 1 : 0,
      w = this.warps[e].warp([[M, t]])[0],
      L = w[0],
      D = w[1];
    this.add(M, t, L, D, s);
  }),
  (Canvas.prototype.check_error = function() {
    let s = this.ctx;
    null == this.errors &&
      ((this.errors = {}),
      (this.errors[s.INVALID_ENUM] = "invalid enum"),
      (this.errors[s.INVALID_VALUE] = "invalid value"),
      (this.errors[s.INVALID_OPERATION] = "invalid operation"),
      (this.errors[s.OUT_OF_MEMORY] = "out of memory"));
    for (let M = 0; M < 10; M++) {
      let M = s.getError();
      if (0 == M) return;
      throw Error(this.errors[M]);
    }
  }),
  (Canvas.prototype.shader = function(s, M, t) {
    let e = this.ctx,
      w = e.createShader(M);
    if (
      (e.shaderSource(w, t),
      e.compileShader(w),
      !e.getShaderParameter(w, e.COMPILE_STATUS))
    )
      throw Error(s + ": " + e.getShaderInfoLog(w));
    return w;
  }),
  (Canvas.prototype.program = function(s, M, t) {
    let e = this.ctx,
      w = load_source(M),
      L = load_source(t),
      D = this.shader(s + ".vertex", e.VERTEX_SHADER, w),
      i = this.shader(s + ".fragment", e.FRAGMENT_SHADER, L),
      r = e.createProgram();
    if (
      (e.attachShader(r, D),
      e.attachShader(r, i),
      e.linkProgram(r),
      !e.getProgramParameter(r, e.LINK_STATUS))
    )
      throw new Error(e.getProgramInfoLog(r));
    return this.check_error(), r;
  }),
  (Canvas.prototype.setup_programs = function() {
    (this.warp_program = this.program("warp", "warp_vertex", "warp_fragment")),
      (this.point_program = this.program(
        "points",
        "point_vertex",
        "point_fragment"
      ));
  }),
  (Canvas.prototype.setup_buffers = function() {
    let s = this.ctx,
      M = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
    (this.position_buffer = s.createBuffer()),
      s.bindBuffer(s.ARRAY_BUFFER, this.position_buffer),
      s.bufferData(s.ARRAY_BUFFER, M, s.STATIC_DRAW);
    let t = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
    (this.texcoord_buffer = s.createBuffer()),
      s.bindBuffer(s.ARRAY_BUFFER, this.texcoord_buffer),
      s.bufferData(s.ARRAY_BUFFER, t, s.STATIC_DRAW),
      (this.points_buffer = s.createBuffer()),
      s.bindBuffer(s.ARRAY_BUFFER, this.points_buffer),
      s.bufferData(s.ARRAY_BUFFER, 2 * MAX_POINTS * 4, s.STATIC_DRAW),
      s.bindBuffer(s.ARRAY_BUFFER, null),
      (this.indices = new Uint16Array([0, 1, 2, 2, 3, 0])),
      (this.num_indices = this.indices.length),
      (this.index_buffer = s.createBuffer()),
      s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, this.index_buffer),
      s.bufferData(s.ELEMENT_ARRAY_BUFFER, this.indices, s.STATIC_DRAW),
      s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, null),
      this.check_error();
  }),
  (Canvas.prototype.set_uniform = function(s, M, t, e, w) {
    let L = this.ctx,
      D = L.getUniformLocation(s, M);
    if (0 == e) t.call(L, D, w);
    else {
      if (1 != e) throw new Error("invalid type");
      t.call(L, D, new Float32Array(w));
    }
  }),
  (Canvas.prototype.draw = function() {
    let s = this.ctx;
    if (
      (s.clearColor(0.5, 0.5, 1, 1),
      s.clear(s.COLOR_BUFFER_BIT),
      this.warp.npoints() >= 4)
    ) {
      s.useProgram(this.warp_program),
        this.set_uniform(
          this.warp_program,
          "u_color3",
          s.uniform1i,
          0,
          colors.tl.replace("#", "0x")
        ),
        this.set_uniform(
          this.warp_program,
          "u_color4",
          s.uniform1i,
          0,
          colors.tr.replace("#", "0x")
        ),
        this.set_uniform(
          this.warp_program,
          "u_color2",
          s.uniform1i,
          0,
          colors.br.replace("#", "0x")
        ),
        this.set_uniform(
          this.warp_program,
          "u_color1",
          s.uniform1i,
          0,
          colors.bl.replace("#", "0x")
        ),
        this.set_uniform(this.warp_program, "tex", s.uniform1i, 0, 0),
        this.set_uniform(
          this.warp_program,
          "warp",
          s.uniform1i,
          0,
          this.warp.which
        ),
        this.set_uniform(
          this.warp_program,
          "npoints",
          s.uniform1i,
          0,
          this.warp.npoints()
        ),
        this.set_uniform(
          this.warp_program,
          "points",
          s.uniform2fv,
          1,
          flatten(this.warp.src, 1)
        ),
        this.set_uniform(
          this.warp_program,
          "s2",
          s.uniform1fv,
          1,
          this.warp.s2
        ),
        this.set_uniform(
          this.warp_program,
          "w",
          s.uniform2fv,
          1,
          flatten(this.warp.w, 1)
        ),
        s.activeTexture(s.TEXTURE0);
      let M = s.getAttribLocation(this.warp_program, "a_Position"),
        t = s.getAttribLocation(this.warp_program, "a_TexCoord");
      s.enableVertexAttribArray(M),
        s.bindBuffer(s.ARRAY_BUFFER, this.position_buffer),
        s.vertexAttribPointer(M, 2, s.FLOAT, !1, 0, 0),
        s.enableVertexAttribArray(t),
        s.bindBuffer(s.ARRAY_BUFFER, this.texcoord_buffer),
        s.vertexAttribPointer(t, 2, s.FLOAT, !1, 0, 0),
        s.bindBuffer(s.ARRAY_BUFFER, null),
        s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, this.index_buffer),
        s.drawElements(s.TRIANGLES, this.num_indices, s.UNSIGNED_SHORT, 0),
        s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, null),
        s.disableVertexAttribArray(M),
        s.disableVertexAttribArray(t),
        s.useProgram(null);
    }
    if (this.warp.npoints() > 0 && !this.isClone) {
      s.useProgram(this.point_program),
        this.set_uniform(
          this.point_program,
          "radius",
          s.uniform1f,
          0,
          this.radius
        ),
        this.set_uniform(this.point_program, "color", s.uniform3fv, 0, [
          0,
          0,
          0
        ]);
      let M = s.getAttribLocation(this.point_program, "a_Position"),
        t = this.warp.get_src();
      s.enableVertexAttribArray(M),
        s.bindBuffer(s.ARRAY_BUFFER, this.points_buffer),
        s.bufferSubData(s.ARRAY_BUFFER, 0, new Float32Array(flatten(t, 1))),
        s.vertexAttribPointer(M, 2, s.FLOAT, !1, 0, 0),
        // s.drawArrays(s.POINTS, 0, t.length),
        s.bindBuffer(s.ARRAY_BUFFER, null),
        s.disableVertexAttribArray(M),
        s.useProgram(null);
    }
    s.flush(), this.check_error();
  }),

  (Canvas.prototype.mouse_move = function(s) {
    let M = this.canvas.getBoundingClientRect(),
      t = M.right - M.left,
      e = M.bottom - M.top,
      w = ((s.clientX - M.left) / t) * 2 - 1,
      L = ((M.bottom - s.clientY) / e) * 2 - 1;
    this.moving.forEach((mov, i) => {
      const D = this.drag[i][0],
        index = this.drag[i][1],
        r = this.drag[i][2];
      let N = this.drag[i][3] - index + (mov.revert ? -w : w),
        d = this.drag[i][4] - r + (mov.revert ? -L : L);
      if (mov.coeff) {
        N *= mov.coeff;
        d *= mov.coeff;
      }
      if (mov.add && mov.add.vert) {
        d += mov.add.vert;
      }
      if (mov.add && mov.add.hor) {
        N += mov.add.hor;
      }
      this.target[i] = [N, d];
    });
  }),
  (Canvas.prototype.setup = function() {
    this.setup_programs(),
      this.setup_buffers(),
      (document.onmousemove = this.mouse_move.bind(this));
  }),
  (Canvas.prototype.update_position = function() {
    this.moving.forEach((mov, i) => {
      const gain = [
        (this.target[i][0] - this.warp.src[mov.index][0]) / 80,
        (this.target[i][1] - this.warp.src[mov.index][1]) / 80
      ];
      const err = Math.abs(gain[0]) + Math.abs(gain[1]);
      if (err > 0.001) {
        redraw();
        this.warp.src[mov.index][0] += gain[0];
        this.warp.src[mov.index][1] += gain[1];
        warps.update();
      }
    });
  });
let needsDraw = false;
function redraw() {
  needsDraw = true;
}
function loop() {
  gradient.update_position();
  if (needsDraw) {
    gradient.draw();
    needsDraw = false;
  }
  requestAnimationFrame(loop);
}
function adjust() {
  const canvas = document.getElementById(meshData.canvasId);
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
}


function init() {
  const canvas = document.getElementById(meshData.canvasId);
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;

  warps = new Warps();
  gradient = new Canvas(
    warps.warps[1],
    document.getElementById(meshData.canvasId),
    meshData.canvasId
  );

  for (let M = 0; M < meshData.dots.length; M++) {
    let t = meshData.dots[M][0],
      e = meshData.dots[M][1];
    warps.add_pair(0, t, e);
  }
  warps.update();

  gradient.moving = meshData.moving;
  gradient.target = meshData.target;
  gradient.drag = gradient.moving.map((mov, i) => {
    return [mov.index, ...gradient.warp.src[mov.index], ...gradient.warp.src[mov.index]]
  });

  redraw();
  loop();
}
function isMobile() {
  return /Mobi/i.test(window.navigator.userAgent);
}

try {
  if (!isMobile()) {
    init();
  }
} catch(e) {
  console.error(e);
}