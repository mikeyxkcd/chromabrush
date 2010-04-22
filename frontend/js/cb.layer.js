/**
 * Copyright 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var cb = cb || {};

cb.Layer = Class.extend({
  init: function(width, height, zindex) {
    this.canvas = $('<canvas></canvas>');
    this.width = width;
    this.height = height;
    this.canvas.attr('width', width)
               .attr('height', height)
               .css('position', 'absolute')
               .css('left', '0')
               .css('top', '0')
               .css('z-index', zindex);
  },
  _onUpdated: function() {
    $(this).trigger('updated');
  },
  clear: function() {
    var context = this.getContext();
    context.clearRect(0, 0, this.width, this.height);
    this._onUpdated();
  },
  erasePixel: function(x, y, pixel_size) {
    var block_x = Math.floor(x / pixel_size);
    var block_y = Math.floor(y / pixel_size);
    var context = this.getContext();
    context.beginPath();
    context.clearRect(
        Math.round(block_x * pixel_size), 
        Math.round(block_y * pixel_size), 
        pixel_size, 
        pixel_size);
    this._onUpdated();
  },
  fill: function(color) {
    var context = this.getContext();
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(0, 0, this.width, this.height);
    this._onUpdated();
  },
  getCanvas: function() {
    return this.canvas.get(0);
  },
  getContext: function() {
    return this.canvas.get(0).getContext('2d');
  },
  getDataUrl: function(width, height) {
    if (!width) { width = this.width; }
    if (!height) { height = this.height; }
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.drawImage(this.getCanvas(), 0, 0, width, height);
    return canvas.toDataURL();
  },
  paintFill: function(x, y, pixel_size, color) {
    cb.util.canvas.paintFill(this.getCanvas(), x, y, pixel_size, color);
    this._onUpdated();
  },
  paintGrid: function(step, color) {
    var context = this.getContext();
    console.log(this.width, this.height);
    for (var x = 0.5; x <= this.width; x += step) {
      context.moveTo(x, 0);
      context.lineTo(x, this.height);
    }
    for (var y = 0.5; y <= this.height; y += step) {
      context.moveTo(0, y);
      context.lineTo(this.width, y);
    }
    context.strokeStyle = color;
    context.stroke();
    context.beginPath();
    this._onUpdated();
  },
  paintLine: function(x0, y0, x1, y1, pixel_size, color) {
    var canvas = this.getCanvas();
    cb.util.canvas.paintLine(canvas, x0, y0, x1, y1, pixel_size, color);
    this._onUpdated();
  },
  /** 
   * 
   */
  paintMarker: function(x, y, pixel_size, color) {
    var bx = Math.floor(x / pixel_size) * pixel_size;
    var by = Math.floor(y / pixel_size) * pixel_size;
    var context = this.getContext();
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(bx, by);
    context.lineTo(bx + pixel_size - 1, by + pixel_size - 1);
    context.moveTo(bx + pixel_size - 1, by);
    context.lineTo(bx, by + pixel_size - 1);
    context.stroke();
    this._onUpdated();
  },
  /**
   * Paints a square pixel on this canvas.
   * The square pixels are aligned in a grid, so the grid box containing the
   * x and y coordinates will be painted.
   */
  paintPixel: function(x, y, pixel_size, color) {
    cb.util.canvas.paintPixel(this.getCanvas(), x, y, pixel_size, color);
    this._onUpdated();
  },
  setZIndex: function(zindex) {
    this.canvas.css('z-index', zindex);
  }
});