export function isPhoneNumberValid(number) {
    var exp = /^[1-9]{2}[1-9]{4,5}[0-9]{4}$/g; return exp.test(number)
}
export function isNameValid(name) {
    var exp = /^[\w\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]{5,50}$/g; return exp.test(name)
}
export function isEmailValid(email) {
    var exp = /^([\w-]\.?)+@([\w-]+\.)+([A-Za-z]{2,4})+$/g; return exp.test(email)
}

export function isTitleValid(title) {
    var exp = /^[A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]{5,50}$/g; return exp.test(title)
}

export function isAddressValid(address) {
    var exp = /^[\w\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]{10,100}$/g; return exp.test(address)
}