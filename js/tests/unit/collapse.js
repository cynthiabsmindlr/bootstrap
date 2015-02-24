$(function () {
  'use strict';

  QUnit.module('collapse plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.ok($(document.body).collapse, 'collapse method is defined')
  })

  QUnit.module('collapse', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapCollapse = $.fn.collapse.noConflict()
    },
    teardown: function () {
      $.fn.collapse = $.fn.bootstrapCollapse
      delete $.fn.bootstrapCollapse
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.strictEqual($.fn.collapse, undefined, 'collapse was set back to undefined (org value)')
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    var $el = $('<div/>')
    var $collapse = $el.bootstrapCollapse()
    assert.ok($collapse instanceof $, 'returns jquery collection')
    assert.strictEqual($collapse[0], $el[0], 'collection contains element')
  })

  QUnit.test('should show a collapsed element', function (assert) {
    var $el = $('<div class="collapse"/>').bootstrapCollapse('show')

    assert.ok($el.hasClass('in'), 'has class "in"')
    assert.ok(!/height/i.test($el.attr('style')), 'has height reset')
  })

  QUnit.test('should hide a collapsed element', function (assert) {
    var $el = $('<div class="collapse"/>').bootstrapCollapse('hide')

    assert.ok(!$el.hasClass('in'), 'does not have class "in"')
    assert.ok(/height/i.test($el.attr('style')), 'has height set')
  })

  QUnit.test('should not fire shown when show is prevented', function (assert) {
    var done = assert.async()

    $('<div class="collapse"/>')
      .on('show.bs.collapse', function (e) {
        e.preventDefault()
        assert.ok(true, 'show event fired')
        done()
      })
      .on('shown.bs.collapse', function () {
        assert.ok(false, 'shown event fired')
      })
      .bootstrapCollapse('show')
  })

  QUnit.test('should reset style to auto after finishing opening collapse', function (assert) {
    var done = assert.async()

    $('<div class="collapse" style="height: 0px"/>')
      .on('show.bs.collapse', function () {
        assert.strictEqual(this.style.height, '0px', 'height is 0px')
      })
      .on('shown.bs.collapse', function () {
        assert.strictEqual(this.style.height, '', 'height is auto')
        done()
      })
      .bootstrapCollapse('show')
  })

  QUnit.test('should remove "collapsed" class from target when collapse is shown', function (assert) {
    var done = assert.async()

    var $target = $('<a data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.ok(!$target.hasClass('collapsed'))
        done()
      })

    $target.click()
  })

  QUnit.test('should add "collapsed" class to target when collapse is hidden', function (assert) {
    var done = assert.async()

    var $target = $('<a data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.ok($target.hasClass('collapsed'))
        done()
      })

    $target.click()
  })

  QUnit.test('should not close a collapse when initialized with "show" if already shown', function (assert) {
    var done = assert.async()

    assert.expect(0)

    var $test = $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hide.bs.collapse', function () {
        assert.ok(false)
      })

    $test.bootstrapCollapse('show')

    setTimeout(done, 0)
  })

  QUnit.test('should open a collapse when initialized with "show" if not already shown', function (assert) {
    var done = assert.async()

    assert.expect(1)

    var $test = $('<div id="test1" />')
      .appendTo('#qunit-fixture')
      .on('show.bs.collapse', function () {
        assert.ok(true)
      })

    $test.bootstrapCollapse('show')

    setTimeout(done, 0)
  })

  QUnit.test('should remove "collapsed" class from active accordion target', function (assert) {
    var done = assert.async()

    var accordionHTML = '<div class="panel-group" id="accordion">'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.panel')

    var $target1 = $('<a data-toggle="collapse" href="#body1" data-parent="#accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="in"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" href="#body2" data-parent="#accordion"/>').appendTo($groups.eq(1))

    $('<div id="body2"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" href="#body3" data-parent="#accordion"/>').appendTo($groups.eq(2))

    $('<div id="body3"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        assert.ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        assert.ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        done()
      })

    $target3.click()
  })

  QUnit.test('should allow dots in data-parent', function (assert) {
    var done = assert.async()

    var accordionHTML = '<div class="panel-group accordion">'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.panel')

    var $target1 = $('<a data-toggle="collapse" href="#body1" data-parent=".accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="in"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" href="#body2" data-parent=".accordion"/>').appendTo($groups.eq(1))

    $('<div id="body2"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" href="#body3" data-parent=".accordion"/>').appendTo($groups.eq(2))

    $('<div id="body3"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.ok($target1.hasClass('collapsed'), 'inactive target 1 does have class "collapsed"')
        assert.ok($target2.hasClass('collapsed'), 'inactive target 2 does have class "collapsed"')
        assert.ok(!$target3.hasClass('collapsed'), 'active target 3 does not have class "collapsed"')

        done()
      })

    $target3.click()
  })

  QUnit.test('should set aria-expanded="true" on target when collapse is shown', function (assert) {
    var done = assert.async()

    var $target = $('<a data-toggle="collapse" class="collapsed" href="#test1" aria-expanded="false"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'true', 'aria-expanded on target is "true"')
        done()
      })

    $target.click()
  })

  QUnit.test('should set aria-expanded="false" on target when collapse is hidden', function (assert) {
    var done = assert.async()

    var $target = $('<a data-toggle="collapse" href="#test1" aria-expanded="true"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.strictEqual($target.attr('aria-expanded'), 'false', 'aria-expanded on target is "false"')
        done()
      })

    $target.click()
  })

  QUnit.test('should change aria-expanded from active accordion target to "false" and set the newly active one to "true"', function (assert) {
    var done = assert.async()

    var accordionHTML = '<div class="panel-group" id="accordion">'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '</div>'
    var $groups = $(accordionHTML).appendTo('#qunit-fixture').find('.panel')

    var $target1 = $('<a data-toggle="collapse" href="#body1" data-parent="#accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" aria-expanded="true" class="in"/>').appendTo($groups.eq(0))

    var $target2 = $('<a class="collapsed" data-toggle="collapse" href="#body2" data-parent="#accordion"/>').appendTo($groups.eq(1))

    $('<div id="body2" aria-expanded="false"/>').appendTo($groups.eq(1))

    var $target3 = $('<a class="collapsed" data-toggle="collapse" href="#body3" data-parent="#accordion"/>').appendTo($groups.eq(2))

    $('<div id="body3" aria-expanded="false"/>')
      .appendTo($groups.eq(2))
      .on('shown.bs.collapse', function () {
        assert.strictEqual($target1.attr('aria-expanded'), 'false', 'inactive target 1 has aria-expanded="false"')
        assert.strictEqual($target2.attr('aria-expanded'), 'false', 'inactive target 2 has aria-expanded="false"')
        assert.strictEqual($target3.attr('aria-expanded'), 'true', 'active target 3 has aria-expanded="false"')

        done()
      })

    $target3.click()
  })

  QUnit.test('should not fire show event if show is prevented because other element is still transitioning', function (assert) {
    var done = assert.async()

    var accordionHTML = '<div id="accordion">'
        + '<div class="panel"/>'
        + '<div class="panel"/>'
        + '</div>'
    var showFired = false
    var $groups   = $(accordionHTML).appendTo('#qunit-fixture').find('.panel')

    var $target1 = $('<a data-toggle="collapse" href="#body1" data-parent="#accordion"/>').appendTo($groups.eq(0))

    $('<div id="body1" class="collapse"/>')
      .appendTo($groups.eq(0))
      .on('show.bs.collapse', function () {
        showFired = true
      })

    var $target2 = $('<a data-toggle="collapse" href="#body2" data-parent="#accordion"/>').appendTo($groups.eq(1))
    var $body2   = $('<div id="body2" class="collapse"/>').appendTo($groups.eq(1))

    $target2.click()

    $body2
      .toggleClass('in collapsing')
      .data('bs.collapse').transitioning = 1

    $target1.click()

    setTimeout(function () {
      assert.ok(!showFired, 'show event didn\'t fire')
      done()
    }, 1)
  })

  QUnit.test('should add "collapsed" class to target when collapse is hidden via manual invocation', function (assert) {
    var done = assert.async()

    var $target = $('<a data-toggle="collapse" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1" class="in"/>')
      .appendTo('#qunit-fixture')
      .on('hidden.bs.collapse', function () {
        assert.ok($target.hasClass('collapsed'))
        done()
      })
      .bootstrapCollapse('hide')
  })

  QUnit.test('should remove "collapsed" class from target when collapse is shown via manual invocation', function (assert) {
    var done = assert.async()

    var $target = $('<a data-toggle="collapse" class="collapsed" href="#test1"/>').appendTo('#qunit-fixture')

    $('<div id="test1"/>')
      .appendTo('#qunit-fixture')
      .on('shown.bs.collapse', function () {
        assert.ok(!$target.hasClass('collapsed'))
        done()
      })
      .bootstrapCollapse('show')
  })

})
