import FakeWebGL from './fake-webgl';

var originalGetContext = HTMLCanvasElement.prototype.getContext;
if (!HTMLCanvasElement.prototype.getContextRaw) {
    HTMLCanvasElement.prototype.getContextRaw = originalGetContext;
}

var enabled = false;

export default {
  webglContexts: [],
  enable: function (options) {
    if (enabled) {return;}

    var self = this;
    HTMLCanvasElement.prototype.getContext = function() {
      var ctx = originalGetContext.apply(this, arguments);
      if ((ctx instanceof WebGLRenderingContext) || (window.WebGL2RenderingContext && (ctx instanceof WebGL2RenderingContext))) {
        self.webglContexts.push(ctx);
        if (options.width && options.height) {
          this.width = options.width;
          this.height = options.height;
          this.style.cssText = 'width: ' + options.width + 'px; height: ' + options.height + 'px';
        }

        if (options.fakeWebGL) {
          ctx = new FakeWebGL(ctx);
        }
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