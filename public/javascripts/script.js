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

// DRAWER MENU
const drawerElement = document.querySelector('.mdc-drawer');
const drawer = new mdc.drawer.MDCDrawer(drawerElement);

const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarElement);

topAppBar.setScrollTarget(document.querySelector('.main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});
