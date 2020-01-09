const brandElement = document.querySelector('.brand');
if (brandElement) {
    const brand = new mdc.textField.MDCTextField(brandElement);

    const model = new mdc.textField.MDCTextField(
        document.querySelector('.model')
    );
    const description = new mdc.textField.MDCTextField(
        document.querySelector('.description')
    );
    const selectCategory = new mdc.select.MDCSelect(
        document.querySelector('.category')
    );

    selectCategory.listen('MDCSelect:change', () => {
        const categoryID = document.querySelector('#categoryID');
        categoryID.value = selectCategory.value;
    });
}

const vehicleUpdateButton = new mdc.ripple.MDCRipple(
    document.querySelector('.vehicle-controls__update')
);
const vehicleDeleteButton = new mdc.ripple.MDCRipple(
    document.querySelector('.vehicle-controls__delete')
);
const deleteConfirmDialog = document.querySelector('.delete-confirm-dialog');
const deleteConfirmDialogMDC = new mdc.dialog.MDCDialog(deleteConfirmDialog);

vehicleDeleteButton.listen('click', () => {
    deleteConfirmDialogMDC.open()
});

deleteConfirmDialogMDC.listen('MDCDialog:closing', (event) => {
    
    if (event.detail.action === 'delete'){
        console.log('DELETEDDG');
    }
})
