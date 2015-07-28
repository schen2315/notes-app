var response = {};

response.connection = function(socket) {
  
  
  //CUSTOMIZABILITY FEATURE ADDON
  //give a unique user id to each user and
  //console it
  console.log('a user connected');
  //socket.on('disconnect', console.log('a user disconnected'));
  
  socket.on('drag', function(data) {
    console.log('moving');
    socket.broadcast.emit('drag', data);
  });
  
  socket.on('addNote', function(data) {
    console.log('adding');
    socket.broadcast.emit('addNote', data);
  });
  
}



module.exports = response;