var response = {};
var session = {
  publicTab : [], //{ backgrounds : [{ <background properties>}, {}, {}, ...], notes : [ { <note properties> }, {}, {} ] }
  users : {}, //example: {'username': { <note properties> }, {}, {} ], ...}
}
response.connection = function(socket) {
  
  
  //CUSTOMIZABILITY FEATURE ADDON
  //give a unique user id to each user and
  //console it
  //call it on 'user'
  
  //on connect
  //emit a 'connect' message to all users besides the connecting user - tell client to disable draggabilly
  //
  //also disable add button
  
  
  socket.on('user', function(data) {
    console.log(data);
    
    session.users[data.toString()] = {};
    console.log(session);
    socket.broadcast.emit('user', data); //blah blah has connected.
    //send to all connected clients
    socket.broadcast.emit('session', session);
    socket.emit('session', session);
    
  });
  console.log('a user connected');
  socket.on('disconnect', function() {
    //find out who disconnected.
    console.log('soandso disconnected')
  });
  
  socket.on('drag', function(data) {
    console.log('moving');
    // so which owner, then which note, and its position relative to screen size
    //session.publicTab[data.id]['position'] = data.position;
    session.publicTab[data.id] = data;
    console.log(session.publicTab[data.id]);
    socket.broadcast.emit('drag', data);
  });
  
  socket.on('addNote', function(data) {
    console.log('adding');
    //session.publicTab[data.id]['position'] = data;
    //set the position of the note created to be 
    session.publicTab[data.id] = data;
    console.log(data);
    socket.broadcast.emit('addNote', data);
    
    
  });
  
  socket.on('keyup', function(data) {
    session.publicTab[data.id] = data;
    socket.broadcast.emit('keyup', data);
  })
  
  //upon query of # of notes
  socket.on('queryLength', function() {
    socket.emit('queryLength', session.publicTab.length);
  })
  
  socket.on('window', function() {
    socket.emit('window', session.publicTab);
  })
}



module.exports = response;