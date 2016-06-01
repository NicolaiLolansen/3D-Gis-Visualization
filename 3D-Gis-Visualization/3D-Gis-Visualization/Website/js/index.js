var firstClick = true;

$('.obs').click(function () {
    if (firstClick) {
        if (confirm("You will only be able to view projects, but not edit them. Continue?")) {
            firstClick = false;
            $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
        } 
    } else {
        $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
    }
});