canvas2ffmpeg
=============

**A simple node server that pipes http-received data (from canvas) to ffmpeg to create videos**

Usage
-----

1. You need `ffmpeg` executable installed on your machine
2. Edit `init` and `draw` in `drawing.js`, or just modify `drawing.js` and `index.html` freely
3. Run `node pipeserver.js` to start the server. The port is specified in `pipeserver.js` by `port = 8081`.
4. Open `http://localhost:8081` with your browser. Or whatever port you chose.
5. Click `Preview Animation` to run your animation only, or click `Render` to pipe the animation to ffmpeg frame-by-frame
6. Check the folder for any output files

Notes
-----

* The canvas is defined with size `1920x1080`. Changes to `cx` and `cy` in `drawing.js` will NOT reflect to the canvas. Edit the `<canvas>` element in `index.html` instead.
* Whatever you specify in the `fps` input box, the preview animation will run at a fixed framerate of approximately 30 fps. Search for calls to `requestAnimationFrame` in `index.html`.
* The animation during rendering process runs at maximum speed (drawing, POSTing, piping and ffmpeg processing). The designated `fps` will be reflected in the output video.
* Therefore, you should NEVER rely on fps to retreive images from sources like `<video>`
* Sound is not currently supported. You might want to add soundtracks to the file later, or write something to pipe WebAudio to FFMPEG before I do (send me a link, thanks, lol).
* The program runs by sending PNG sequences, which might crash certain versions of FFMPEG due to an issue. Check your version and either upgrade it or modify the `toBlob` call in `index.html`
* More information about FFMPEG can be found on [ffmpeg.org](https://ffmpeg.org/)

License
-------

This is a simple code snippet dedicated to the public domain. You can do whatever you like with it.
