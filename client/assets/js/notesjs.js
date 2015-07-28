
//these values will change depending on the viewport/screen size
//LATER IMPLEMENT JQUERY on resize event listener
//to change these variables as the screen is resized.
var canvasWidth = document.documentElement.clientWidth,
    canvasHeight = document.documentElement.clientWidth * 0.52734;


function openDialog() {
  Avgrund.show( "#default-popup" );
}
function openSecondDialog() {
  Avgrund.show( "#second-popup" );
}
function closeDialog() {
  Avgrund.hide();
}
function appendText() {
  var Project = ("<a class='button' style='margin: 8px;'>Project</a><hr>")
  $("#test").append(Project);
}

$(document).ready( function(){
  var noteID = 0;
  var menuHeight = document.getElementById('menu').offsetHeight;
  var contextMenu = $("#context-menu");
  //hide context-menu if clicked anywhere else
  $(document).mouseup(function (e){
      // if the target of the click isn't the context-menu nor a descendant of the context-menu
      if (!contextMenu.is(e.target) && contextMenu.has(e.target).length === 0 && contextMenu.is(':visible')){
        contextMenu.hide();
        //lose data of selected note
        contextMenu.data('selectedNote',-1);
      }
  });

  //delete specific note
  $("#delete").click(function(){
    $("#"+contextMenu.data("selectedNote")).remove();
    contextMenu.hide();
    contextMenu.data('selectedNote',-1);
  });

  $("#addNote, .add").click(function(){
    $("#removeAll").data("cancel",true);
    $("#addNote").hide();

    $("#canvas").prepend("<h2 id='add-to-canvas'>Add your note to the blank space. </h2>");

    //here we will emit the add event
    $("#canvas").on("click", initializeNote);
  });

  $("#removeAll").click(function(){
    if (!($("#removeAll").data("cancel"))) {
      $(".note").remove();
      noteID = 0;
    }else{
      $("#canvas").off("click");
      $("#add-to-canvas").remove();

      //here we emit the remove event
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

    /*$("#canvas").append("<div class='note' id='" + noteID + "'></div>")
                .child("#" + noteID)
                .css({
                        'top' : newTop + "px",
                        'left' : newLeft + "px"
                      });*/

                /*      $("<div></div>").appendTo("#canvas")
                                       .attr('id', noteID)
                                       .addClass('note')
                                       .css({
                                               'top' : newTop + "px",
                                               'left' : newLeft + "px"
                                             })
                                       .append("<div class='handle'><form><div class='row'><div><label><div class='noteTitle'>Sticky Note</div> <textarea placeholder='type here'></textarea></label></div></div></form></div>")
                                       ;
  /*  $("<form><div class='row'><div class='large-12 columns'><label><div class='noteTitle'>Sticky Note</div> <textarea placeholder='type here'></textarea></label></div></div></form>")
          .appendTo('#' + noteID)
          .child('textarea')
          .on('click', function() {
            event.stopPropogation();
          });
  */

  $("#" + noteID).draggabilly({
                            containment: "#canvas",
                            handle: '.handle'
                          })   //these are the event listeners that make the socket.io work
                 .on('dragMove', drag)
                 .on('staticClick', staticClick)
                 //more event listeners
                 .on('staticClick',function(){
                   //determine if context-menu should be displayed on the left or on the right
                   if ($(this).position().left+$(this).width()+contextMenu.width()>=$('#canvas').width()){
                     contextMenu.css('left',$(this).position().left-contextMenu.width());
                   }else{
                     contextMenu.css('left',$(this).position().left+$(this).width());
                   }
                   //get top position and show
                   contextMenu.css('top', $(this).position().top).show();
                   //remember selected note if opened
                   contextMenu.data('selectedNote',$(this).attr('id'));
                 })
                 .on('dragStart',function(){
                   //hide context-menu while moving
                   contextMenu.hide();
                   //lose selected note
                   contextMenu.data('selectedNote',-1);
                 });


    $("#canvas").off("click");
    $("#add-to-canvas").remove();
    $("#addNote").show();
    $("#removeAll").data("cancel", false);
    //emit addNote event
    console.log(percentLeft, percentTop, noteID);
    addNote(percentLeft, percentTop, noteID);
    noteID++

  }
});
