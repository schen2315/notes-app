  var socket = io();

  //have the clientside socket listen to
  //the 'move' event
  //every time it gets the position of the note,
  //transform its position.

  //data is going to be an object looking like this:
  //data {  id, position :{ left: x, top: y}  }

  socket.on('drag', dragResponse);


  function drag(event, ui) {
    
    // --OPTIMIZATION NOTE--
    //later create the ability to append an array of notes
    //so that we can refer to that note

    var note = $(this);

    //make sure you can see the clicked note
    note.css('z-index', '2').siblings().css('z-index', '0');

    console.log({
      id : note.attr('id'), position : ui.position
    });
    
    socket.emit('drag', {
      id : note.attr('id'), position : {
                                          left : (ui.position.left/ canvasWidth),
                                          top : (ui.position.top / canvasHeight)
                                        }
    });
  }
  
  function dragResponse(data) {
    
    var id = data.id,
        percentLeft = data.position.left,
        percentTop = data.position.top;


    //BUG FIX
    //add a 'click' socket message event
    //For every JQuery event listener
    //make a corresponding socket
    
    // --OPTIMIZATION NOTE--
    //later create the ability to append an array of notes
    //so that we can refer to that note

    $('#' + data.id.toString()).css({
                                       'top': (percentTop * canvasHeight),
                                       'left': (percentLeft * canvasWidth)
                                     });
    
  }
  
  socket.on('staticClick', staticClickResponse)
  
  function staticClick(event) {
    
    // --OPTIMIZATION NOTE--
    //later create the ability to append an array of notes
    //so that we can refer to that note

    var note = $(this);

    //make sure you can see the clicked note
    note.css('z-index', '2').siblings().css('z-index', '0');
    
    
  }
  
  function staticClickResponse() {
    
  }
  
  socket.on('addNote', addNoteResponse);
  
  function addNote(percentLeft, percentTop, noteID) {
  
    socket.emit('addNote', {
                              CoordX : percentLeft,
                              CoordY : percentTop,
                              id : noteID
                           });
  }
  
  function addNoteResponse(data) {

    console.log('why u no work??!!!');
    var percentTop = data.CoordY;
    var percentLeft = data.CoordX;
    var noteID = data.id;
    console.log(data);
    $('#canvas').append("<div class='note' id='"+ noteID +"'><div class='noteTitle'>Sticky Notes</div><textarea class='noteTextArea' placeholder='Text Here...'></textarea></div>");
    
    $("#" + noteID).draggable({
                              containment: "#canvas",
                              opacity: 0.7
                            })  //these are the event listeners that make the socket.io work
                 .on('drag', drag)
                 .css({
                        'top': (percentTop * canvasHeight),
                        'left': (percentLeft * canvasWidth)
                      });
    
    noteID++
  }