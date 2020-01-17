const categoryControllsUpdate = document.querySelector(
    '.category-controls__update'
);

const categoryUpdateButton = new mdc.ripple.MDCRipple(categoryControllsUpdate);
const categoryDeleteButton = new mdc.ripple.MDCRipple(
    document.querySelector('.category-controls__delete')
);
const adminPassInput = new mdc.textField.MDCTextField(
    document.querySelector('.admin-pass')
);

categoryDeleteButton.listen('click', () => {
    deleteConfirmDialogMDC.open();
});
const deleteConfirmDialog = document.querySelector('.delete-confirm-dialog');
const deleteConfirmDialogMDC = new mdc.dialog.MDCDialog(deleteConfirmDialog);

deleteConfirmDialogMDC.listen('MDCDialog:closing', event => {
    if (event.detail.action === 'delete') {
    }
});
