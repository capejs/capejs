'use strict'

class SimpleForm extends Cape.Component {
  render(m) {
    m.p(m => {
      m.formFor('user', m => {
        this.renderTextField(m, 'family_name', 'Family Name')
        this.renderTextField(m, 'given_name', 'Given Name')
        this.renderTextareaField(m, 'remarks', 'Remarks')
        this.renderButtons(m)
      })
    })
  }
}

Cape.merge(SimpleForm.prototype, FormControls)
