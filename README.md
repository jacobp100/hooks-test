A somewhat complicated use case solved relatively nicely with React Hooks. Note this was the alpha version of hooks - ~~there's a few things that need to be updated for the hooks that were actually released~~ stuff needs updating to the release version of hooks.

One of my companies had an app made with React, but part of that was a canvas. The canvas was very complicated, and was essentially its own app. The main parts of complexity were:

- Keyboard handlers
- Pan and zoom
- Momentum when panning (aka slippy maps, depends on above)
- Layout animations
- Coordinating layout animations with map position (keep the current node in the same position when the layout changes)
- Drag and drop between all combinations of the canvas and React

Using component composition, I was able to split the logic into a few components parts: a component that handled panning and zooming, a component that drew on a canvas, a keyboard event handler component. However, I was unable to split it much further, and the first two components were about 1,000 lines each, as they had to handle so much.

So I tried again with hooks! It's. So. Much. Simpler. In total, we're getting close to the previous 2,000 lines of tightly coupled logic. However, each file never goes much above 50 lines, and it is much easier to follow how things fit together.

It is possible to incorporate existing HOC code, as demonstrated with `react-dnd`. There seemed to be a bug where `useImperativeMethods` didn't seem to work unless I wrapped my component in a useless class wrapper. We also end up drilling down with `getDecoratedComponentInstance` to get the correct instance. This more exposes issues with the pre-existing patterns, and hooks should completely alleviate these problems when libraries upgrade.

I thought it would be cool to share to share concepts on how to compose use directives to achieve something like this.

If you want to read about how I found it, I replied in the RFC over [here](https://github.com/reactjs/rfcs/pull/68#issuecomment-433640113).

Initialized with Create React App (run `npm start` to begin).

![Screenshot](https://github.com/jacobp100/hooks-test/blob/master/example.png?raw=true)
