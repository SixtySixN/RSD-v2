$(function() {
    $("button[data-col]").on("click", function() {
        var col = $(this).data("col");
        $(".col[data-col='" + col + "']").toggle();
    });
  })