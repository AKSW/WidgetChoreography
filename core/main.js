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
  $('#rdfauthor-view').resizable().draggable({
    handle: '.modal-header',
    cursor: 'move'
  }).modal('show');
  $('.portlet-container').sortable().disableSelection();



  // markItUp settings
  var markItUpSettings = {
    nameSpace: 'markdown', // Useful to prevent multi-instances CSS conflict
    onShiftEnter: {keepDefault:false, openWith:'\n\n'},
    returnParserData: function(data){
      //added new callback in markItUp to use json markdown parser (in this case: showdown)
      return self._converter.makeHtml(data);
    },
    markupSet: [
      // {name:'First Level Heading', key:"1", placeHolder:'Your title here...',
      // closeWith:function(markItUp) { return self._miu.markdownTitle(markItUp, '=') } },
      // {name:'Second Level Heading', key:"2", placeHolder:'Your title here...',
      // closeWith:function(markItUp) { return self._miu.markdownTitle(markItUp, '-') } },
      // {name:'Heading 3', key:"3", openWith:'### ', placeHolder:'Your title here...' },
      // {name:'Heading 4', key:"4", openWith:'#### ', placeHolder:'Your title here...' },
      // {name:'Heading 5', key:"5", openWith:'##### ', placeHolder:'Your title here...' },
      // {name:'Heading 6', key:"6", openWith:'###### ', placeHolder:'Your title here...' },
      // {separator:'---------------' },
      {name:'Bold', key:"B", openWith:'**', closeWith:'**'},
      {name:'Italic', key:"I", openWith:'_', closeWith:'_'},
      {separator:'---------------' },
      {name:'Bulleted List', openWith:'- ' },
      {name:'Numeric List', openWith:function(markItUp) {
        return markItUp.line+'. ';
      }},
      {separator:'---------------' },
      {name:'Picture', key:"P", replaceWith:'![[![Alternative text]!]]([![Url:!:http://]!] "[![Title]!]")'},
      {name:'Link', key:"L", openWith:'[', closeWith:']([![Url:!:http://]!] "[![Title]!]")',
       placeHolder:'Your text to link here...' },
      // {separator:'---------------'},
      // {name:'Quotes', openWith:'> '},
      // {name:'Code Block / Code', openWith:'(!(\t|!|`)!)', closeWith:'(!(`)!)'},
      {separator:'---------------'},
      {name:'Preview', call:'preview', className:"preview"}
    ]
  };

  $("#markItUp").markItUp(markItUpSettings);
  // $( ".portlet" )
    // .addClass( "ui-widget ui-widget-content ui-corner-all" )
    // .find( ".portlet-header" )
    // .addClass( "ui-widget-header ui-corner-all" )
    // .prepend( "<span class='ui-icon ui-icon-minusthick'></span>")
    // .end()
    // .find( ".portlet-content" );

  $(document).on('click', '.portlet .dropdown-menu li a', function(event) {
    event.preventDefault();
    var portlet = $(this).parents('.portlet');
    // add property
    if ($(this).hasClass('add')) {
      var markup = '<div data-content="foo:bar" class="portlet-entry">\
                      <div class="control-group">\
                        <!-- <label class="control-label">foo:bar</label> -->\
                        <div class="controls">\
                          <div class="line input-prepend input-append">\
                            <span class="add-on">\
                              <i class="icon-bookmark"></i>\
                            </span><input type="text" value="Add Foo Bar Test" class="input resource-widget"><button class="btn" type="button"><i class="icon-cog"></i></button>\
                          </div>\
                        </div>\
                      </div>\
                    </div>';
      portlet.find('.portlet-content').append(markup);
    }

    // remove portlet
    if ($(this).hasClass('remove')) {
      portlet.fadeOut(400, function() {
        $(this).remove();
      });
    }

    // hide - show
    if ($(this).hasClass('hide-show')) {
      $(this).parents('.dropdown-menu').css('z-index', '1500');
      $(this).find('i').toggleClass('icon-arrow-up').toggleClass('icon-arrow-down');
      portlet.toggleClass('portlet-minimized');
    }

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

  $(".modal").on("resize", function(event, ui) {
    ui.element.css("margin-left", -ui.size.width/2);
    ui.element.css("margin-top", -ui.size.height/2);
    ui.element.css("top", "50%");
    ui.element.css("left", "50%");
    $(ui.element).find(".modal-body").each(function() {
      var maxHeight = ui.size.height-$('.modal-header').outerHeight()-$('.modal-footer').outerHeight();
      $(this).css("max-height", maxHeight);
    });
  });

  $('.settings').hover(function() {
    $(this).fadeTo(1,1);
  },function() {
    if($(this).parents('li').hasClass('open')) {
      $(this).fadeTo(1,1);
    } else {
      $(this).fadeTo(1,0);
    }  
  });
    
  $(document).on('click', '.tabs', function(event) {
    event.preventDefault();
    console.log('left click on tab', $(this));
    $(this).tab('show');
    // $(this).parent().dropdown('toggle');
  });

  $(document).on('contextmenu', '.tabs', function(event) {
    event.preventDefault();
    console.log('right click on tab', $(this));
    $(this).parents('.dropdown').toggleClass('open');
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
