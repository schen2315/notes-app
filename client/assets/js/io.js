  //var socket = io();
  //var menuHeight = document.getElementById('menu').offsetHeight;
  //have the clientside socket listen to
  //the 'move' event
  //every time it gets the position of the note,
  //transform its position.

  //data is going to be an object looking like this:
  //data {  id, position :{ left: x, top: y}  }

  socket.on('drag', dragResponse);


  function drag(event) {

    // --OPTIMIZATION NOTE--
    //later create the ability to append an array of notes
    //so that we can refer to that note

    var note = $(this);

    //make sure you can see the clicked note
    note.css('z-index', '2').siblings().css('z-index', '0');

    console.log({
      id : note.attr('id'), position : /*$('#' + note.attr('id')).data('draggabilly').position*/ note.data('draggabilly').position
    });

    var position = note.data('draggabilly').position
    socket.emit('drag', {
      id : note.attr('id'), position : {
                                          left : (position.x/ canvasWidth),
                                          top : ((position.y)/ canvasHeight)
                                        }
    });
  }


  socket.on('keyup', keyupResponse)
  //when a user types on the note:
  function keyup() {
    //id, position, text
    var note = $(this).parent("div"),
        id = note.attr("id"),
        position = note.data("draggabilly").position,
        text = $(this).val();

    var object = {
          id: id,
          position: { left : (position.x/ canvasWidth),
                      top : ((position.y)/ canvasHeight) },
          text: text
        }
    console.log(object);
    socket.emit('keyup', object);
  }

  //this is what the other clients will see
  function keyupResponse(data) {

      //make sure to disable textarea when someone else is typing
      var id = data.id,
          text = data.text;

      console.log('i got the data!')
      //make sure to disable textarea when someone else is typing
      $('#' + data.id.toString())
                  .children("textarea")
                  //.attr("disabled", "")
                  .val(text);


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

    event.stopPropagation();
    var note = $(this);

    //make sure you can see the clicked note
    note.css('z-index', '2').siblings().css('z-index', '0').siblings('#context-menu').css('z-index','1000').siblings('#dark-screen').css('z-index','1').siblings('#color-picker').css('z-index','1000');

    //determine if context-menu should be displayed on the left or on the right
    if (note.position().left+note.width()+contextMenu.width()>=$('#canvas').width()){
      contextMenu.css('left',note.position().left-contextMenu.width());
    } else {
      contextMenu.css('left',note.position().left+note.width());
    }
    //get top position and show
    if (note.position().top+contextMenu.height()>=$('#canvas').height()){
      contextMenu.css('top',note.position().top-(contextMenu.height()-note.height()));
    }else{
      contextMenu.css('top', note.position().top)
    }
    contextMenu.show();
    //remember selected note if opened
    contextMenu.data('selectedNote',note.attr('id'));
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
    var percentTop = data.CoordY || data.position.top;
    var percentLeft = data.CoordX || data.position.left;
    var noteID = data.id;
    console.log(data);
    $('#canvas').append("<div class='note' id='"+ noteID +"'><div class='handle'></div><textarea class='noteTextArea' placeholder='type here'></textarea></div>");
    $("#" + noteID).draggabilly({
                              containment: "#canvas",
                              handle: '.handle'
                            })  //these are the event listeners that make the socket.io work
                 .on('dragMove', drag)
                 .on('click', staticClick)
                 .css({
                        'top': (percentTop * canvasHeight),
                        'left': (percentLeft * canvasWidth)
                      })
                 .on('dragStart', function dragStart() {
                         //hide context-menu while moving
                         contextMenu.hide();
                         //lose selected note
                         contextMenu.data('selectedNote',-1);
                      })
                 .children('textarea')
                 .on('keypress', keyup)
                 .on('keyup', keyup);
  /*  $("#" + noteID).draggable({
                                containment: "#canvas",
                                snap: "#canvas",
                                snapMode: "inner",
                                opacity: 0.7
                            })  //these are the event listeners that make the socket.io work
                 .on('drag', drag)
                 .css({
                        'top': (percentTop * canvasHeight),
                        'left': (percentLeft * canvasWidth)
                      }); */
    queryLength();
  }

  socket.on('color', colorResponse);
  
  function colorResponse(data) {
    console.log(data.id);
    if(data.color) {
      $('#' + data.id.toString()).css('background', data.color.toString());
    }
  }
  
  socket.on('delete', deleteResponse);
  
  function deleteResponse(data) {
    $("#" + data.id.toString()).remove();
  }
  
  socket.on('size', sizeResponse);
  
  function sizeResponse(data) {
    if(data.size) {
      $("#" + data.id.toString()).css({
                                        //convert back to pixel
                                        height: (data.size.height * canvasWidth) / 100,
                                        width: (data.size.width * canvasWidth) / 100
                                      })
    }
  }
  
  socket.on('removeAll', removeAllResponse);
  function removeAllResponse() {
    console.log('removed all');
    $(".note").fadeOut(250, function(){
      $(this).remove;
    });
  }
  socket.on('user', userResponse);

  function userResponse(data) {
    console.log(data);
    //put something here that tells the user that a new user (with their name) is connecting
  }

  socket.on('session', function(data) {
    console.log(data);
    console.log('boobs');
    Avgrund.show("#update");
    update(data, updateCallback);

  })

  function update(data, callback) {
    var session = data;
        console.log(1);
    var publicTab = data.publicTab;
        console.log(2);
    var users = data.users;

    console.log(noteID);
    $(".note").remove();
    //noteID = 0;

    for(var i = 0; i < noteID; i++ ) {
        if(!(publicTab[i]['deleted'] == true)) {
          console.log('hey');
          console.log(publicTab[i])
          addNoteResponse(publicTab[i]);
          keyupResponse(publicTab[i]);
          sizeResponse(publicTab[i]);
          colorResponse(publicTab[i]);
        }
    }

    //fix callback later so that the update avgrund dialog only closes when eveyone is finished loading.
    callback();
  }
  function updateCallback() {

    //on update, everybody waits one second
    setTimeout(function() {
      Avgrund.hide();
    }, 1000);
  }

  function dragStart() {
    //hide context-menu while moving
    contextMenu.hide();
    //lose selected note
    contextMenu.data('selectedNote',-1);
  }
