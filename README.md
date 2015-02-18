# Metova Angular Components [![Build Status](https://travis-ci.org/metova/metovular.svg?branch=master)](https://travis-ci.org/metova/metovular)

This bower package provides several utilities for developing angular apps.

## Installation

```
npm install -g bower
bower install metova/metovular
```

Add the --save flag to persist to your bower.json

## Usage

### FormFor

This was built to operate sortof similarly to the form-for helpers in rails. The form fields will be wrapped in bootstrap form wrappers and get errors from setting .errors on the item.

```html
<ma-form-for
    item="an_item"
    options="{ 'showCancel': false, 'showSubmit': true }"
    on-submit="submitFn()"
    on-cancel="cancelFn()">
  <ma-input
      for="a_field"
      id="item_field"></ma-input>
</ma-form-for>
```

- ma-form-for
  - item: the object for the form
  - on-submit: the submit callback
  - on-cancel: the cancel callback
  - options:
    - showCancel: show the cancel button (default: false)
    - showSubmit: show the submit button (default: true)
    - labelClass: class to apply on labels
    - controlClass: class to apply on controls

- ma-input
  - for: the attribute on the form item
  - id: the id of the input
  - type: datepicker|radio-buttons|platform-check-buttons|select2|select2-multi|select|<other>(creates an input with type="<other>")
  - if: conditional passed to ng-if (default: true)
  - label: label text for the control (default: )
  - maxlength: max length for text inputs (default: )
  - required: sets ng-required on the field (default: false)
  - placeholder: placeholder text
  - disabled: sets ng-disabled on the field (default: false)
  - options: array of options for select fields (each option can either be a string or an object like { label: 'label', value: 'value' })


### HttpService

This is a simple wrapper over ngResource that returns the promises and exposes a rails-like interface.

```javascript
angular.module('my-module', ['metovular'])

.factory('TaskService', function(HttpService) {
  return new HttpService('/api/tasks/:id');
})

.controller('TaskController', function(TaskService) {
  // Get all the tasks
  TaskService.all(); // returns a promise, so use .then to get at the data

  // Get a task
  TaskService.find(1); // get a task with id: 1

  TaskService.create(someTask);

  TaskService.update(someTask);

  TaskService.delete(someTask);
})
```