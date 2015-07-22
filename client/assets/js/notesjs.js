// problems right now:
// fix the entire code

$(document).ready( function(){
  var noteID = 0;
  var menuHeight = document.getElementById('menu').offsetHeight;

  $("#addNote").click(function(){
    $("#removeAll").data("cancel",true);
    $("#addNote").hide();
    $("#canvas").prepend("<h1 id='add-to-canvas'>Add your note to the blank space. </h1>");
    $("#canvas").on("click",function(e){
      var newTop = e.pageY-menuHeight;
      var newLeft = e.pageX;
      if (newTop+140 >= $(window).height()-menuHeight){
        newTop = $(window).height()-menuHeight-200;
      }
      if (newLeft+140 >= $(window).width()){
        newLeft = $(window).width()-200;
      }
      $("#add-to-canvas").after("<div class='note' style='top:"+newTop+"px; left:"+newLeft+"px;' id='"+noteID+"'><div class='noteTitle'>Sticky Notes</div><textarea class='noteTextArea' placeholder='Text Here...'></textarea></div>");
      $("#"+noteID).draggable({
        containment: "#canvas",
        opacity: 0.7
      });
      noteID++;
      $("#canvas").off("click");
      $("#add-to-canvas").remove();
      $("#addNote").show();
      $("#removeAll").data("cancel",false);
    });
  });

  $("#removeAll").click(function(){
    if (!($("#removeAll").data("cancel"))) {
      $(".note").remove();
      noteID = 0;
    }else{
      $("#canvas").off("click");
      $("#add-to-canvas").remove();
      $("#addNote").show();
      $("#removeAll").data("cancel",false);
    }
  });
});