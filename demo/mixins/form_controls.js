var FormControls = {
  renderTextField: function(markup, fieldName, labelText) {
    markup.div({ class: 'form-group' }, function(m) {
      m.labelFor(fieldName, labelText);
      m.textField(fieldName, { class: 'form-control' });
    })
  },

  renderTextareaField: function(markup, fieldName, labelText) {
    markup.div({ class: 'form-group' }, function(m) {
      m.labelFor(fieldName, labelText);
      m.textareaField(fieldName, { class: 'form-control' });
    })
  },

  renderButtons: function(markup) {
    markup.div({ class: 'form-group' }, function(m) {
      m.btn('Submit', { class: 'btn btn-primary' });
      m.btn('Cancel', { class: 'btn btn-default' });
    })
  }
}
