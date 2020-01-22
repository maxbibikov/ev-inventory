const brandElement = document.querySelector('.brand');

const brand = new mdc.textField.MDCTextField(brandElement);

const model = new mdc.textField.MDCTextField(document.querySelector('.model'));
const description = new mdc.textField.MDCTextField(
    document.querySelector('.description')
);
const selectCategory = new mdc.select.MDCSelect(
    document.querySelector('.category')
);
const adminTextField = document.querySelector('.admin-pass-text-field');
if (adminTextField) {
    const admin_pass = new mdc.textField.MDCTextField(adminTextField);
}

selectCategory.listen('MDCSelect:change', () => {
    const categoryID = document.querySelector('#categoryID');
    categoryID.value = selectCategory.value;
});
