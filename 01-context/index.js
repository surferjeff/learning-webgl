const canvas = document.getElementById('canvas');
const context = canvas.getContext('webgl2');
context.clearColor(0.1, 0.2, 0.3, 1.0);
context.clear(context.COLOR_BUFFER_BIT|context.DEPTH_BUFFER_BIT);