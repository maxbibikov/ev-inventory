// Vehicle select
const vehicleSelect = new mdc.select.MDCSelect(
    document.getElementById('select_vehicle')
);
const selectVehicleInput = document.getElementById('vehicle');

vehicleSelect.listen('MDCSelect:change', () => {
    selectVehicleInput.value = vehicleSelect.value;
});

// Year select
const selectYear = new mdc.select.MDCSelect(
    document.getElementById('select_year')
);
const inputYear = document.getElementById('year_num');

selectYear.listen('MDCSelect:change', () => {
    inputYear.value = selectYear.value;
});

// Price input
const inputPrice = new mdc.textField.MDCTextField(
    document.getElementById('price')
);
// Max speed input
const inputMaxSpeed = new mdc.textField.MDCTextField(
    document.getElementById('max_speed')
);
// Max range input
const inputMaxRange = new mdc.textField.MDCTextField(
    document.getElementById('max_range')
);
// Battery capacity input
const inputBattery = new mdc.textField.MDCTextField(
    document.getElementById('battery')
);

// Admin password input
const adminInputEl = document.querySelector('.admin-pass-text-field');
if (adminInputEl) {
    const inputAdminPass = new mdc.textField.MDCTextField(adminInputEl);
}

// Condition select
const selectCondition = new mdc.select.MDCSelect(
    document.getElementById('select_condition')
);
const inputCondition = document.getElementById('condition');

selectCondition.listen('MDCSelect:change', () => {
    inputCondition.value = selectCondition.value;
});
