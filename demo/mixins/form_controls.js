'use strict'

let FormControls = {
  renderTextField: (m, fieldName, labelText) => {
    m.div({ class: 'form-group' }, function(m) {
      m.labelFor(fieldName, labelText);
      m.textField(fieldName, { class: 'form-control' });
    })
  },

  renderTextareaField: (m, fieldName, labelText) => {
    m.div({ class: 'form-group' }, function(m) {
      m.labelFor(fieldName, labelText);
      m.textareaField(fieldName, { class: 'form-control' });
    })
  },

  renderButtons: m => {
    m.div({ class: 'form-group' }, function(m) {
      m.btn('Submit', { class: 'btn btn-primary' });
      m.btn('Cancel', { class: 'btn btn-default' });
    })
  }
}
