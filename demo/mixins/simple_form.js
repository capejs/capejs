"use strict";

var SimpleForm = Cape.createComponentClass({
  render: function(m) {
    m.p(function(m) {
      m.formFor('user', function(m) {
        this.renderTextField(m, 'family_name', 'Family Name');
        this.renderTextField(m, 'given_name', 'Given Name');
        this.renderTextareaField(m, 'remarks', 'Remarks');
        this.renderButtons(m);
      })
    })
  }
});

Cape.merge(SimpleForm.prototype, FormControls);
