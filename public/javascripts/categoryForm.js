const categoryNameInput = document.querySelector('.category-name-text-field');
const categoryNameMDCInput = new mdc.textField.MDCTextField(categoryNameInput);
const adminPassInput = document.querySelector('.admin-pass-text-field');
if (adminPassInput) {
    const adminPassMDCTextField = new mdc.textField.MDCTextField(
        adminPassInput
    );
}

const submitBtn = document.querySelector('.mdc-button');
const submitBtnRipple = new mdc.ripple.MDCRipple(submitBtn);
