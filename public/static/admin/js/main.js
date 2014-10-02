$.noty.defaults = {
    layout: 'bottomRight',
    theme: 'defaultTheme',
    type: 'information',
    text: '',
    dismissQueue: true, // If you want to use queue feature set this true
    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
    animation: {
        open: {height: 'toggle'},
        close: {height: 'toggle'},
        easing: 'swing',
        speed: 500 // opening & closing animation speed
    },
    timeout: false, // delay for closing event. Set false for sticky notifications
    force: false, // adds notification to the beginning of queue when set to true
    modal: false,
    maxVisible: 10, // you can set max visible notification for dismissQueue true option
    closeWith: ['click'], // ['click', 'button', 'hover']
    callback: {
        onShow: function() {},
        afterShow: function() {},
        onClose: function() {},
        afterClose: function() {}
    },
    buttons: false // an array of buttons
};

CKEDITOR.config.contentsCss = '/static/admin/css/editor.css';
CKEDITOR.config.toolbar = [
    { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source'] },
    { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
    { name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll' ] },
    { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl' ] },
    { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] }, 
    { name: 'extend', items: [ 'UploaderBtn', 'WSCNMarkets'] },
    '/',
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
    { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
    { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'SpecialChar'] }
];
CKEDITOR.config.allowedContent = true;
CKEDITOR.config.extraPlugins += (CKEDITOR.config.extraPlugins ? ',wscn,uploader' : 'wscn,uploader');

$(document).ready(function(){
    var path = new Uri(window.location).path();
    $(".tobe-highlight").each(function(){
        var item = $(this),
        pattern = item.attr("data-highlight-url");
        if(!pattern) {
            return;
        }
        pattern = pattern.replace(/\//g,"\\/");
            var reg = new RegExp(pattern),
        res = reg.exec(path);

        item.removeClass('active');
        if(res) {
            var callback = item.attr('data-highlight-callback');
            item.addClass("active");
            item.parent().show();
            item.parentsUntil('li').parent().addClass('open');
        }
    });

    //form validation
    $('form').parsley({
        successClass: "has-success",
        errorClass: "has-error",
        classHandler: function(el) {
            return el.$element.closest(".form-group");
        },

        errorsWrapper: "<span class='help-block' style='margin:0;'></span>",
        errorTemplate: "<span></span>"
    });


    var autocompleters = $('.autocomplete');
    if(autocompleters[0]) {
        autocompleters.each(function(){
            var autocompleter = $(this),
                remote = autocompleter.attr('data-autocomplete-source'),
                target = $(autocompleter.attr('data-autocomplete-target')),
                displayKey = autocompleter.attr('data-autocomplete-display-key'),
                fillName = autocompleter.attr('data-autocomplete-fill-name');

            var dataSource = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: remote
            });
            dataSource.initialize();
            autocompleter.typeahead(null, {
                    displayKey: displayKey,
                    source: dataSource.ttAdapter()
            }).on('typeahead:opened', function (obj, datum) {
                target.data('autocomplete-old-name', autocompleter.val());
                target.data('autocomplete-old-value', target.val());
            }).on('typeahead:selected', function (obj, datum) {
                target.val(datum[fillName]);
                target.data('autocomplete-new-name', autocompleter.val());
                target.data('autocomplete-new-value', target.val());
            }).on('typeahead:closed', function (obj, datum) {
                var oldname = target.data('autocomplete-old-name');
                var oldvalue = target.data('autocomplete-old-value');
                var newname = target.data('autocomplete-new-name');
                var newvalue = target.data('autocomplete-new-value');
                //TODO: data mismatch need to clear old id
                console.log(oldname, oldvalue, newname, newvalue);
            });

        });
    }

    $('input[type=submit], button[type=submit]').on('click', function(){
        $(this).closest('form').find('input[name=__redirect]').val($(this).attr('data-redirect-url'));
    });

    $('.select2').select2();

    $('table th input:checkbox').on('click' , function(){
        var that = this;
        $(this).closest('table').find('tr > td:first-child input:checkbox')
        .each(function(){
            this.checked = that.checked;
            $(this).closest('tr').toggleClass('selected');
        });

    });

    $('.date-picker').datepicker({autoclose:true}).next().on(ace.click_event, function(){
        $(this).prev().focus();
    });
    $('.time-picker').timepicker({
        minuteStep: 1,
        showSeconds: true,
        defaultTime : false,
        showMeridian: false
    }).next().on(ace.click_event, function(){
        $(this).prev().focus();
    });



    $('.ace-file-input').ace_file_input({
        style:'well',
        btn_choose:'Drop files here or click to choose',
        btn_change:null,
        no_icon:'icon-cloud-upload',
        droppable:true,
        thumbnail:'small', //large | fit
        //,icon_remove:null//set null, to hide remove/reset button
        /**,before_change:function(files, dropped) {
        //Check an example below
        //or examples/file-upload.html
        return true;
        }*/
        /**,before_remove : function() {
          return true;
          }*/
        preview_error : function(filename, error_code) {
            //name of the file that failed
            //error_code values
            //1 = 'FILE_LOAD_FAILED',
            //2 = 'IMAGE_LOAD_FAILED',
            //3 = 'THUMBNAIL_FAILED'
            //alert(error_code);
        }
    }).on('change', function(){
        //console.log($(this).data('ace_input_files'));
        //console.log($(this).data('ace_input_method'));
    });



    var evaEditor = function(ui, options){
        //构造函数
        this.init(ui, options);
    }
    evaEditor.prototype = {
       defaultUI :  {
           switcher : '#switch-code',
           editors : 'textarea.editor',
           uploaders : '.editor-upload-handle'
       }
       , defaultOptions : {
           debug : false
       }
       , htmlEditorEvents : function(editor){
   /*
            $("#test").on('click', function(){
                ckeditor.insertHtml('<p>a</p>');
                return false;
            });
           */
       }
       , initHtmlEditorUploader : function() {
            var uploaders = $(this.ui.uploaders);

            if(!uploaders[0]) {
                return false;
            }

            var uploaderNoty = [];

            var findNoty = function(file) {
                var i, item;
                for(i in uploaderNoty){
                    item = uploaderNoty[i];
                    if(file.originalName == item.file) {
                        return item.noty;
                    }
                }
                return false;
            }

            uploaders.each(function(){
                var uploader = $(this);
                uploader.fileupload({
                    url: '/admin/upload',
                    dataType: 'json',
                    send : function (e, data) {
                        var files = data.files,
                            i = 0,
                            file;
                        for(i in files) {
                            file = files[i];
                            uploaderNoty.push({
                                file : file.name,
                                noty : noty({text: 'Uploading file ' + files[i].name})
                            });
                        }
                        //console.log(files);
                    },
                    done: function (e, data) {
                        var editor = $(uploader.attr('data-connect-editor')).data('eva-ui');
                        var file = data.result;
                        console.log(data);
                        var notyHandle = findNoty(file);
                        if(notyHandle) {
                            notyHandle.setText(file.originalName + ' uploaded.').setType('success');
                            setTimeout(function(){
                                notyHandle.close();
                            }, 2000);
                        }
                        if(file.isImage > 0) {
                            editor.insertHtml('<a href="' + file.localUrl + '"><img src="' + file.localUrl + '" alt="' + file.title + '" /></a>');
                        } else {
                            editor.insertHtml('<a href="' + file.localUrl + '">' + file.fileName + '</a>');
                        }
                        //console.log(data);
                    },
                    progressall: function (e, data) {
                        //console.log(data);
                    }
                });
            });
       

       }
       , initHtmlEditor : function() {
            var self = this;
            var editors = this.editors;

            
            editors.each(function(){
                var ckeditor = $(this).ckeditor().ckeditorGet();
                ckeditor.on('instanceReady', function( ev ) {
                    self.htmlEditorEvents(ckeditor);
                });            
                $(this).data('eva-ui', ckeditor);
            });
       }
       , initMarkdownEditor : function(){
            var editors = this.editors;
            editors.each(function(){
                var self = $(this).parent()[0];
                var markdownEditor = new EpicEditor({
                    container : self, 
                    autogrow : {
                        minHeight : 300,
                        maxHeight : $(window).height() - 200
                    },
                    theme: {
                        base: 'http://www.goldtoutiao.com//vendor/js/epiceditor/themes/base/epiceditor.css',
                        preview: 'http://www.goldtoutiao.com/vendor/js/epiceditor/themes/preview/bartik.css',
                        editor: 'http://www.goldtoutiao.com/vendor/js/epiceditor/themes/editor/epic-light.css'
                    },
                    button: {
                        preview: false,
                        fullscreen: true,
                        bar: "auto"
                    },
                    string: {
                        togglePreview: '预览(快捷键Alt+p)',
                        toggleEdit: 'Toggle Edit Mode',
                        toggleFullscreen: '全屏(快捷键Alt+f)'
                    },
                }).load(); 
                //console.log(markdownEditor);
                //$(this).data('eva-ui', markdownEditor);
            });
                    
       }
       , init : function(ui, options){
           this.ui = $.extend({}, this.defaultUI, ui);
           this.options = $.extend({}, this.defaultOptions, options);

           var switcher = $(this.ui.switcher);
           if(!switcher[0]) {
               return false;
           }

           this.editors = $(this.ui.editors);
           if(!this.editors[0]) {
               return false;
           }

           var uri = new Uri(window.location);
           var anchor = uri.anchor();
           var sourceCode = 'format-html';
           var sourceCodeValue = $('input[name=codeType]').val();
           if(sourceCodeValue) {
               sourceCode = sourceCodeValue == 'html' ? 'format-html' : 'format-markdown';
           }
           if(switcher.find('a[href=#' + anchor + ']')[0]) {
               sourceCode = anchor;
           }
           switcher.find('a[href=#' + sourceCode + ']').parent().addClass('active');

           if(sourceCode == 'format-markdown') {
               this.initMarkdownEditor();
               $('input[name=codeType]').val('markdown');
           } else {
               this.initHtmlEditor();
               this.initHtmlEditorUploader();
               $('input[name=codeType]').val('html');
           }

           //this.switcher = switcher;
           this.sourceCode = sourceCode;
       }
    }
    var editor = new evaEditor();

    $(".tag-input").select2({
        tags:[],
        tokenSeparators: [",", " "]
    });

    var pasteUploader = $('.paste-uploader');
    var onPaste = function(e) {
        if(!e || !e.originalEvent || !e.originalEvent.clipboardData) {
            return;
        }
        //Filefox use clipboardData.files
        var items = e.originalEvent.clipboardData.files,
             i = 0,
             item,
             notice,
             uploadUrl = pasteUploader.attr('data-upload-url'),
             uploadMaxNum = pasteUploader.attr('data-upload-allow-num');
        if(pasteUploader.find('.paste-upload-image').length >= uploadMaxNum) {
            return;
        }

        var upload = function(fileinfo, filedata) {
            var reader = new FileReader();
            notice = noty({text: 'Uploading : ' + fileinfo.name});
            reader.onload = function(event){
                $.ajax({
                    url : uploadUrl,
                    type : 'POST',
                    data : {
                        name : fileinfo.name,
                        size : fileinfo.size,
                        type : fileinfo.type,
                        file : event.target.result
                    },
                    success : function(response) {
                        pasteUploader.find('input[name=image]').val(response.localUrl);
                        pasteUploader.find('input[name=image_id]').val(response.id);
                        pasteUploader.append('<img src="' + response.localUrl + '" class="paste-upload-image" width="100%" alt="">');
                        notice.setText(fileinfo.name + ' uploaded').setType('success');
                    },
                    error : function(response) {
                        notice.setText(fileinfo.name + ' upload failed').setType('error');
                    }
                }); 
                //$('#epiceditor').after('<img src="' + event.target.result + '" alt="">');
            }
            reader.readAsDataURL(item); 

        };
        for(i in items) {
            item = items[i];
            if(item.type && item.type.match(/^image\//i)) {
                if(i > uploadMaxNum) {
                    continue;
                }
                upload(item);
            }
        }
    }
    if(pasteUploader) {
        $(window).on("paste", onPaste);
    }

});

//表格排序空间
// data-sortable-key 排序字段在url中的对应值
// data-sortable-default 默认按哪个字段排序
// data-sortable-value 用于标记排序的字段
// data-sortable-default 用于标记字段的默认值
$('.table-sortable').each(function(){
    var sortableTable = $(this),
        sortUri = new Uri(window.location),
        links = sortableTable.find('.sortable-link'),
        sortKey = sortableTable.attr('data-sortable-key'),
        defaultSort = sortableTable.attr('data-sortable-default'),
        currentSort = sortUri.getQueryParamValue(sortKey),
        currentSort = currentSort ? currentSort : defaultSort,
        isCurrentSortAsc = currentSort.substring(0, 1) === '-' ? false : true;
    if(!links[0]) {
        return false;
    }

    links.each(function(){
        var link = $(this),
            linkUri = new Uri(link.attr('href')),
            //linkSort = linkUri.getQueryParamValue(sortKey);
            linkSort = link.attr('data-sortable-value');
        if(currentSort == linkSort || currentSort == '-' + linkSort) {
            link.addClass('active');
            link.append(isCurrentSortAsc ? ' <i class="icon-caret-up"></i>' : ' <i class="icon-caret-down"></i>');
            linkUri.replaceQueryParam(sortKey, currentSort.substring(0, 1) === '-' ? currentSort.substring(1) : '-' + linkSort);
        } else {
            linkUri.replaceQueryParam(sortKey, link.attr('data-sortable-default') ? link.attr('data-sortable-default') : '-' + linkSort);
        }

        linkUri.replaceQueryParam('page', 1);
        link.attr('href', linkUri.toString());
    });
});

//按钮点击更换Form的某个值
$('.form-submiter').on('click', function(){
    var submiter = $(this);
    var form = submiter.closest('form');
    if(submiter.attr('data-change-name')) {
        var name = submiter.attr('data-change-name');
        form.find('*[name=' + name + ']').val(submiter.attr('data-change-value'));
    }
    return true;
});

//单按钮ajax表单
$('*[data-ajax-form]').each(function(){
    var form = $(this);
    var submiter = form.hasClass('ajax-form-sumbit') ? form : null;
    if(!submiter) {
        var submiter = form.find('.ajax-form-sumbit');
    }
    submiter.on('click', function(){
        if(form.attr('data-confirm') && !confirm(form.attr('data-confirm-message'))) {
            return false;
        }
        var data = {};
        form.find('input[data-name]').each(function(){
            data[$(this).attr('data-name')] = $(this).val();
        });
        $.ajax({
            url : form.attr('data-form-action'),
            type : form.attr('date-method'),
            data : data,
            success : function(){
                if(form.attr('data-callback')) {
                    console.log(form.attr('data-callback'));
                    eval(form.attr('data-callback'));
                }
            }
        })
    });
});

//Ajax动态更新field值
$('.ajax-field-edit').each(function(){
    var input = $(this);
    input.on('blur', function(){
        var data = {};
        data[$(this).attr('data-name')] = $(this).val();
        $.ajax({
            url : input.attr('data-form-action'),
            type : input.attr('date-method'),
            data : data,
            success : function(){
                if(input.attr('data-callback')) {
                    eval(input.attr('data-callback'));
                }
            }
        })
    });
});

//批处理UI
$('*[data-batch-form]').each(function(){
    var form = $(this);
    var submiter = form.hasClass('ajax-form-sumbit') ? form : null;
    if(!submiter) {
        var submiter = form.find('.ajax-form-sumbit');
    }
    submiter.on('click', function(){
        var source = $(form.attr('data-source-selectors'));
        if(!source[0]) {
            return false;
        }

        var data = {};
        var sourceName = form.attr('data-source-name');
        data[sourceName] = [];
        source.each(function(){
            if($(this).is(':checked')) {
                data[sourceName].push($(this).val());
            }
        });
        if(data[sourceName].length < 1) {
            return false;
        }

        if(form.attr('data-confirm') && !confirm(form.attr('data-confirm-message'))) {
            return false;
        }
        form.find('input[data-name]').each(function(){
            data[$(this).attr('data-name')] = $(this).val();
        });

        $.ajax({
            url : form.attr('data-form-action'),
            type : form.attr('date-method'),
            data : data,
            success : function(){
                if(form.attr('data-callback')) {
                    eval(form.attr('data-callback'));
                }
            }
        })
    });

});

$('.wysiwyg').ckeditor({

});


//转换title为拼音并自动填充
$(".slug-generator").each(function(){
    var generator = $(this),
        target = $($(this).attr('data-slug-target')),
        slugFlag = false;

    var getSlugText = function(input){
        var res = pinyin(input, {
            style: pinyin.STYLE_NORMAL,
            heteronym: true
        });
        res = jQuery.map( res, function( n, i ) {
            return n[0];
        });
        res = res.join('');
        return res.toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'');
    }
    generator.on('focus', function(){
        if(target.val() == '') {
            slugFlag = true;
        } else {
            slugFlag = false;
        }
    });

    generator.on('keyup', function(){
        if(slugFlag) {
            target.val(getSlugText(generator.val()));
        }
    });
});
