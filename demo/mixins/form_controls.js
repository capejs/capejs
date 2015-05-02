var FormControls = {
  renderTextField: function(markup, fieldName, labelText) {
    markup.div({ class: 'form-group' }, function(m) {
      m.labelFor(fieldName, labelText).sp();
      m.textField(fieldName, { class: 'form-control' });
    })
  },

  renderTextareaField: function(markup, fieldName, labelText) {
    markup.div({ class: 'form-group' }, function(m) {
      m.labelFor(fieldName, labelText).sp();
      m.textareaField(fieldName, { class: 'form-control' });
    })
  },

  renderButtons: function(markup) {
    markup.div({ class: 'form-group' }, function(m) {
      m.button('Submit', { class: 'btn btn-primary' }).sp();
      m.button('Cancel', { class: 'btn btn-default' })
    })
  }
}
