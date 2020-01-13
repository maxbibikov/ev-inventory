// nav selector
function selectCurrentRoute() {
    const currentRoute = location.pathname;
    if (
        currentRoute.includes('/inventory/vehicle-instances') ||
        currentRoute.includes('/inventory/vehicle-instance')
    ) {
        return document
            .getElementById('nav_vehicle_shop')
            .classList.add('mdc-list-item--activated');
    }
    if (
        currentRoute.includes('/inventory/vehicles') ||
        currentRoute.includes('/inventory/vehicle')
    ) {
        return document
            .getElementById('nav_vehicles')
            .classList.add('mdc-list-item--activated');
    }
    if (
        currentRoute.includes('/inventory/categories') ||
        currentRoute.includes('/inventory/category')
    ) {
        return document
            .getElementById('nav_categories')
            .classList.add('mdc-list-item--activated');
    }

    return document
        .getElementById('nav_inventory')
        .classList.add('mdc-list-item--activated');
}
selectCurrentRoute();

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

const vehicleControllsUpdate = document.querySelector(
    '.vehicle-controls__update'
);

if (vehicleControllsUpdate) {
    const vehicleUpdateButton = new mdc.ripple.MDCRipple(
        vehicleControllsUpdate
    );
    const vehicleDeleteButton = new mdc.ripple.MDCRipple(
        document.querySelector('.vehicle-controls__delete')
    );
    vehicleDeleteButton.listen('click', () => {
        deleteConfirmDialogMDC.open();
    });
    const deleteConfirmDialog = document.querySelector(
        '.delete-confirm-dialog'
    );
    const deleteConfirmDialogMDC = new mdc.dialog.MDCDialog(
        deleteConfirmDialog
    );

    deleteConfirmDialogMDC.listen('MDCDialog:closing', event => {
        if (event.detail.action === 'delete') {
        }
    });
}

const drawerElement = document.querySelector('.mdc-drawer');
const drawer = new mdc.drawer.MDCDrawer(drawerElement);

const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarElement);

topAppBar.setScrollTarget(document.querySelector('.main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});
