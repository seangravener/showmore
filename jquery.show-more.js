/*!
 * Show More
 * (c) 2013 Sean Gravener
 * http://twitter.com/seangravener
 * 
 * Usage:

    $('#container').showMore( options );
 
 */

// create closure
;(function($, undefined){

  $.fn.showMore = function( options ) {

    var 

      // globals
      $html = {},
      
      defaults = {
        
        // the limit per update
        limit: 3,
        
        // use offset to ignore header row?
        offset: 0,

        // the selector to indicate a row
        rowTag: 'tr',

        // clicked to shore more
        smSelector: '.sm--show-more',

        // do something when update is complete
        complete: function() {}

      },
     
      // merge custom options/settings with defaults
      settings        = $.extend( defaults, options );
      settings.limit  = settings.limit + settings.offset;

    var init = {

      setup: function( $rows, limit ) {

        $html.dom.attr('data-sm-rows-total', $rows.length );
        $html.dom.attr('data-sm-rows-displayed', limit );
       
        var trigger  = init.trigger( settings.smSelector ),
            $newHtml = update.rows( $rows, limit, true );

        callback ( 'complete', $html.dom, $newHtml );
        
      },

      trigger: function( selector ) {

        $( selector ).on('click', function(e) {

          var rowsTotal     = $html.dom.data('sm-rows-total'),
              rowsDisplayed = $html.dom.attr('data-sm-rows-displayed');

          var limit         = +rowsDisplayed + settings.limit - settings.offset,
              $newHtml      = update.rows( $html.rows, limit, false );

          e.preventDefault();

          callback ( 'complete', this, $newHtml );

        });

      }

    }

    var update = {

      rows: function( $rows, limit, init ) {

        var rowsTotal     = $html.dom.data('sm-rows-total'),
            rowsDisplayed = $html.dom.data('sm-rows-displayed'),
            newHtml       = {};

        init = init || false;

        if ( !init && limit <= $html.rows.length ) {
          $html.dom.attr('data-sm-rows-total', $rows.length );
          $html.dom.attr('data-sm-rows-displayed', limit );
        }

        // update the dom
        newHtml = $rows.slice( 0, limit );
        $html.dom.html( newHtml );

        return $( newHtml );

      }

    };

    var callback = function ( func, object, $data ) {
      settings[ func ].call( object, $data );
    };

    return this.each ( function () {
      
      var $this   = $(this);

      $html.dom   = $this;
      html        = $this.html();
      $html.rows  = $( html ).find( settings.rowTag );

      var success = init.setup( $html.rows, settings.limit );

    });

  }

})(jQuery);