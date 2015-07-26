
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


// problems right now:
// fix the entire code

$(document).ready( function(){
  var noteID = 0;
  
  
  
  //var menuHeight = document.getElementById('menu').offsetHeight;

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

  // making textareas in notes able to be focused on mobile devices
  // this code is a placeholder for now
  

  //dude organize this mess
  //make seperate functions





  function initializeNote(e) {
    
    //what does this mean?????
    var newTop = e.pageY,
        newLeft = e.pageX;
    
    
    console.log(newTop + ',' + newLeft);
    
    var percentTop = ((newTop /*- menuHeight*/) / canvasHeight),
        percentLeft = (newLeft / canvasWidth);
    
    console.log(percentTop);
    console.log(percentLeft);
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
                 .on('staticClick', staticClick);
                 
                

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
