$(document).ready(function() {
  //initialize socket.io on the clientside
  var socket = io();

  $('.ui-widget-content').draggable({
                            containment: "parent"
                          })
                         .on('drag', function(event, ui) {

                               // --OPTIMIZATION NOTE--
                               //later create the ability to append an array of notes
                               //so that we can refer to that note

                               var note = $(this);

                               //make sure you can see the clicked note
                               note.css('z-index', '2').siblings().css('z-index', '0');

                               console.log({
                                 id : note.attr('id'), position : ui.position
                               });
                               socket.emit('move', {
                                 id : note.attr('id'), position : ui.position
                               });

                         }).on('click', function(event) {

                               // --OPTIMIZATION NOTE--
                               //later create the ability to append an array of notes
                               //so that we can refer to that note

                               var note = $(this);

                               //make sure you can see the clicked note
                               note.css('z-index', '2').siblings().css('z-index', '0');
                         });

  //have the clientside socket listen to
  //the 'move' event
  //every time it gets the position of the note,
  //transform its position.

  //data is going to be an object looking like this:
  //data {  id, position :{ left: x, top: y}  }

  socket.on('move', function(data) {
    var id = data.id,
        positionX = data.position.left,
        positionY = data.position.top;


    //BUG FIX
    //add a 'click' socket message event
    //For every JQuery event listener
    //make a corresponding socket


    // --OPTIMIZATION NOTE--
    //later create the ability to append an array of notes
    //so that we can refer to that note

    $('#' + data.id.toString()).css('transform', 'translate(' + positionX + 'px ,' + positionY + 'px)');
  });

});