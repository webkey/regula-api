/**
 * !Detects overlay scrollbars (when scrollbars on overflowed blocks are visible).
 * This is found most commonly on mobile and OS X.
 * */
var HIDDEN_SCROLL = Modernizr.hiddenscroll;
var NO_HIDDEN_SCROLL = !HIDDEN_SCROLL;

/**
 * !Add touchscreen classes
 * */
function addTouchClasses() {
  if (!("ontouchstart" in document.documentElement)) {
    document.documentElement.className += " no-touchevents";
  } else {
    document.documentElement.className += " touchevents";
  }
}

/**
 * !Add placeholder for old browsers
 * */
function placeholderInit() {
  $('[placeholder]').placeholder();
}

/**
 * !Toggle class on a form's element on focus
 * */
function inputFocusClass() {
  var $inputs = $('.field-js');

  if ($inputs.length) {
    var $fieldWrap = $('.input-wrap');
    var $selectWrap = $('.select');
    var classFocus = 'focused';

    $inputs.focus(function () {
      var $currentField = $(this);
      var $currentFieldWrap = $currentField.closest($fieldWrap);

      $currentField.addClass(classFocus);
      $currentField.prev('label').addClass(classFocus);
      $currentField.closest($selectWrap).prev('label').addClass(classFocus);
      $currentFieldWrap.addClass(classFocus);
      $currentFieldWrap.find('label').addClass(classFocus);

    }).blur(function () {
      var $currentField = $(this);
      var $currentFieldWrap = $currentField.closest($fieldWrap);

      $currentField.removeClass(classFocus);
      $currentField.prev('label').removeClass(classFocus);
      $currentField.closest($selectWrap).prev('label').removeClass(classFocus);
      $currentFieldWrap.removeClass(classFocus);
      $currentFieldWrap.find('label').removeClass(classFocus);

    });
  }
}

/**
 * !Toggle class on a form's element if this one has a value
 * */
function inputHasValueClass() {
  var $inputs = $('.field-js');

  if ($inputs.length) {
    var $fieldWrap = $('.input-wrap');
    var $selectWrap = $('.select');
    var classHasValue = 'filled';

    $.each($inputs, function () {
      switchHasValue.call(this);
    });

    $inputs.on('keyup change', function () {
      switchHasValue.call(this);
    });

    function switchHasValue() {
      var $currentField = $(this);
      var $currentFieldWrap = $currentField.closest($fieldWrap);

      //first element of the select must have a value empty ("")
      if ($currentField.val().length === 0) {
        $currentField.removeClass(classHasValue);
        $currentField.prev('label').removeClass(classHasValue);
        $currentField.closest($selectWrap).prev('label').removeClass(classHasValue);
        $currentFieldWrap.removeClass(classHasValue);
        $currentFieldWrap.find('label').removeClass(classHasValue);
      } else if (!$currentField.hasClass(classHasValue)) {
        $currentField.addClass(classHasValue);
        $currentField.prev('label').addClass(classHasValue);
        $currentField.closest($selectWrap).prev('label').addClass(classHasValue);
        $currentFieldWrap.addClass(classHasValue);
        $currentFieldWrap.find('label').addClass(classHasValue);
      }
    }
  }
}

/**
 * !Initial custom select for cross-browser styling
 * */
function customSelect(select) {
  $.each(select, function () {
    var $thisSelect = $(this);
    // var placeholder = $thisSelect.attr('data-placeholder') || '';
    $thisSelect.select2({
      language: "ru",
      width: '100%',
      containerCssClass: 'cselect-head',
      dropdownCssClass: 'cselect-drop'
      // , placeholder: placeholder
    });
  })
}


document.addEventListener("DOMContentLoaded", function(){
  /**
   * !Sticky table
   */
  var stickyTable = document.querySelector('.table.m-sticky-head');
  if(stickyTable){
    var cloneTable = document.createElement('table');
    cloneTable.className = 'table m-sticky';
    cloneTable.appendChild( stickyTable.querySelector('thead').cloneNode(true) );
    stickyTable.insertAdjacentElement('beforebegin', cloneTable);
    cloneTable.style.marginBottom = -cloneTable.offsetHeight + 'px';
    syncTableWidth(stickyTable, cloneTable);
    window.addEventListener('resize', syncTableWidth.bind(null, stickyTable, cloneTable));
  }

  var resultsData = getResultsData();
  var jsDataTable = document.querySelector('.js-data-table');
  if(jsDataTable) {
    jsDataTable.insertAdjacentElement('afterend', buildMobileTable(resultsData));
  }
});

