import FakeWebGL from './fake-webgl';

var originalGetContext = HTMLCanvasElement.prototype.getContext;
if (!HTMLCanvasElement.prototype.getContextRaw) {
    HTMLCanvasElement.prototype.getContextRaw = originalGetContext;
}

var enabled = false;

export default {
  webglContexts: [],
  canvas2dContexts: [],
  contexts: [],
  getNumContexts: function(type) {
    if (type === "webgl") {
      return this.webglContexts.length;
    } else if (type === "2d") {
      return this.canvas2dContexts.length;
    }

    return this.contexts.length;
  },
  getContext: function(idx, type) {
    if (type === "webgl") {
      return this.webglContexts[idx];
    } else if (type === "2d") {
      return this.canvas2dContexts[idx];
    }

    return this.contexts[idx];
  },
  getContextsByCanvasId: function(id, type) {
    let contexts;
    if (type === 'webgl') {
      contexts = this.webglContexts;
    } else if (type === '2d') {
      contexts = this.canvas2dContexts;
    } else {
      contexts = this.contexts;
    }
    return contexts.filter(context => id === context.canvas.id);
  },
  isWebGLContext: function(ctx) {
    return (ctx instanceof WebGLRenderingContext) || (window.WebGL2RenderingContext && (ctx instanceof WebGL2RenderingContext));
  },
  enable: function (options) {
    if (enabled) {return;}

    var self = this;
    HTMLCanvasElement.prototype.getContext = function() {
      var ctx = originalGetContext.apply(this, arguments);
      if (self.isWebGLContext(ctx)) {
        self.webglContexts.push(ctx);
        self.contexts.push(ctx);

        if (options.fakeWebGL) {
          ctx = new FakeWebGL(ctx);
        }
      } else if ((ctx instanceof CanvasRenderingContext2D)) {
        self.canvas2dContexts.push(ctx);
        self.contexts.push(ctx);
      } else {
        return ctx;
      }

      if (options.width && options.height) {
        this.width = options.width;
        this.height = options.height;
        this.style.cssText = 'width: ' + options.width + 'px; height: ' + options.height + 'px';
      }
      return ctx;
    }
    enabled = true;
  },

  disable: function () {
    if (!enabled) {return;}
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    enabled = false;
  }
};