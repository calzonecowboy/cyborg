// Importing the required modules
const WebSocket = require('ws');


// Creating a new websocket server
const wss = new WebSocket.Server({port : 8080});

// Setting up variables to initialize and keep track of inputs
bluenotes = Array();
innotes = Array();
trend = Number();
notenames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb']
let note;
let a = 440; //frequency of A 
	function freq(note) {
   	return (a / 32) * (2 ** ((note - 9) / 12));
	}

function pcify(midi) {
  if (midi == 0) {
    return 0;
  }
  if ((midi % 12) < 5) {
    return parseInt(midi / 2) + parseInt(midi / 12)
  }
  else {
    return parseInt((midi + 1) / 2 ) + parseInt(midi/12)
  }
}

function notename(midi) {
  return notenames[midi % 12]
}



// Creating connection using websocket
wss.on("connection", ws => {
  console.log("new client connected");

  // sending message to client
  ws.send('Welcome, you are connected!');

  //on message from client
  ws.on("message", data => {
    console.log(`Client has sent us: ${data}`)
    note = parseInt(data)
    if (note < 45) {
      note = note + 45
      bluenotes.push(note)
      console.log(bluenotes)
    if ((bluenotes.length % 20) == 19)
      getmodes(bluenotes)
    }
    if (note > 44) {
      innotes.push(note)
      console.log(innotes)
    if ((innotes.length % 30) == 29)
      mostinnote(innotes)
    }
  });

  // function to find the most common downvoted note
function getmodes(bluenotes) {
  var frequency = []; // array of frequency.
  var maxFreq = 0; // holds the max frequency.
  var modes = [];

  for (var i in bluenotes) {
    frequency[bluenotes[i]] = (frequency[bluenotes[i]] || 0) + 1; // convert bluenotes to frequency distribution

    if (frequency[bluenotes[i]] > maxFreq) { // is this frequency > max so far ?
      maxFreq = frequency[bluenotes[i]]; // update max.
    }
  }

  for (var k in frequency) {
    if (frequency[k] == maxFreq) {
      modes.push(k);
    }
  }
  
  console.log('modes: ', modes)
  
  for (let modeindex = 0; modeindex < modes.length; ++modeindex) {
    mode = modes[modeindex];
    ws.send(parseFloat(mode));
	}
}


//finds the most common upvoted note
function mostinnote(innotes) {
    var frequency = []; // array of frequency.
    var maxFreq = 0; // holds the max frequency.
    var modes = [];
    var trendAdjacents = [];
    var intervals = [-12, -7, -5, -3, 0, 4, 7, 9]
  
    for (var i in innotes) {
      frequency[innotes[i]] = (frequency[innotes[i]] || 0) + 1; // increment frequency.
  
      if (frequency[innotes[i]] > maxFreq) { // is this frequency > max so far ?
        maxFreq = frequency[innotes[i]]; // update max.
      }
    }
  
    for (var k in frequency) {
      if (frequency[k] == maxFreq) {
        modes.push(k);
      }
  
  
    }
    console.log('most in:', modes)
  
    if (modes.length == 1) {
      trend = Number(modes[0])
      console.log('PLAY THE NOTE: ', notename(trend))
      
      for (let m = 0; m < intervals.length; ++m) {
          trendAdjacents.push(trend + intervals[m])
          }
      for (let n = 0; n < trendAdjacents.length; ++n) {
      trendAdjacent = trendAdjacents[n];
      ws.send(parseFloat(trendAdjacent - 45));
      }
      
    }
  
  }


  // handling what to do when clients disconnects from server
  ws.on("close", () => {
      console.log("the client has connected");
  });
  // handling client connection error
  ws.onerror = function () {
      console.log("Some Error occurred")
  }
});



console.log("The WebSocket server is running on port 8080");
