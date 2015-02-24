$(function () {
  'use strict';

  QUnit.module('button plugin')

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.ok($(document.body).button, 'button method is defined')
  })

  QUnit.module('button', {
    setup: function () {
      // Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
      $.fn.bootstrapButton = $.fn.button.noConflict()
    },
    teardown: function () {
      $.fn.button = $.fn.bootstrapButton
      delete $.fn.bootstrapButton
    }
  })

  QUnit.test('should provide no conflict', function (assert) {
    assert.strictEqual($.fn.button, undefined, 'button was set back to undefined (org value)')
  })

  QUnit.test('should return jquery collection containing the element', function (assert) {
    var $el = $('<div/>')
    var $button = $el.bootstrapButton()
    assert.ok($button instanceof $, 'returns jquery collection')
    assert.strictEqual($button[0], $el[0], 'collection contains element')
  })

  QUnit.test('should return set state to loading', function (assert) {
    var $btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
    assert.equal($btn.html(), 'mdo', 'btn text equals mdo')
    $btn.bootstrapButton('loading')
    var done = assert.async()
    setTimeout(function () {
      assert.equal($btn.html(), 'fat', 'btn text equals fat')
      assert.ok($btn[0].hasAttribute('disabled'), 'btn is disabled')
      assert.ok($btn.hasClass('disabled'), 'btn has disabled class')
      done()
    }, 0)
  })

  QUnit.test('should return reset state', function (assert) {
    var $btn = $('<button class="btn" data-loading-text="fat">mdo</button>')
    assert.equal($btn.html(), 'mdo', 'btn text equals mdo')
    $btn.bootstrapButton('loading')
    var doneOne = assert.async()
    setTimeout(function () {
      assert.equal($btn.html(), 'fat', 'btn text equals fat')
      assert.ok($btn[0].hasAttribute('disabled'), 'btn is disabled')
      assert.ok($btn.hasClass('disabled'), 'btn has disabled class')
      doneOne()
      var doneTwo = assert.async()
      $btn.bootstrapButton('reset')
      setTimeout(function () {
        assert.equal($btn.html(), 'mdo', 'btn text equals mdo')
        assert.ok(!$btn[0].hasAttribute('disabled'), 'btn is not disabled')
        assert.ok(!$btn.hasClass('disabled'), 'btn does not have disabled class')
        doneTwo()
      }, 0)
    }, 0)
  })

  QUnit.test('should work with an empty string as reset state', function (assert) {
    var $btn = $('<button class="btn" data-loading-text="fat"/>')
    assert.equal($btn.html(), '', 'btn text equals ""')
    $btn.bootstrapButton('loading')
    var doneOne = assert.async()
    setTimeout(function () {
      assert.equal($btn.html(), 'fat', 'btn text equals fat')
      assert.ok($btn[0].hasAttribute('disabled'), 'btn is disabled')
      assert.ok($btn.hasClass('disabled'), 'btn has disabled class')
      doneOne()
      var doneTwo = assert.async()
      $btn.bootstrapButton('reset')
      setTimeout(function () {
        assert.equal($btn.html(), '', 'btn text equals ""')
        assert.ok(!$btn[0].hasAttribute('disabled'), 'btn is not disabled')
        assert.ok(!$btn.hasClass('disabled'), 'btn does not have disabled class')
        doneTwo()
      }, 0)
    }, 0)
  })

  QUnit.test('should toggle active', function (assert) {
    var $btn = $('<button class="btn" data-toggle="button">mdo</button>')
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class')
    $btn.bootstrapButton('toggle')
    assert.ok($btn.hasClass('active'), 'btn has class active')
  })

  QUnit.test('should toggle active when btn children are clicked', function (assert) {
    var $btn = $('<button class="btn" data-toggle="button">mdo</button>')
    var $inner = $('<i/>')
    $btn
      .append($inner)
      .appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class')
    $inner.click()
    assert.ok($btn.hasClass('active'), 'btn has class active')
  })

  QUnit.test('should toggle aria-pressed', function (assert) {
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>')
    assert.equal($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')
    $btn.bootstrapButton('toggle')
    assert.equal($btn.attr('aria-pressed'), 'true', 'btn aria-pressed state is true')
  })

  QUnit.test('should toggle aria-pressed when btn children are clicked', function (assert) {
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>')
    var $inner = $('<i/>')
    $btn
      .append($inner)
      .appendTo('#qunit-fixture')
    assert.equal($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false')
    $inner.click()
    assert.equal($btn.attr('aria-pressed'), 'true', 'btn aria-pressed state is true')
  })

  QUnit.test('should toggle active when btn children are clicked within btn-group', function (assert) {
    var $btngroup = $('<div class="btn-group" data-toggle="buttons"/>')
    var $btn = $('<button class="btn">fat</button>')
    var $inner = $('<i/>')
    $btngroup
      .append($btn.append($inner))
      .appendTo('#qunit-fixture')
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class')
    $inner.click()
    assert.ok($btn.hasClass('active'), 'btn has class active')
  })

  QUnit.test('should check for closest matching toggle', function (assert) {
    var groupHTML = '<div class="btn-group" data-toggle="buttons">'
      + '<label class="btn btn-primary active">'
      + '<input type="radio" name="options" id="option1" checked="true"> Option 1'
      + '</label>'
      + '<label class="btn btn-primary">'
      + '<input type="radio" name="options" id="option2"> Option 2'
      + '</label>'
      + '<label class="btn btn-primary">'
      + '<input type="radio" name="options" id="option3"> Option 3'
      + '</label>'
      + '</div>'
    var $group = $(groupHTML).appendTo('#qunit-fixture')

    var $btn1 = $group.children().eq(0)
    var $btn2 = $group.children().eq(1)

    assert.ok($btn1.hasClass('active'), 'btn1 has active class')
    assert.ok($btn1.find('input').prop('checked'), 'btn1 is checked')
    assert.ok(!$btn2.hasClass('active'), 'btn2 does not have active class')
    assert.ok(!$btn2.find('input').prop('checked'), 'btn2 is not checked')
    $btn2.find('input').click()
    assert.ok(!$btn1.hasClass('active'), 'btn1 does not have active class')
    assert.ok(!$btn1.find('input').prop('checked'), 'btn1 is checked')
    assert.ok($btn2.hasClass('active'), 'btn2 has active class')
    assert.ok($btn2.find('input').prop('checked'), 'btn2 is checked')

    $btn2.find('input').click() // clicking an already checked radio should not un-check it
    assert.ok(!$btn1.hasClass('active'), 'btn1 does not have active class')
    assert.ok(!$btn1.find('input').prop('checked'), 'btn1 is checked')
    assert.ok($btn2.hasClass('active'), 'btn2 has active class')
    assert.ok($btn2.find('input').prop('checked'), 'btn2 is checked')
  })

})
