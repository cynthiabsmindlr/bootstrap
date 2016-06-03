$(function () {
  'use strict';

  QUnit.module('scrollspy plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1)
    assert.ok($(document.body).scrollspy, 'scrollspy method is defined')
  })

  QUnit.module('scrollspy', {
    beforeEach: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapScrollspy = $.fn.scrollspy.noConflict()
    },
    afterEach: function () {
      $.fn.scrollspy = $.fn.bootstrapScrollspy
      delete $.fn.bootstrapScrollspy
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1)
    assert.strictEqual($.fn.scrollspy, undefined, 'scrollspy was set back to undefined (org value)')
  })

  QUnit.test('should throw explicit error on undefined method', function (assert) {
    assert.expect(1)
    var $el = $('<div/>')
    $el.bootstrapScrollspy()
    try {
      $el.bootstrapScrollspy('noMethod')
    }
    catch (err) {
      assert.strictEqual(err.message, 'No method named "noMethod"')
    }
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2)
    var $el = $('<div/>')
    var $scrollspy = $el.bootstrapScrollspy()
    assert.ok($scrollspy instanceof $, 'returns jquery collection')
    assert.strictEqual($scrollspy[0], $el[0], 'collection contains element')
  })

  QUnit.test('should only switch "active" class on current target', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var sectionHTML = '<div id="root" class="active">'
        + '<div class="topbar">'
        + '<div class="topbar-inner">'
        + '<div class="container" id="ss-target">'
        + '<ul class="nav">'
        + '<li><a href="#masthead">Overview</a></li>'
        + '<li><a href="#detail">Detail</a></li>'
        + '</ul>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div id="scrollspy-example" style="height: 100px; overflow: auto;">'
        + '<div style="height: 200px;">'
        + '<h4 id="masthead">Overview</h4>'
        + '<p style="height: 200px">'
        + 'Ad leggings keytar, brunch id art party dolor labore.'
        + '</p>'
        + '</div>'
        + '<div style="height: 200px;">'
        + '<h4 id="detail">Detail</h4>'
        + '<p style="height: 200px">'
        + 'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.'
        + '</p>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')

    var $scrollspy = $section
      .show()
      .find('#scrollspy-example')
      .bootstrapScrollspy({ target: '#ss-target' })

    $scrollspy.one('scroll', function () {
      assert.ok($section.hasClass('active'), '"active" class still on root node')
      done()
    })

    $scrollspy.scrollTop(350)
  })

  QUnit.test('should only switch "active" class on current target specified w element', function (assert) {
    assert.expect(1)
    var done = assert.async()

    var sectionHTML = '<div id="root" class="active">'
        + '<div class="topbar">'
        + '<div class="topbar-inner">'
        + '<div class="container" id="ss-target">'
        + '<ul class="nav">'
        + '<li><a href="#masthead">Overview</a></li>'
        + '<li><a href="#detail">Detail</a></li>'
        + '</ul>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div id="scrollspy-example" style="height: 100px; overflow: auto;">'
        + '<div style="height: 200px;">'
        + '<h4 id="masthead">Overview</h4>'
        + '<p style="height: 200px">'
        + 'Ad leggings keytar, brunch id art party dolor labore.'
        + '</p>'
        + '</div>'
        + '<div style="height: 200px;">'
        + '<h4 id="detail">Detail</h4>'
        + '<p style="height: 200px">'
        + 'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.'
        + '</p>'
        + '</div>'
        + '</div>'
        + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')

    var $scrollspy = $section
      .show()
      .find('#scrollspy-example')
      .bootstrapScrollspy({ target: document.getElementById('#ss-target') })

    $scrollspy.one('scroll', function () {
      assert.ok($section.hasClass('active'), '"active" class still on root node')
      done()
    })

    $scrollspy.scrollTop(350)
  })

  QUnit.test('should correctly select middle navigation option when large offset is used', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var sectionHTML = '<div id="header" style="height: 500px;"></div>'
        + '<nav id="navigation" class="navbar">'
        + '<ul class="nav navbar-nav">'
        + '<li class="active"><a class="nav-link" id="one-link" href="#one">One</a></li>'
        + '<li><a class="nav-link" id="two-link" href="#two">Two</a></li>'
        + '<li><a class="nav-link" id="three-link" href="#three">Three</a></li>'
        + '</ul>'
        + '</nav>'
        + '<div id="content" style="height: 200px; overflow-y: auto;">'
        + '<div id="one" style="height: 500px;"></div>'
        + '<div id="two" style="height: 300px;"></div>'
        + '<div id="three" style="height: 10px;"></div>'
        + '</div>'
    var $section = $(sectionHTML).appendTo('#qunit-fixture')
    var $scrollspy = $section
      .show()
      .filter('#content')

    $scrollspy.bootstrapScrollspy({ target: '#navigation', offset: $scrollspy.position().top })

    $scrollspy.one('scroll', function () {
      assert.ok(!$section.find('#one-link').hasClass('active'), '"active" class removed from first section')
      assert.ok($section.find('#two-link').hasClass('active'), '"active" class on middle section')
      assert.ok(!$section.find('#three-link').hasClass('active'), '"active" class not on last section')
      done()
    })

    $scrollspy.scrollTop(550)
  })

  QUnit.test('should add the active class to the correct element', function (assert) {
    assert.expect(2)
    var navbarHtml =
        '<nav class="navbar">'
      + '<ul class="nav">'
      + '<li><a class="nav-link" id="a-1" href="#div-1">div 1</a></li>'
      + '<li><a class="nav-link" id="a-2" href="#div-2">div 2</a></li>'
      + '</ul>'
      + '</nav>'
    var contentHtml =
        '<div class="content" style="overflow: auto; height: 50px">'
      + '<div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>'
      + '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>'
      + '</div>'

    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml)
      .appendTo('#qunit-fixture')
      .bootstrapScrollspy({ offset: 0, target: '.navbar' })

    var testElementIsActiveAfterScroll = function (element, target) {
      var deferred = $.Deferred()
      var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top)
      var done = assert.async()
      $content.one('scroll', function () {
        assert.ok($(element).hasClass('active'), 'target:' + target + ', element' + element)
        done()
        deferred.resolve()
      })
      $content.scrollTop(scrollHeight)
      return deferred.promise()
    }

    $.when(testElementIsActiveAfterScroll('#a-1', '#div-1'))
      .then(function () { return testElementIsActiveAfterScroll('#a-2', '#div-2') })
  })

  QUnit.test('should add the active class correctly when there are nested elements at 0 scroll offset', function (assert) {
    assert.expect(6)
    var times = 0
    var done = assert.async()
    var navbarHtml = '<nav id="navigation" class="navbar">'
      + '<ul class="nav">'
      + '<li><a id="a-1" class="nav-link" href="#div-1">div 1</a>'
      + '<ul>'
      + '<li><a id="a-2" class="nav-link" href="#div-2">div 2</a></li>'
      + '</ul>'
      + '</li>'
      + '</ul>'
      + '</nav>'

    var contentHtml = '<div class="content" style="position: absolute; top: 0px; overflow: auto; height: 50px">'
      + '<div id="div-1" style="padding: 0; margin: 0">'
      + '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>'
      + '</div>'
      + '</div>'

    $(navbarHtml).appendTo('#qunit-fixture')

    var $content = $(contentHtml)
      .appendTo('#qunit-fixture')
      .bootstrapScrollspy({ offset: 0, target: '#navigation' })

    !function testActiveElements() {
      if (++times > 3) return done()

      $content.one('scroll', function () {
        assert.ok($('#a-1').hasClass('active'), 'nav item for outer element has "active" class')
        assert.ok($('#a-2').hasClass('active'), 'nav item for inner element has "active" class')
        testActiveElements()
      })

      $content.scrollTop($content.scrollTop() + 10)
    }()
  })

  QUnit.test('should clear selection if above the first section', function (assert) {
    assert.expect(3)
    var done = assert.async()

    var sectionHTML = '<div id="header" style="height: 500px;"></div>'
        + '<nav id="navigation" class="navbar">'
        + '<ul class="nav navbar-nav">'
        + '<li><a id="one-link"   class="nav-link active" href="#one">One</a></li>'
        + '<li><a id="two-link"   class="nav-link" href="#two">Two</a></li>'
        + '<li><a id="three-link" class="nav-link" href="#three">Three</a></li>'
        + '</ul>'
        + '</nav>'
    $(sectionHTML).appendTo('#qunit-fixture')

    var scrollspyHTML = '<div id="content" style="height: 200px; overflow-y: auto;">'
        + '<div id="spacer" style="height: 100px;"/>'
        + '<div id="one" style="height: 100px;"/>'
        + '<div id="two" style="height: 100px;"/>'
        + '<div id="three" style="height: 100px;"/>'
        + '<div id="spacer" style="height: 100px;"/>'
        + '</div>'
    var $scrollspy = $(scrollspyHTML).appendTo('#qunit-fixture')

    $scrollspy
      .bootstrapScrollspy({
        target: '#navigation',
        offset: $scrollspy.position().top
      })
      .one('scroll', function () {
        assert.strictEqual($('.active').length, 1, '"active" class on only one element present')
        assert.strictEqual($('.active').is('#two-link'), true, '"active" class on second section')
        $scrollspy
          .one('scroll', function () {
            assert.strictEqual($('.active').length, 0, 'selection cleared')
            done()
          })
          .scrollTop(0)
      })
      .scrollTop(201)
  })

  QUnit.test('should correctly select navigation element on backward scrolling when each target section height is 100%', function (assert) {
    assert.expect(5)
    var navbarHtml =
        '<nav class="navbar">'
      + '<ul class="nav">'
      + '<li><a id="li-100-1" class="nav-link" href="#div-100-1">div 1</a></li>'
      + '<li><a id="li-100-2" class="nav-link" href="#div-100-2">div 2</a></li>'
      + '<li><a id="li-100-3" class="nav-link" href="#div-100-3">div 3</a></li>'
      + '<li><a id="li-100-4" class="nav-link" href="#div-100-4">div 4</a></li>'
      + '<li><a id="li-100-5" class="nav-link" href="#div-100-5">div 5</a></li>'
      + '</ul>'
      + '</nav>'
    var contentHtml =
        '<div class="content" style="position: relative; overflow: auto; height: 100px">'
      + '<div id="div-100-1" style="position: relative; height: 100%; padding: 0; margin: 0">div 1</div>'
      + '<div id="div-100-2" style="position: relative; height: 100%; padding: 0; margin: 0">div 2</div>'
      + '<div id="div-100-3" style="position: relative; height: 100%; padding: 0; margin: 0">div 3</div>'
      + '<div id="div-100-4" style="position: relative; height: 100%; padding: 0; margin: 0">div 4</div>'
      + '<div id="div-100-5" style="position: relative; height: 100%; padding: 0; margin: 0">div 5</div>'
      + '</div>'

    $(navbarHtml).appendTo('#qunit-fixture')
    var $content = $(contentHtml)
      .appendTo('#qunit-fixture')
      .bootstrapScrollspy({ offset: 0, target: '.navbar' })

    var testElementIsActiveAfterScroll = function (element, target) {
      var deferred = $.Deferred()
      var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top)
      var done = assert.async()
      $content.one('scroll', function () {
        assert.ok($(element).hasClass('active'), 'target:' + target + ', element: ' + element)
        done()
        deferred.resolve()
      })
      $content.scrollTop(scrollHeight)
      return deferred.promise()
    }

    $.when(testElementIsActiveAfterScroll('#li-100-5', '#div-100-5'))
      .then(function () { return testElementIsActiveAfterScroll('#li-100-4', '#div-100-4') })
      .then(function () { return testElementIsActiveAfterScroll('#li-100-3', '#div-100-3') })
      .then(function () { return testElementIsActiveAfterScroll('#li-100-2', '#div-100-2') })
      .then(function () { return testElementIsActiveAfterScroll('#li-100-1', '#div-100-1') })
  })

  QUnit.test('should allow passed in option offset method: offset', function (assert) {
    assert.expect(4)

    var testOffsetMethod = function (type) {
      var deferred = $.Deferred()
      var navbarHtml =
          '<nav class="navbar"' + (type === 'data' ? ' id="navbar-offset-method-menu"' : '') + '>'
        + '<ul class="nav">'
        + '<li><a id="li-' + type + 'm-1" class="nav-link" href="#div-' + type + 'm-1">div 1</a></li>'
        + '<li><a id="li-' + type + 'm-2" class="nav-link" href="#div-' + type + 'm-2">div 2</a></li>'
        + '<li><a id="li-' + type + 'm-3" class="nav-link" href="#div-' + type + 'm-3">div 3</a></li>'
        + '</ul>'
        + '</nav>'
      var contentHtml =
          '<div class="content"' + (type === 'data' ? ' data-spy="scroll" data-target="#navbar-offset-method-menu" data-offset="0" data-method="offset"' : '') + ' style="position: relative; overflow: auto; height: 100px">'
        + '<div id="div-' + type + 'm-1" style="position: relative; height: 200px; padding: 0; margin: 0">div 1</div>'
        + '<div id="div-' + type + 'm-2" style="position: relative; height: 150px; padding: 0; margin: 0">div 2</div>'
        + '<div id="div-' + type + 'm-3" style="position: relative; height: 250px; padding: 0; margin: 0">div 3</div>'
        + '</div>'


      $(navbarHtml).appendTo('#qunit-fixture')
      var $content = $(contentHtml)
        .appendTo('#qunit-fixture')

      if (type === 'js') $content.bootstrapScrollspy({ target: '.navbar', offset: 0, method: 'offset' })
      else if (type === 'data') $(window).trigger('load')

      var $target = $('#div-' + type + 'm-2')
      var scrollspy = $content.data('bs.scrollspy')

      assert.ok(scrollspy._offsets[1] === $target.offset().top, 'offset method with ' + type + ' option')
      assert.ok(scrollspy._offsets[1] !== $target.position().top, 'position method with ' + type + ' option')

      deferred.resolve()

      return deferred.promise()
    }

    $.when(testOffsetMethod('js'))
      .then(function () { testOffsetMethod('data') })
  })

  QUnit.test('should allow passed in option offset method: position', function (assert) {
    assert.expect(4)

    var testOffsetMethod = function (type) {
      var deferred = $.Deferred()
      var navbarHtml =
          '<nav class="navbar"' + (type === 'data' ? ' id="navbar-offset-method-menu"' : '') + '>'
        + '<ul class="nav">'
        + '<li><a class="nav-link" id="li-' + type + 'm-1" href="#div-' + type + 'm-1">div 1</a></li>'
        + '<li><a class="nav-link" id="li-' + type + 'm-2" href="#div-' + type + 'm-2">div 2</a></li>'
        + '<li><a class="nav-link" id="li-' + type + 'm-3" href="#div-' + type + 'm-3">div 3</a></li>'
        + '</ul>'
        + '</nav>'
      var contentHtml =
          '<div class="content"' + (type === 'data' ? ' data-spy="scroll" data-target="#navbar-offset-method-menu" data-offset="0" data-method="position"' : '') + ' style="position: relative; overflow: auto; height: 100px">'
        + '<div id="div-' + type + 'm-1" style="position: relative; height: 200px; padding: 0; margin: 0">div 1</div>'
        + '<div id="div-' + type + 'm-2" style="position: relative; height: 150px; padding: 0; margin: 0">div 2</div>'
        + '<div id="div-' + type + 'm-3" style="position: relative; height: 250px; padding: 0; margin: 0">div 3</div>'
        + '</div>'


      $(navbarHtml).appendTo('#qunit-fixture')
      var $content = $(contentHtml)
        .appendTo('#qunit-fixture')

      if (type === 'js') $content.bootstrapScrollspy({ target: '.navbar', offset: 0, method: 'position' })
      else if (type === 'data') $(window).trigger('load')

      var $target = $('#div-' + type + 'm-2')
      var scrollspy = $content.data('bs.scrollspy')

      assert.ok(scrollspy._offsets[1] !== $target.offset().top, 'offset method with ' + type + ' option')
      assert.ok(scrollspy._offsets[1] === $target.position().top, 'position method with ' + type + ' option')

      deferred.resolve()

      return deferred.promise()
    }

    $.when(testOffsetMethod('js'))
      .then(function () { testOffsetMethod('data') })
  })

})
