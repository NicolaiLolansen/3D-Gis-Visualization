var firstClick = true;

$('.obs').click(function () {
    if (firstClick) {
        if (confirm("You will only be able to view projects, but not edit them. Continue?")) {
            $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
        }
    }
});