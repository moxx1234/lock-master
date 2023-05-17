const getNumbersInput = (input) => {
	return input.value.replace(/\D/g, '')
}
export const onPhoneInput = (e) => {
	const input = e.target
	let inputNumbersValue = getNumbersInput(input),
		result = '',
		firstSymbol = '',
		selectionStart = input.selectionStart

	if (input.value.length !== selectionStart) {
		if (e.data && /\D/g.test(e.data)) {
			input.value = inputNumbersValue
		}
		return
	}

	if (inputNumbersValue[0] === '9' || e.data === '+') {
		inputNumbersValue = `7${inputNumbersValue}`
	}

	firstSymbol = inputNumbersValue[0] === '8' ? '8' : '+7'
	result = firstSymbol

	if (!inputNumbersValue.length) {
		result = ''
	}
	if (inputNumbersValue.length > 1) {
		result += ` (${inputNumbersValue.substring(1, 4)}`
	}
	if (inputNumbersValue.length >= 5) {
		result += `) ${inputNumbersValue.substring(4, 7)}`
	}
	if (inputNumbersValue.length >= 8) {
		result += `-${inputNumbersValue.substring(7, 9)}`
	}
	if (inputNumbersValue.length >= 10) {
		result += `-${inputNumbersValue.substring(9, 11)}`
	}

	input.value = result
}