function syncTableWidth(donor, acceptor) {
  var donorTh = donor.querySelectorAll('thead > tr:first-child > th');
  var acceptorTh = acceptor.querySelectorAll('thead > tr:first-child > th');
  if(donorTh.length && donorTh.length === acceptorTh.length){
    [].forEach.call(donorTh, function(th, i) {
      acceptorTh[i].style.width = th.offsetWidth + 'px';
    });
  }
}

function getResultsData() {
  var result = [];
  var results = document.querySelector('.js-data-table');
  var validIndex = -1;
  if(results) {
    var heads = results.querySelectorAll('thead > tr:first-child > th');
    [].forEach.call(heads, function(head, ind) {
      result.push({
        label: head.innerHTML,
        data: []
      });
      if(head.className.indexOf('td-valid') !== -1) {
        validIndex = ind;
      }
    });
    var rows = results.querySelectorAll('tbody > tr');
    [].forEach.call(rows, function(row, ind) {
      var label = row.querySelector('.td-label').innerHTML;
      [].forEach.call(row.querySelectorAll('td'), function(td, tdi) {
        if(tdi && td.innerHTML) {
          result[tdi].data.push({
            label: label,
            value: td.innerHTML,
            isMarked: row.className.indexOf('row-marked') !== -1
          });
          if(row.className.indexOf('row-marked') !== -1 && validIndex !== -1){
            result[validIndex].data.push({
              label: label,
              value: td.innerHTML,
              isMarked: true
            });
          }
        }
      });
    });
  }
  return result;
}
function buildMobileTable(data) {
  var all = document.createElement('div');
  all.className = 'mobile-tables';
  if(data){
    var wrapTabs = document.createElement('div');
    wrapTabs.className = 'table-tabs';
    wrapTabs.innerHTML = data.map(function(tbl, tblInd) {
      if(!tblInd) { return ''; }
      var itemClass = tblInd === 1 ? ' m-active' : '';
      return '<div class="table-tabs__item'+itemClass+'">'+tbl.label+'</div>';
    }).join('');
    all.appendChild(wrapTabs);

    data.forEach(function(tbl, tblInd) {
      if(tblInd){
        var table = document.createElement('table');
        var itemClass = tblInd === 1 ? ' m-active' : '';
        table.className = 'table m-simple' + itemClass;
        table.innerHTML = '<tbody>' + tbl.data.map(function(row) {
          var rowClass = row.isMarked ? 'row-marked' : '';
          return '<tr class="'+rowClass+'"><td class="td-label">'+row.label+'</td><td>'+row.value+'</td></tr>';
        }).join('') + '</tbody>';
        all.appendChild(table);
      }
    });

    try {
      [].forEach.call(all.querySelectorAll('.table-tabs__item'), function(tab, tabInd) {
        tab.addEventListener('click', function() {
          all.querySelector('.table-tabs__item.m-active').classList.remove('m-active');
          all.querySelector('.table.m-active').classList.remove('m-active');
          all.querySelectorAll('.table')[tabInd].classList.add('m-active');
          tab.classList.add('m-active');
        });
      });
    } catch(e){}
  }

  return all;
}

/**
 * !Slider document photos
 */
