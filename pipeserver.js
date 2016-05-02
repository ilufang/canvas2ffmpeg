http = require("http");
cp = require('child_process');
fs = require('fs');

ffmpeg = false;

ffoutput = {
	OUT: "",
	INFO: "",
	web: ""
};

awaiting_response_socket = false;

function ondata(data, type) {
	ffoutput[type] += data;
	var lines = ffoutput[type].split('\n');
	for (var i = 0; i < lines.length-1; i++) {
		console.log("[FFMPEG/"+type+"] "+lines[i]);
	}
	ffoutput[type] = lines.pop();
}

frame = 0;

port = 8081;

server = http.createServer(function (request, response) {
	switch (request.url) {
		case '/start':
			if (ffmpeg) {
				console.log("[SERVER/ERR] start: FFMPEG already running");
				response.writeHead(400, {"Content-Type":"text/plain"});
				response.end(ffoutput.web);
				ffoutput.web = "";
				break;
			}
			// Spawn process
			var args = "";
			request.on("data", function(data){
				args += data;
			});
			request.on("end", function(){
				console.log("[SERVER/INFO] Starting ffmpeg with args: "+args);
				ffmpeg = cp.spawn('ffmpeg', args.split(' '));

				// stdio listeners
				ffmpeg.stdout.on("data", function(data){
					ondata(data, "OUT");
				});
				ffmpeg.stderr.on("data", function(data){
					ondata(data, "INFO");
					ffoutput.web += data;
				});
				ffmpeg.stdout.on("end", function() {
					console.log("[SERVER/INFO] FFMPEG has quit.");
					ffmpeg = false;
					// if a response socket is waiting (the 'end' request), feed it
					if (awaiting_response_socket) {
						awaiting_response_socket.end(ffoutput.web);
						ffoutput.web = "";
					}
				});

				response.end(ffoutput.web);
				ffoutput.web = "";

			});
			break;

		case '/image':
			if (!ffmpeg) {
				console.log("[SERVER/ERR] start: FFMPEG not running");
				response.writeHead(400, {"Content-Type":"text/plain"});
				response.end(ffoutput.web);
				ffoutput.web = "";
				break;
			}
			if (request.method == "POST") {
				try {
					request.pipe(ffmpeg.stdin, {end: false});
					request.on("end", function() {
						response.writeHead(200, {"Content-Type":"text/plain"});
						response.end(ffoutput.web);
						ffoutput.web = "";
					})
					console.log("[SERVER/INFO] Got frame "+frame);
					frame++;
				} catch (e) {
					response.writeHead(500, {"Content-Type":"text/plain"});
					response.end(ffoutput.web);
					ffoutput.web = "";
				}
			} else {
				response.writeHead(200, {"Content-Type":"text/plain"});
				response.end(ffoutput.web);
				ffoutput.web = "";
			}
			break;
		case '/end':
			console.log("[SERVER/ERR] start: FFMPEG not running");
			if (!ffmpeg) {
				response.writeHead(400, {"Content-Type":"text/plain"});
				response.end(ffoutput.web);
				ffoutput.web = "";
				break;
			}
			ffmpeg.stdin.end();
			console.log('[SERVER/INFO] Finalizing...');
			awaiting_response_socket = response;
			break;
		case '/':
			request.url += 'index.html';
			// Fall thru
		default:
			// Treat as static web requests
			var url = request.url.substr(1); // Shift out '/'

			try {
				fs.accessSync(url);
			} catch (e) {
				console.log("[SERVER/ERR] GET 404 "+url);
				response.writeHead(404, {"Content-Type": "text/html"});
				response.end("<h1>Not Found</h1><p>The requested resource "+url+" is not found on the server");
				break;
			}
			console.log("[SERVER/INFO] GET 200 "+url);

			var mime = 'text/plain';
			switch (url.split(".").pop()) {
				case 'html':
				case 'htm': mime = 'text/html'; break;
				case 'js': mime = 'application/javascript'; break;
				case 'css': mime = 'text/css'; break;
				case 'json': mime = 'application/json'; break;
				case 'jpg':
				case 'jpeg': mime = 'image/jpeg'; break;
				case 'png': mime = 'image/png'; break;
				case 'bmp': mime = 'image/bmp'; break;
				case 'gif': mime = 'image/gif'; break;
			}
			response.writeHead(200, {'Content-Type': mime});

			var filestream = fs.createReadStream(url);
			filestream.on('end', function() {
				response.end();
			});
			filestream.pipe(response);
	}
}).listen(port);

console.log('[SERVER/INFO] HTTP server listening on port '+port);
console.log('[SERVER/INFO] Navigate to http://localhost:'+port+" to get started.");
