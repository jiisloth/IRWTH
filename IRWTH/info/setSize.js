$(document).ready(function () {
    setSize();
    $("#container").show();
});


function setSize() {
    var size = 13;
    while ($("#size").width() <= $(window).width()){
        size += 1;
        $("#size").css('font-size', size + "px");
    }
    size -= 3;
    $("#size").css('font-size', size + "px");
    while ($("#size").height() * 24 > $(window).height()){
        size -= 1;
        $("#size").css('font-size', size + "px");
    }
    $("#container").width( $("#size").width() );
    $("body").css('font-size', size + "px");
}
/**
 * Created by jsloth on 16/08/17.
 */
