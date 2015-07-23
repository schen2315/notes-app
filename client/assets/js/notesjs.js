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
  var menuHeight = document.getElementById('menu').offsetHeight;

  $("#addNote").click(function(){
    $("#removeAll").data("cancel",true);
    $("#addNote").hide();
    $("#canvas").prepend("<h2 id='add-to-canvas' style='position:absolute;z-index:3'>Add your note to the blank space. </h2>");
    
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
  
  //dude organize this mess
  //make seperate functions
  
  
  
  
  
  function initializeNote(e) {
    var newTop = e.pageY-menuHeight;
    var newLeft = e.pageX;
    if (newTop+140 >= $(window).height()-menuHeight){
      newTop = $(window).height()-menuHeight-200;
    }
    if (newLeft+140 >= $(window).width()){
      newLeft = $(window).width()-200;
    }
    $("#canvas").append("<div class='note' style='transform:translate(" + newLeft + "px ," + newTop + "px)' id='" + noteID + "'><div class='noteTitle'>Sticky Notes</div><textarea class='noteTextArea' placeholder='Text Here...'></textarea></div>");
    
    
    $("#" + noteID).draggable({
                              containment: "#canvas",
                              opacity: 0.7
                            })  //these are the event listeners that make the socket.io work
                 .on('drag', drag)
                 .on('click', staticClick);
              
  
    $("#canvas").off("click");
    $("#add-to-canvas").remove();
    $("#addNote").show();
    $("#removeAll").data("cancel", false);
    //emit addNote event
    console.log(newLeft, newTop, noteID);
    addNote(newLeft, newTop, noteID);
    noteID++

  }
});