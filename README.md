A somewhat complicated use case solved relatively nicely with React Hooks.

One of my companies had an app made with React, but part of that was a canvas. The canvas was very complicated, and was essentially its own app. The main parts of complexity were drag and zoom on the canvas; momentum when panning (aka slippy maps); drag and drop between the canvas and React, canvas and canvas, React and React; React state influencing the canvas; and keyboard handlers.

Using component composition, I was able to split the logic into a few components parts: a component that handled panning and zooming, a component that drew on a canvas, a keyboard event handler component. However, I was unable to split it much further, and the first two components were about 1k lines each, as they had to handle so much.

So I tried again with hooks! It's. So. Much. Simpler.

I thought it would be cool to share to share concepts on how to compose use directives to achieve something like this.

Note I didn't put dragging in, but it seems like it'd scale somewhat well if I did.

Initialized with Create React App (run `npm start` to begin).

![Screenshot](https://github.com/jacobp100/hooks-test/blob/master/example.png?raw=true)