function sliderPhotos() {
  var $docScan = $('.doc-scan-js');
  if($docScan.length){
    $docScan.each(function () {
      var $container = $(this),
          $orig = $container.find('.orig-images-js'),
          $sample = $container.find('.sample-images-js'),
          $pagination = $orig.find('.swiper-pagination'),
          origSlider, sampleSlider;

      origSlider = new Swiper ($orig, {
        init: false,
        // centeredSlides: true,
        // slideToClickedSlide: true,
        spaceBetween: 20,
        loop: true,
        loopedSlides: 3, //looped slides should be the same
        allowTouchMove: false,
        // preloadImages: false,
        // parallax: true,
        // thumbs: {
        //   swiper: sampleSlider,
        // },
        pagination: {
          el: $pagination,
          type: 'bullets',
          clickable: true
        },
        breakpoints: {
          991: {
            slidesPerView: 'auto',
            allowTouchMove: true
          }
        }
      });

      sampleSlider = new Swiper ($sample, {
        centeredSlides: true,
        spaceBetween: 9,
        slidesPerView: 3,
        slideToClickedSlide: true,
        // allowTouchMove: false,
        loop: true,
        loopedSlides: 3, //looped slides should be the same
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        controller: {
          control: origSlider
        },
      });

      origSlider.on('init', function() {
        $container.addClass('is-loaded');
      });

      origSlider.init();
    });
  }
}

/**
 * !Check settings
 */
function checkSettings() {

  $(':checkbox').on('change', function () {
    checkParam.call(this);
  });

  function checkParam() {
    var $ch = $(this);
    var $container = $ch.closest('.settings-js');
    var $chAll = $container.find(':checkbox').not('.all-param-js');

    if ($ch.hasClass('all-param-js')) {
      $chAll.not(':disabled').prop('checked', $ch.prop('checked'));

      return;
    }

    $container.find('.all-param-js').not(':disabled').prop('checked', $chAll.length === $chAll.filter(':checked').length);
  }

  // Проверить не отмечен ли пункт "Все параметры".
  // Елси да, то запустить функцию для этого чекбокса.
  checkParam.call($('.all-param-js:checked', $('.settings-js')));

  // Запустить функцию для остальных чекбоксов.
  checkParam.call($(':checkbox:not(.all-param-js)', $('.settings-js')));
}

/**
 * !Tabs
 */
function tabs() {
  var $tabs = $('.tabs-js');
  var $tabsThumb = $('.tabs-thumb-js');

  if ($tabs.length) {
    var $thumbWithCurClass = $tabsThumb.filter('.current').first();
    var $curThumb = ($thumbWithCurClass.length) ? $thumbWithCurClass : $tabsThumb.eq(0);

    toggleTabs.call($curThumb);
  }


  $tabsThumb.on('click', function (e) {
    e.preventDefault();
    toggleTabs.call(this, e);
  });

  function toggleTabs() {
    var $thumb = $(this);
    var $curTabs = $thumb.closest('.tabs-js');

    // if ($thumb.hasClass('current')) {
    //   return;
    // }

    $tabsThumb.removeClass('current');

    $thumb.addClass('current');

    $curTabs
        .find('.tabs-panels-js > div')
        .removeClass('current')
        .end()
        .find($thumb.attr('href'))
        .addClass('current');
  }
}

/**
 * !Form validation
 * */
function formValidation() {
  $.validator.setDefaults({
    submitHandler: function() {
      alert('Форма находится в тестовом режиме. Чтобы закрыть окно, нажмите ОК.');
      return false;
    }
  });

  var $form = $('.form-validate-js');

  if ($form.length) {
    var changeClasses = function (elem, remove, add) {
      console.log('changeClasses');
      elem
          .removeClass(remove).addClass(add);
      elem
          .closest('form').find('label[for="' + elem.attr('id') + '"]')
          .removeClass(remove).addClass(add);
      elem
          .closest('.input-wrap')
          .removeClass(remove).addClass(add);
    };

    $.each($form, function (index, element) {
      $(element).validate({
        errorClass: "error",
        validClass: "success",
        errorElement: false,
        errorPlacement: function (error, element) {
          return true;
        },
        highlight: function (element, errorClass, successClass) {
          changeClasses($(element), successClass, errorClass);
        },
        unhighlight: function (element, errorClass, successClass) {
          changeClasses($(element), errorClass, successClass);
        }
      });
    });
  }
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(document).ready(function () {
  addTouchClasses();
  placeholderInit();
  inputFocusClass();
  inputHasValueClass();
  customSelect($('select.cselect'));
  sliderPhotos();
  checkSettings();
  tabs();
  objectFitImages(); // object-fit-images initial

  formValidation();
});
