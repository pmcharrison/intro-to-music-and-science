/********************************************************
Copyright 2016 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*********************************************************/

'use strict'
var Util = require('../util/util.js');
var Player = require('../UI/player');
var AnalyserView = require('../3D/visualizer');


var spec3D = {
  cxRot: 90,
  drawingMode: false,
  prevX: 0,
  handleTrack: function(e) {
    switch(e.type){
      case 'mousedown':
      case 'touchstart':
        // START: MOUSEDOWN ---------------------------------------------
        spec3D.prevX = Number(e.pageX) || Number(e.originalEvent.touches[0].pageX)
        $(e.currentTarget).on('mousemove',spec3D.handleTrack)
        $(e.currentTarget).on('touchmove',spec3D.handleTrack)

        if (spec3D.drawingMode == false) return false
        var freq = spec3D.yToFreq(Number(e.pageY) || Number(e.originalEvent.touches[0].pageY));

        if (spec3D.isPlaying()) spec3D.player.setBandpassFrequency(freq);
        else spec3D.player.playTone(freq);
        return false;
        break;
      case 'mousemove' :
      case 'touchmove' :
        // TRACK --------------------------------------------------------
        var ddx = (Number(e.pageX) || Number(e.originalEvent.touches[0].pageX)) - spec3D.prevX;
        spec3D.prevX = Number(e.pageX) || Number(e.originalEvent.touches[0].pageX)

        if(spec3D.drawingMode){

          var y = Number(e.pageY) || Number(e.originalEvent.touches[0].pageY);
          var freq = spec3D.yToFreq(y);
          // console.log('%f px maps to %f Hz', y, freq);

          if (spec3D.isPlaying()) spec3D.player.setBandpassFrequency(freq);
          else spec3D.player.playTone(freq);

        } else if (spec3D.isPlaying()) {

          spec3D.cxRot += (ddx * .2)

          if (spec3D.cxRot < 0) spec3D.cxRot = 0;
          else if ( spec3D.cxRot > 90) spec3D.cxRot = 90;

          // spec3D.analyserView.cameraController.yRot = spec3D.easeInOutCubic(spec3D.cxRot / 90, 180 , 90 , 1);
          // spec3D.analyserView.cameraController.zT = spec3D.easeInOutCubic(spec3D.cxRot / 90,-2,-1,1);
          // console.log(spec3D.cxRot / 90);
          // spec3D.analyserView.cameraController.zT = -6 + ((spec3D.cxRot / 90) * 4);
        }
        return false;
        break;
      case 'mouseup' :
      case 'touchend':
      // END: MOUSEUP -------------------------------------------------
        $(e.currentTarget).off('mousemove',spec3D.handleTrack)
        $(e.currentTarget).off('touchmove',spec3D.handleTrack)
        if (spec3D.drawingMode == false) return false

        if (spec3D.isPlaying()) spec3D.player.setBandpassFrequency(null);
        else spec3D.player.stopTone();
        return false;
        break;
    }
  },

  attached: function() {
    console.log('spectrogram-3d attached');
    Util.setLogScale(20, 20, 20000, 20000);
    spec3D.onResize_();
    spec3D.init_();

    window.addEventListener('resize', spec3D.onResize_.bind(spec3D));
  },

  stop: function() {
    spec3D.player.stop();
  },

  isPlaying: function() {
    return !!this.player.source;
  },

  stopRender: function() {
    spec3D.isRendering = false;
  },

  startRender: function() {
    if (spec3D.isRendering) {
      return;
    }
    spec3D.isRendering = true;
    spec3D.draw_();
  },

  loopChanged: function(loop) {
    spec3D.player.setLoop(loop);
  },

  play: function(src) {
    spec3D.src = src;
    spec3D.player.playSrc(src);
  },

  live: function() {
    spec3D.player.live();
  },

  userAudio: function(src) {
    spec3D.player.playUserAudio(src)
  },

  init_: function() {
    // Initialize everything.
    var player = new Player();
    var analyserNode = player.getAnalyserNode();

    var analyserView = new AnalyserView(this.canvas);
    analyserView.setAnalyserNode(analyserNode);
    analyserView.initByteBuffer();

    spec3D.player = player;
    spec3D.analyserView = analyserView;
    $('#spectrogram')
      .on('mousedown',this.handleTrack)
      .on('touchstart',this.handleTrack)
      .on('mouseup',this.handleTrack)
      .on('touchend',this.handleTrack)
  },

  onResize_: function() {
    console.log('onResize_');
    var canvas = $('#spectrogram')[0];
    spec3D.canvas = canvas;

    // access sibling or parent elements here
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    // Also size the legend canvas.
    var legend = $('#legend')[0];
    legend.width = $(window).width();
    legend.height = $(window).height() - 158;

    spec3D.drawLegend_();
  },

  draw_: function() {
    if (!spec3D.isRendering) {
      console.log('stopped draw_');
      return;
    }

    spec3D.analyserView.doFrequencyAnalysis();
    requestAnimationFrame(spec3D.draw_.bind(spec3D));
  },

  drawLegend_: function() {
    // Draw a simple legend.
    var canvas = $('#legend')[0];
    var ctx = canvas.getContext('2d');
    var x = canvas.width - 10;



    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Roboto';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('20,000 Hz -', x, canvas.height - spec3D.freqToY(20000));
    ctx.fillText('2,000 Hz -', x, canvas.height - spec3D.freqToY(2000));
    ctx.fillText('200 Hz -', x, canvas.height - spec3D.freqToY(200));
    ctx.fillText('20 Hz -', x, canvas.height - spec3D.freqToY(20));

  },

  /**
   * Convert between frequency and the offset on the canvas (in screen space).
   * For now, we fudge this...
   *
   * TODO(smus): Make this work properly with WebGL.
   */
  freqStart: 20,
  freqEnd: 20000,
  padding: 30,
  yToFreq: function(y) {
    var padding = spec3D.padding;
    var height = $('#spectrogram').height();

    if (height < 2*padding || // The spectrogram isn't tall enough
        y < padding || // Y is out of bounds on top.
        y > height - padding) { // Y is out of bounds on the bottom.
      return null;
    }
    var percentFromBottom = 1 - (y - padding) / (height - padding);
    var freq = spec3D.freqStart + (spec3D.freqEnd - spec3D.freqStart)* percentFromBottom;
    return Util.lin2log(freq);
  },

  // Just an inverse of yToFreq.
  freqToY: function(logFreq) {
    // Go from logarithmic frequency to linear.
    var freq = Util.log2lin(logFreq);
    var height = $('#spectrogram').height();
    var padding = spec3D.padding;
    // Get the frequency percentage.
    var percent = (freq - spec3D.freqStart) / (spec3D.freqEnd - spec3D.freqStart);
    // Apply padding, etc.
    return spec3D.padding + percent * (height - 2*padding);
  },
  easeInOutCubic: function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  },
  easeInOutQuad: function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInOutQuint: function (t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  },
  easeInOutExpo: function (t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  }
};


module.exports = spec3D;
