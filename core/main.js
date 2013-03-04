function initTypeahead() {
  $(".portlet .resource-widget").typeahead({
    source: ['foaf:Person', 'foo', 'bar'],
    highlighter: function(item) {
        if(item === 'foaf:Person') {
          return '<div><p>' + item + '</p><p>http://xmlns.com/foaf/0.1/Person</p></div>';
        }
        return '<div><p>' + item + '</p><p>http://foo.bar</p></div>';
    }
  });

}

$(document).ready(function() {
  initTypeahead();

  $('.portlet-container').sortable().disableSelection();


  // $( ".portlet" )
    // .addClass( "ui-widget ui-widget-content ui-corner-all" )
    // .find( ".portlet-header" )
    // .addClass( "ui-widget-header ui-corner-all" )
    // .prepend( "<span class='ui-icon ui-icon-minusthick'></span>")
    // .end()
    // .find( ".portlet-content" );

  $('.portlet .actionbar .icon-arrow-up').click(function(event) {
    event.preventDefault();
    $(this).toggleClass('icon-arrow-up').toggleClass('icon-arrow-down');
    $(this).parents('.portlet:first').toggleClass('portlet-minimized');
  });

  $('.portlet .actionbar .icon-trash').click(function(event) {
    event.preventDefault();
    $(this).parents('.portlet:first').fadeOut(400, function() {
      $(this).remove();
    });
  });

  $('.portlet .actionbar .icon-plus-sign').click(function(event) {
    event.preventDefault();
    $('#addProperty').modal('show');
  });

  $( ".portlet-content" ).sortable({
    conectWith: '.portlet-container'
  }).disableSelection();

  $('[rel=tooltip]').tooltip();

  
  $(document).on('click', '.portlet .btn', function() {
      var controlGroup = $(this).parents('.control-group');
      var btnMarkup = '<div style="display: none;" class="line input-prepend input-append">\
            <span class="add-on">\
              <i class="icon-bookmark" ></i></button>\
            </span><input type="text" placeholder="start typing..." value="" class="input resource-widget"><button class="btn" type="button"><i class="icon-plus-sign" ></i></button><button class="btn" type="button"><i class="icon-minus-sign" ></i></button>\
        </div>';
      if($(this).find('i').hasClass('icon-plus-sign')) {
        $(this).parent('div').parent().append(btnMarkup);
        $(this).parent('div').parent().find('div:last').fadeIn(function() {
          initTypeahead();
        });
      }
      if($(this).find('i').hasClass('icon-minus-sign')) {
        if($(this).parents('.portlet-entry').find('input').length === 1) {
          $(this).parents('.portlet-entry').fadeOut(function() {
            $(this).parents('.portlet-entry').remove();
          });
        } else {
          $(this).parent().fadeOut(function() {
            $(this).remove();
          });
        }
      }
  }); 
    
  $(document).on('click', '#btn-addProperty', function() {
      console.log('test');
      var markup = '<div data-content="foo:bar" class="portlet-entry">\
                <div class="control-group">\
                  <!-- <label class="control-label">foo:bar</label> -->\
                  <div class="controls">\
                    <div class="line input-prepend input-append">\
                      <span class="add-on">\
                        <i class="icon-bookmark"></i>\
                      </span><input type="text" value="Add Foo Bar Test" class="input resource-widget"><button class="btn" type="button"><i class="icon-plus-sign"></i></button><button class="btn" type="button"><i class="icon-minus-sign"></i>\
                    </button></div>\
                  </div>\
                </div>\
              </div>';
    $('.portlet:first .portlet-content').append(markup);
    $('#addProperty').modal('toggle');
  });
  // $( ".portlet-entry" )
    // .addClass( "ui-widget ui-widget-content ui-corner-all" )
    // .find( ".portlet-header" )
    // .addClass( "ui-widget-header ui-corner-all" )
    // .prepend( "<span class='ui-icon ui-icon-minusthick'></span>")
    // .end()
    // .find( ".portlet-content" );


  // $('.group').draggable({
    // // containment: ".group-parent",
    // distance: 20,
    // snap: ".group-parent",
    // grid: [ 10, 10]
  // });
});
