function scrollToReviews() {
    // Check if the review section is visible
    var reviewSection = $('#review_title');
    if (reviewSection.is(':visible')) {
        // If the review section is visible, scroll to it
        $('html, body').animate({
            scrollTop: reviewSection.offset().top
        }, 800);
    } else {
        // If the review section is hidden, scroll to the "Reviews" button
        var reviewButton = $('#review');
        $('html, body').animate({
            scrollTop: reviewButton.offset().top
        }, 800);
    }
}












