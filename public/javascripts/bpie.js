$(document).ready(function(){
function sliceSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}

function addSlice(id, sliceSize, pieElement, offset, sliceID, color) {
  $(pieElement).append("<div class='slice "+ sliceID + "'><span></span></div>");
  var offset = offset - 1;
  var sizeRotation = -179 + sliceSize;

  $(id + " ." + sliceID).css({
    "transform": "rotate(" + offset + "deg) translate3d(0,0,0)"
  });

  $(id + " ." + sliceID + " span").css({
    "transform"       : "rotate(" + sizeRotation + "deg) translate3d(0,0,0)",
    "background-color": color
  });
}

function iterateSlices(id, sliceSize, pieElement, offset, dataCount, sliceCount, color) {
  var
    maxSize = 179,
    sliceID = "s" + dataCount + "-" + sliceCount;

  if( sliceSize <= maxSize ) {
    addSlice(id, sliceSize, pieElement, offset, sliceID, color);
  } else {
    addSlice(id, maxSize, pieElement, offset, sliceID, color);
    iterateSlices(id, sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
  }
}

function createPie(id) {
  var
    listData      = [],
    listTotal     = 0,
    offset        = 0,
    i             = 0,
    pieElement    = id + " .pie-chart__pie"
    dataElement   = id + " .pie-chart__legend"

    color         = [
      "cornflowerblue",
      "olivedrab",
      "orange",
      "tomato",
      "crimson",
      "purple",
      "turquoise",
      "forestgreen",
      "navy"
    ];

  color = shuffle( color );

  $(dataElement+" span").each(function() {
    listData.push(Number($(this).html()));
  });

  for(i = 0; i < listData.length; i++) {
    listTotal += listData[i];
  }

  for(i=0; i < listData.length; i++) {
    var size = sliceSize(listData[i], listTotal);
    iterateSlices(id, size, pieElement, offset, i, 0, color[i]);
    $(dataElement + " li:nth-child(" + (i + 1) + ")").css("border-color", color[i]);
    offset += size;
  }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }

    return a;
}

function createPieCharts() {
  createPie('.pieID--aecbranches' );
  createPie('.pieID--acebranches' );
  createPie('.pieID--acetbranches' );
  createPie('.pieID--acoebranches' );
  createPie('.pieID--aeccse' );
  createPie('.pieID--aecece' );
  createPie('.pieID--aeceee' );
  createPie('.pieID--aecce' );
  createPie('.pieID--aecme' );
  createPie('.pieID--aecit' );
  createPie('.pieID--aecage' );
  createPie('.pieID--aecpt' );
  createPie('.pieID--acetcse' );
  createPie('.pieID--acetece' );
  createPie('.pieID--aceteee' );
  createPie('.pieID--acetce' );
  createPie('.pieID--acetme' );
  createPie('.pieID--acetit' );
  createPie('.pieID--acetmca' );
  createPie('.pieID--acetpt' );
  createPie('.pieID--acoecse' );
  createPie('.pieID--acoeece' );
  createPie('.pieID--acoeeee' );
  createPie('.pieID--acoece' );
  createPie('.pieID--acoeme' );
  createPie('.pieID--acoeit' );
  createPie('.pieID--acoemca' );
  createPie('.pieID--acoept' );
}

createPieCharts();
});