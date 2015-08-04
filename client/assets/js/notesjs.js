
//these values will change depending on the viewport/screen size
//LATER IMPLEMENT JQUERY on resize event listener
//to change these variables as the screen is resized.
var canvasWidth = document.documentElement.clientWidth,
    canvasHeight = document.documentElement.clientWidth * 0.52734;
var menuHeight = document.getElementById('menu').offsetHeight;
var contextMenu = $("#context-menu");
var noteID;
var socket = io();
//get the # of notes from the backend
function queryLength() {
  socket.emit('queryLength', {});
}
//when we get our response, change the value of noteID.
socket.on('queryLength', function(data) {
  //set noteID to be the value of publicTab.length
  noteID = data;
})

function appendText() {
  var Project = ("<a class='button' style='margin: 8px;'>Project</a><hr>")
  $("#test").append(Project);
}
function username() {
  Avgrund.show("#username");
}

$(document).mouseup(function (e){
    // if the target of the click isn't the context-menu nor a descendant of the context-menu
    if (!contextMenu.is(e.target) && contextMenu.has(e.target).length === 0 && contextMenu.is(':visible')){
      contextMenu.hide();
      //lose data of selected note
      contextMenu.data('selectedNote',-1);
    }
});


$(document).ready( function(){


  //instead of calling noteID++, we need to call queryLength so that
  //it gets the value from the backend. Using a local variable means
  //every connected client may have difference values for noteID,
  //which causes bugs.

  //CALL queryLength , DO NOT DO noteID++
  queryLength();
  username();
  
  $("#Okay").click(function() {
    username = $('#username').children('form').children('input').val();
    socket.emit('user', username);
    console.log( $('#username').children('form').children('input').val());
    Avgrund.hide();
  });
  // $(document).mouseup(function (e){
  //     // if the target of the click isn't the context-menu nor a descendant of the context-menu
  //     if (!contextMenu.is(e.target) && contextMenu.has(e.target).length === 0 && contextMenu.is(':visible')){
  //       contextMenu.hide();
  //       //lose data of selected note
  //       contextMenu.data('selectedNote',-1);
  //     }
  // });

  //delete specific note
  $("#delete").click(function(){
    $("#"+contextMenu.data("selectedNote")).fadeOut(250,function(){
      $(this).remove();
    });
    contextMenu.hide();
    contextMenu.data('selectedNote',-1);
  });

  //enable resizing
  $("#resize").click(function(){
    var selectedNote = $("#"+contextMenu.data("selectedNote"));
    selectedNote.css('resize','both');
    //disable dragging the note
    selectedNote.children('.handle').css('width','0%').css('height','0%');
    contextMenu.hide();
    contextMenu.data('selectedNote',-1);
    //embrace the darkness
    $('#dark-screen').fadeIn(250);
    //if you click the darkness everything should return to normal
    $('#dark-screen').click(function(){
      $(this).fadeOut(250);
      selectedNote.css('resize','none');
      selectedNote.children('.handle').css('width','100%').css('height','100%');
    });
  });

  $("#addNote, .add").click(function(){
    $("#removeAll").data("cancel",true);
    $("#addNote").hide();
    $('#dark-screen').css('z-index','3').fadeIn(250);
      $("#canvas").prepend("<h2 id='add-to-canvas'>Add your note to the blank space. </h2>");
      //here we will emit the add event
      $("#canvas").on("click", initializeNote);
  });

  $("#removeAll").click(function(){
    if (!($("#removeAll").data("cancel"))) {
      $(".note").fadeOut(250, function(){
        $(this).remove;
      })
      noteID = 0;

      //^^fix this later, it won't work anymore.
    } else {
      $("#canvas").off("click");
      $("#add-to-canvas").remove();
      $('#dark-screen').fadeOut(250);
      $("#addNote").show();
      $("#removeAll").data("cancel",false);
    }
  });



  function initializeNote(e) {

    //get position of the mouse
    var newTop = e.pageY,
        newLeft = e.pageX;


    console.log(newTop + ',' + newLeft);

    var percentTop = ((newTop - menuHeight) / canvasHeight),
        percentLeft = (newLeft / canvasWidth);

    console.log(percentTop);
    console.log(percentLeft);
    newTop = newTop - menuHeight;
      
      $('#canvas').append("<div class='note' id='"+ noteID +"' style = 'top:" + newTop + "px; left:" + newLeft + "px'><div class='handle'></div><textarea class='noteTextArea' placeholder='type here'></textarea></div>");


      //initialize draggabilly so that it reacts on all screens
      $("#" + noteID).draggabilly({
                                containment: "#canvas",
                                handle: '.handle'
                              })   //these are the event listeners that make the socket.io work
                     .on('dragMove', drag)
                     .on('staticClick', staticClick)
                     .on('dragStart', function dragStart() {
                         //hide context-menu while moving
                         contextMenu.hide();
                         //lose selected note
                         contextMenu.data('selectedNote',-1);
                       })
                     .children('textarea')
                     .on('keypress', keyup)
                     .on('keyup', keyup);


        $("#canvas").off("click");
        $("#add-to-canvas").remove();
        $("#addNote").show();
        $("#removeAll").data("cancel", false);
        $("#dark-screen").fadeOut(250);
        //emit addNote event
        console.log(percentLeft, percentTop, noteID);
        addNote(percentLeft, percentTop, noteID);

        console.log(noteID);

        queryLength();
     
    
  }
});


// Prevent the backspace key from navigating back.
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && 
             (
                 d.type.toUpperCase() === 'TEXT' ||
                 d.type.toUpperCase() === 'PASSWORD' || 
                 d.type.toUpperCase() === 'FILE' || 
                 d.type.toUpperCase() === 'EMAIL' || 
                 d.type.toUpperCase() === 'SEARCH' || 
                 d.type.toUpperCase() === 'DATE' )
             ) || 
             d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }

    if (doPrevent) {
        event.preventDefault();
    }
});
