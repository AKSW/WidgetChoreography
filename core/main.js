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

function toggleFullscreen() {
  var modal = $('#rdfauthor-view');
  modal.toggleClass('fullscreen');
  if (modal.hasClass('fullscreen')) {
    modal.draggable('option', 'disabled', true);
    modal.resizable('option', 'disabled', true);
    modal.css('width', '100%');
    modal.css('height', '100%');
    modal.css("margin-left", -modal.outerWidth()/2);
    modal.css("margin-top", -modal.outerHeight()/2);
    modal.css("top", "50%");
    modal.css("left", "50%");
    modal.find(".modal-body").each(function() {
      var maxHeight = modal.height()-$('.modal-header').outerHeight()-$('.modal-footer').outerHeight()-20;
      $(this).css("max-height", maxHeight);
      $(this).find('.tab-pane').css('height', maxHeight);
      $(this).find('.tab-pane').css('height', maxHeight-$('.modal-footer').outerHeight());
    });
  } else {
    var modalSize = modal.data('modalSize');
    modal.draggable('option', 'disabled', false);
    modal.resizable('option', 'disabled', false);
    modal.css('width', modalSize.modal.width);
    modal.css('height',modalSize.modal.height);
    modal.css("margin-left", modalSize.modal.marginLeft);
    modal.css("margin-top", modalSize.modal.marginTop);
    modal.css("top", "50%");
    modal.css("left", "50%");
    modal.find(".modal-body").each(function() {
      var maxHeight = modal.height()-$('.modal-header').outerHeight()-$('.modal-footer').outerHeight()-20;
      $(this).css("max-height", maxHeight);
      $(this).find('.tab-pane').css('height', maxHeight);
      $(this).find('.tab-pane').css('height', maxHeight-$('.modal-footer').outerHeight());
    });

  }
}

function storeSize() {
  var modal = $('#rdfauthor-view');
  // store values
  var modalSize = {
    'modal' : {
      'marginLeft' : -modal.outerWidth()/2,
        'marginTop' : -modal.outerHeight()/2,
        'height' : modal.outerHeight(),
        'width' : modal.outerWidth(),
        'top' : '50%',
        'left' : '50%'
    },
    'modalBody' : {
      'maxHeight' : modal.outerHeight()-$('.modal-header').outerHeight()-$('.modal-footer').outerHeight()
    }
  }
  // append values to rdfauthor view
  $('#rdfauthor-view').data('modalSize', modalSize);
}

$(document).ready(function() {
  initTypeahead();
  storeSize();
  $('#rdfauthor-view').resizable().draggable({
    handle: '.modal-header',
    cursor: 'move'
  }).modal('show');
  $('.portlet-container').sortable({
    disabled : true
  }).disableSelection();
  $('.modal-header button').tooltip();

  // disable input and textarea
  $('#rdfauthor-view input, #rdfauthor-view textarea').prop('disabled', true);

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

  // double click handler on portlet navbar
  $(document).on('dblclick', '.portlet-navbar', function(event) {
    event.preventDefault();
    // hide - show
    $(this).find('.hide-show').trigger('click');
  });


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
    disabled: true,
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
    console.log('ui',ui);
    ui.element.css("margin-left", -ui.size.width/2);
    ui.element.css("margin-top", -ui.size.height/2);
    ui.element.css("left", "50%");
    ui.element.css("top", "50%");
    // fit size of modal body to prevent layout glitches
    $(ui.element).find(".modal-body").each(function() {
      var maxHeight = ui.size.height-$('.modal-header').outerHeight()-$('.modal-footer').outerHeight();
      $(this).css("max-height", maxHeight);
      $(this).find('.tab-pane').css('height', maxHeight-$('.modal-footer').outerHeight());
      // store size of modal
      storeSize();
    });
  });

  //tab show
  // $(".modal").on("show", function() {
    // console.log('ui',$(this).height());
    // $(this).resizable('destroy');
    // $(this).css("margin-left", -$(this).width()/2);
    // $(this).css("margin-top", -$(this).height()/2);
    // $(this).css("top", "50%");
    // $(this).css("left", "50%");
    // $(this).find(".modal-body").each(function() {
      // var maxHeight = $(this).height()-$('.modal-header').outerHeight()-$('.modal-footer').outerHeight();
      // console.log('max-height', maxHeight);
      // $(this).css("max-height", maxHeight);
    // });
  // });

  $('.portlet').hover(function() {
    $(this).find('.settings').fadeTo(1,1);
  },function() {
    if($(this).parents('li').hasClass('open')) {
      $(this).find('.settings').fadeTo(1,1);
    } else {
      $(this).find('.settings').fadeTo(1,0);
    }  
  });

  $('.tabs').hover(function() {
    $(this).find('.settings').fadeTo(1,1);
  },function() {
    $(this).find('.settings').fadeTo(1,0);
  });


  $(document).on('click', '.tabs', function(event) {
    event.preventDefault();
    console.log('left click on tab', $(this));
    $(this).tab('show');
    // $(this).parent().dropdown('toggle');
  });

  var openTabDropdown = false;
  var tabDropdown = $('.tabs .dropdown');
  $(document).on('click', '.tabs i', function(event) {
    event.preventDefault();
    tabDropdown = $(this).parents('.dropdown');
    tabDropdown.toggleClass('open');
  });

  // manually open close dropdown on tabs' dropdown
  $('html').unbind('click').click(function(event){
    if ($('.nav-tabs li').hasClass('open') && openTabDropdown == false) {
      $('.nav-tabs li').removeClass('open');
    }
  });
  $('.nav-tabs .dropdown-menu').mouseover(function() {
    openTabDropdown = true;
  });
  $('.nav-tabs .dropdown-menu').mouseout(function() {
    openTabDropdown = false;
  });

  $(document).on('click', '.input-custom', function(event) {
    event.preventDefault();
    console.log('click', $(this));
    $(this).parens('.btn-group').addClass('open');
  });

  $(document).on('click', '.checkbox-submenu', function(event) {
    console.log('click', $(this));
    $(this).parens('.btn-group').addClass('open');
  });

  $('.portlet .image').parents('.input-prepend').popover({
    trigger: 'hover',
    placement: 'top',
    html: true,
    title: 'Preview',
    content: '<img src="img/leipzig2.gif" />'
  });


  $(document).on('click', '.modal-header button', function(event) {
    if ($(this).hasClass('fullscreen')) {
      $(this).toggleClass('icon-fullscreen icon-resize-small');
      toggleFullscreen();
    }
  });

  $(document).on('click', '.modal-footer a', function(event) {
    if ($(this).hasClass('edit') || $(this).hasClass('save')) {
      $(this).parent().find('.btn').toggleClass('hide');
    }
    
    // enable consumer mode
    if ($(this).hasClass('edit')) {
      console.log('enable consumer mode');
      $('#rdfauthor-view').toggleClass('consumer-mode edit-mode');
      $('.portlet-container, .portlet-content').sortable('option', 'disabled', false);
      $('#rdfauthor-view input, #rdfauthor-view textarea').prop('disabled', false);
    }

    // disable consumer mode
    if ($(this).hasClass('save')) {
      $('#rdfauthor-view').toggleClass('consumer-mode edit-mode');
      $('.portlet-container, .portlet-content').sortable( 'option', 'disabled', true );
      $('#rdfauthor-view input, #rdfauthor-view textarea').prop('disabled', true);
    }
  });

  $('input').on('keyup', function() {
    var object = $(this).attr('name');
    var value = $(this).val();
    if ($('input[name='+object+']').length > 1) {
      $('input[name='+object+']').val(value);
    }
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
