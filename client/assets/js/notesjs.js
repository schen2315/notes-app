
//these values will change depending on the viewport/screen size
//LATER IMPLEMENT JQUERY on resize event listener
//to change these variables as the screen is resized.
var canvasWidth = document.documentElement.clientWidth,
    canvasHeight = document.documentElement.clientWidth * 0.3;
console.log(document.documentElement.clientWidth, document.documentElement.clientHeight);
var menuHeight = $("#menu").height(); //remember, this only works for large
                                      //make it work on all sizes LATER
console.log(menuHeight);
var contextMenu = $("#context-menu");
var colorPicker = $('#color-picker');
var selectedNote;
var noteID;
var socket = io();
function calibrate() {
  canvasWidth = document.documentElement.clientWidth;
  canvasHeight = document.documentElement.clientWidth * 0.41666;
  console.log(canvasWidth, canvasHeight);
  socket.emit('window', {});
}
var resize = _.debounce(calibrate, 100);

socket.on('window', function(data) {
  console.log(data);
  
  for( var i=0; i < noteID; i++) {
    $("#" + i).css({'top': ((data[i].CoordY || data[i].position.top) * canvasHeight), 'left': (data[i].CoordX || data[i].position.left) * canvasWidth})
    //console.log(data[i].CoordY * canvasHeight);
  }
})
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

$(window).on('resize', resize);

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

  //doubletap canvas to initialize a new note
   $("#canvas").bind('doubletap', function(e, touch) {
    var pos = {};
    console.log(touch)
        pos.pageY = (touch.firstTap.offset.y /*+ menuHeight*/);
        console.log(pos)
        console.log(menuHeight);
        pos.pageX = touch.firstTap.offset.x;
    initializeNote(pos);
   });
  //change color of note
  $("#customize").click(function(){
    //open color-picker and set position of color-picker
    colorPicker.show().css('left', contextMenu.position().left).css('top', contextMenu.position().top);
    selectedNote = $("#"+contextMenu.data("selectedNote"));
    //disable dragging the note
    selectedNote.children('.handle').css('width','0%').css('height','0%');
    contextMenu.hide();
    contextMenu.data('selectedNote',-1);
    //click color
    $("#color-picker div").click(function(){
      selectedNote.css('background',$(this).attr('id'));
    });
    //embrace the darkness
    $('#dark-screen').fadeIn(250);
    //if you click the darkness everything should return to normal
    $('#dark-screen').click(function(){
      $(this).fadeOut(250);
      colorPicker.hide();
      selectedNote.children('.handle').css('width','100%').css('height','100%');
    });
  });

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
    selectedNote = $("#"+contextMenu.data("selectedNote"));
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

  $(".addNote, .add").click(function(){
    $("#removeAll").data("cancel",true);
    $(".addNote").hide();
    $('#dark-screen').css('z-index','3').fadeIn(250);
      $("#canvas").prepend("<h2 id='add-to-canvas'>Add your note to the blank space. </h2>");
      //here we will emit the add event
      
      //get coordinates
      
      var parentOffset = $(this).parent().offset();
      var e = {};
      e.pageX = 
      $("#canvas").on("click",function(e) {
        
          var parentOffset = $(this).parent().offset();
          e.pageX = e.pageX - parentOffset.left;
          e.pageY = e.pageY - parentOffset.top;
          initializeNote(e);
      });
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
      $(".addNote").show();
      $("#removeAll").data("cancel",false);
    }
  });

  // $("#canvas").dblclick(function(e) {
  //     initializeNote(e)
  // });

  function initializeNote(e) {

    
    
    //get position of the mouse
    var newTop = e.pageY,
        newLeft = e.pageX;


    console.log(newTop + ',' + newLeft);

    var percentTop = ((newTop /*- menuHeight*/) / canvasHeight) ,
        percentLeft = (newLeft / canvasWidth);

    console.log(percentTop);
    console.log(percentLeft);

     newTop = newTop /*- menuHeight*/;

      
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
        $(".addNote").show();
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
