A somewhat complicated use case solved relatively nicely with React Hooks.

One of my companies had an app made with React, but part of that was a canvas. The canvas was very complicated, and was essentially its own app. The main parts of complexity were:

- Keyboard handlers.
- Pan and zoom
- Momentum when panning (aka slippy maps, depends on above)
- Layout animations
- Coordinating layout animations with map position (keep the current node in the same position when the layout changes)
- Drag and drop between all combinations of the canvas and React

Using component composition, I was able to split the logic into a few components parts: a component that handled panning and zooming, a component that drew on a canvas, a keyboard event handler component. However, I was unable to split it much further, and the first two components were about 1k lines each, as they had to handle so much.

So I tried again with hooks! It's. So. Much. Simpler. In total, we're getting close to the previous 1,000 lines of tightly coupled logic. However, each file never goes much above 50 lines, and it is much easier to follow how things fit together.

I thought it would be cool to share to share concepts on how to compose use directives to achieve something like this.

I got all but drag and drop implemented here. I didn't do D&D because it used React-DND, which is a HOC and not hooks.

If you want to read about how I found it, I replied in the RFC over [here](https://github.com/reactjs/rfcs/pull/68#issuecomment-433640113).

Initialized with Create React App (run `npm start` to begin).

![Screenshot](https://github.com/jacobp100/hooks-test/blob/master/example.png?raw=true)
