const vehicleControllsUpdate = document.querySelector(
    '.vehicle-controls__update'
);

const vehicleUpdateButton = new mdc.ripple.MDCRipple(vehicleControllsUpdate);
const vehicleDeleteButton = new mdc.ripple.MDCRipple(
    document.querySelector('.vehicle-controls__delete')
);
const adminPassInput = new mdc.textField.MDCTextField(
    document.querySelector('.admin-pass')
);

vehicleDeleteButton.listen('click', () => {
    deleteConfirmDialogMDC.open();
});
const deleteConfirmDialog = document.querySelector('.delete-confirm-dialog');
const deleteConfirmDialogMDC = new mdc.dialog.MDCDialog(deleteConfirmDialog);

deleteConfirmDialogMDC.listen('MDCDialog:closing', event => {
    if (event.detail.action === 'delete') {
    }
});
