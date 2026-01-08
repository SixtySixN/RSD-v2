var thumbWidth = 80, thumbHeight =70 ;

    function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#logo')
                        .attr('src', e.target.result)
                        .width(thumbWidth)
                        .height(thumbHeight);
                };

                reader.readAsDataURL(input.files[0]);
            }
        }