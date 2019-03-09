$(document).ready(function(){

    $('.get').click(function(){
      var id = $('.rollno').val();
      $.post('/getgraph',{num:id}, function(data, jqXHR){
        //alert(data);
        var json = JSON.stringify(data);
        //alert(json);
        var parse = JSON.parse(json);
        //alert(parse);
        var score = parse[0].Score;
        //alert(score);
        var english = parse[0].English;
        var quantitative = parse[0].Quantitative;
        var analytical = parse[0].Analytical;
        var domain = parse[0].Domain;
        var coding = parse[0].Coding;
        var written = parse[0].WrittenEnglish;
        $('.score').html(score);
        $('.english').html(english);
        $('.quantitative').html(quantitative);
        $('.analytical').html(analytical);
        $('.domain').html(domain);
        $('.coding').html(coding);
        $('.written').html(written);


        // Graph
        createPie(".pieID.legend", ".pieID.pie");          

        });
      $('.click').show();
    });

    function sliceSize(dataNum, dataTotal) {
      return (dataNum / dataTotal) * 360;
    }
    function addSlice(sliceSize, pieElement, offset, sliceID, color) {
      $(pieElement).append("<div class='slice "+sliceID+"'><span></span></div>");
      var offset = offset - 1;
      var sizeRotation = -179 + sliceSize;
      $("."+sliceID).css({
        "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
      });
      $("."+sliceID+" span").css({
        "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
        "background-color": color
      });
    }
    function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
      var sliceID = "s"+dataCount+"-"+sliceCount;
      var maxSize = 179;
      if(sliceSize<=maxSize) {
        addSlice(sliceSize, pieElement, offset, sliceID, color);
      } else {
        addSlice(maxSize, pieElement, offset, sliceID, color);
        iterateSlices(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
      }
    }
    function createPie(dataElement, pieElement) {
      var listData = [];
      $(dataElement+" span").each(function() {
        //alert($(this).html());
        listData.push(Number($(this).html()));
      });
      var listTotal = 0;
      for(var i=0; i<listData.length; i++) {
        listTotal += listData[i];
      }
      var offset = 0;
      var color = [
        "cornflowerblue", 
        "olivedrab", 
        "orange", 
        "tomato", 
        "crimson", 
        "purple", 
        "turquoise", 
        "forestgreen", 
        "navy", 
        "gray"
      ];
      for(var i=0; i<listData.length; i++) {
        var size = sliceSize(listData[i], listTotal);
        iterateSlices(size, pieElement, offset, i, 0, color[i]);
        $(dataElement+" li:nth-child("+(i+1)+")").css("border-color", color[i]);
        offset += size;
      }
    }
  
});