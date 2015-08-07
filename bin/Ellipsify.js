
/**
 * Search Ellipsify menues
 *
 * @module package/quiqqer/template-qui/bin/js/Ellipsify
 * @require css!package/quiqqer/template-qui/bin/js/Ellipsify.css
 */
define('package/quiqqer/template-qui/bin/js/Ellipsify', [
    'css!package/quiqqer/template-qui/bin/js/Ellipsify.css'
], function()
{
    "use strict";

    return {

        parse : function(Parent)
        {
            if (typeof Parent === 'undefined') {
                Parent = document.body;
            }

            var i, len, Elm, size, scroll;
            var elements = Parent.getElements('.ellipsify');

            for (i = 0, len = elements.length; i < len; i++)
            {
                Elm    = elements[i];
                scroll = Elm.getScrollSize();
                size   = Elm.getSize();

                if (scroll.y > size.y) {
                    Elm.addClass('ellipsify-active');
                }
            }
        }
    };
});
