(function($) { // Quiz validation
  $(function() {

      // This class must be attached to the form element
      var article_quiz = $('.article-quiz');

      // If quiz rendered
      if ( article_quiz.length ) {

        // Hide submit button to prevent default validation from gravity forms
        article_quiz.find('input[type="submit"]').css('display','none');

        var form_body = article_quiz.find('.gform_body'),
            list_items = form_body.find('li.gfield li');

        // Watch items
        list_items.click(function() {

          var $validation = true, sibs = 0,
              choice = $(this).find('input')[0].value,
              answer = choice.substr(0, choice.indexOf('-')), // get cf or wf
              parent = $(this).closest('li.gfield'), // get parent to add class as needed
              elemType = $(this).find('input').attr('type'); // Condition for checkbox option

          // Check single item state
          if ( answer == 'wf' ) { // Field - wrong
            parent.removeClass('wrong-answer correct-answer review-answer').addClass('wrong-answer');
            if ( $(this).find('input').prop('checked') == false ) { // If wrong answer unchecked and a correct sibiling is checked and labeled correct
              parent.removeClass('wrong-answer correct-answer review-answer').addClass('correct-answer');
            }
          } else if ( answer == 'cf' ) { // Field - correct
            parent.removeClass('wrong-answer correct-answer review-answer').addClass('correct-answer');
            article_quiz.find('input[type="submit"]').attr('disabled',false);
          }

          // Because they can be unchecked
          if ( elemType === 'checkbox' ) {

            var checkboxes = $(this).siblings(),
                total = checkboxes.length + 1;

             // Check sibiling checkbox state
             checkboxes.each(function() {
               var sib_input = $(this).find('input').val(),
                   field = sib_input.substr(0, sib_input.indexOf('-'));

               // Accumulate total sibilings
               if ( !$(this).find('input').is(':checked') ) {
                 sibs++;
               }

               // If wrong answer is checked when correct answer is checked
               if ( field == 'wf' && $(this).find('input').is(':checked') ) {
                 article_quiz.find('input[type="submit"]').css('display','none');
                 parent.removeClass('wrong-answer correct-answer review-answer').addClass('wrong-answer');
               }

             });

             // Check current checkbox
             if ( !$(this).find('input').is(':checked') ) {
               sibs++;
             }

             // None are checked
             if (sibs === total) {
               article_quiz.find('input[type="submit"]').css('display','none');
               parent.removeClass('wrong-answer correct-answer').addClass('review-answer');
             }
          }

          // Make sure all items are answered correctly
          list_items.each(function() {
            var parent = $(this).closest('li.gfield');
            if ( parent.hasClass('wrong-answer') || !parent.hasClass('correct-answer') ) {
              article_quiz.find('input[type="submit"]').css('display','none');
              $validation = false;
              return false;
            }
          });

          // If all items are answered correctly
          if ( parent.hasClass('correct-answer') && $validation ) {
            article_quiz.find('input[type="submit"]').css('display','block');
          }

        });

      }
  });
})(jQuery);