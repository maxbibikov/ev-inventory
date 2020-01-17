const vehicleDeleteButton = document.querySelector('#delete_vehicle_instance');

vehicleDeleteButton.addEventListener('click', () => {
    deleteConfirmDialogMDC.open();
});
const deleteConfirmDialog = document.querySelector('.delete-confirm-dialog');
const deleteConfirmDialogMDC = new mdc.dialog.MDCDialog(deleteConfirmDialog);

deleteConfirmDialogMDC.listen('MDCDialog:closing', event => {
    if (event.detail.action === 'delete') {
    }
});

const adminPassEl = document.querySelector('.admin-pass');
const adiminPassMDCTextField = new mdc.textField.MDCTextField(adminPassEl);
