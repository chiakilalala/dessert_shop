
// items heart selector event
$(document).ready(function(){
    $('.like').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('click');
    })

    $('.navbar-btn').on('click', function(e) {
        e.preventDefault();
        $('body').toggleClass('navbar-show');
    })
})