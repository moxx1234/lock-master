import { CHAT_ID, TOKEN } from "../app.js"
const requiredParams = ['username', 'phone']
let userProblem = ''

export const getFormTrigger = (HTMLObjext) => {
	const suitableParents = Array.from(document.querySelectorAll('.problem'))
	if (suitableParents.includes(HTMLObjext.parentNode)) {
		const problemText = HTMLObjext.parentNode.querySelector('p')
		userProblem = problemText.innerHTML
	}
}

const showError = (input, type) => {
	let message = ''
	const getInputName = (input) => {
		switch (input.name) {
			case 'username': return 'Имя'
			case 'phone': return 'Телефон'
		}
	}

	switch (type) {
		case 'required':
			message = `Пожалуйста, введите ${getInputName(input)}`
			break
		case 'invalidFormat':
			message = `Неверный формат в поле ${getInputName(input)}`
			break
	}

	const error = document.createElement('p')
	error.id = 'error-message'
	error.innerHTML = message
	document.body.appendChild(error)

	setTimeout(() => { error.remove() }, 3000)
}

export const validate = (element) => {
	if (requiredParams.includes(element.name)) {
		if (!element.value) {
			showError(element, 'required')
			return false
		}
		if (element.type === 'tel') {
			const value = element.value
			if (value[0] === '8' && value.length === 17 || (value[0] === '+' && value.length === 18)) { return true }

			showError(element, 'invalidFormat')
			return false
		}
	}

	return true
}

const fetchBodies = (data) => {
	const userData = new FormData()
	const additionalKeys = [], body = {}
	const phoneNumber = data.get('phone')
	const anchorNumber = phoneNumber.replace(/[\s]/g, '').replace(/[()]/g, '-')
	let message = `
	<strong> Новая заявка! </strong>

Телефон: <a>${anchorNumber}</a>
`
	data.delete('phone')

	if (data.has('username')) {
		message += `Имя: <strong>${data.get('username')}</strong>

`
		data.delete('username')
	}

	if (data.has('document')) {
		userData.append('document', data.get('document'))
		data.delete('document')
	}

	for (const pairs of data.entries()) {
		if (pairs[1]) {
			message += `${pairs[0]}: ${pairs[1]}
`
		}
		additionalKeys.push(pairs[0])
	}
	additionalKeys.forEach(key => {
		data.delete(key)
	})

	if (userProblem) {
		message += `Проблема: ${userProblem}`
	}

	if (userData.has('document') && userData.get('document').size !== 0) {
		userData.append('caption', message)
		userData.append('chat_id', CHAT_ID)
		userData.append('parse_mode', 'HTML')
		return userData
	} else {
		body.chat_id = CHAT_ID
		body.text = message
		body.parse_mode = 'HTML'
		return JSON.stringify(body)
	}
}

const submitForm = (form) => {
	const formData = new FormData(form)
	const textAreaArr = Array.from(form.children).filter(child => child.localName === 'textarea')
	if (textAreaArr.length) {
		textAreaArr.forEach(area => {
			formData.append('Дополнительно', area.value)
		})
	}

	const sendData = (data) => {
		const URI_TEXT = `https://api.telegram.org/bot${TOKEN}/sendMessage`,
			URI_DOC = `https://api.telegram.org/bot${TOKEN}/sendDocument`,
			HEADERS_DOC = {},
			HEADERS_TEXT = { "Content-type": "application/json; charset=UTF-8" }

		const fetchBody = fetchBodies(data)

		if (typeof fetchBody === 'string') {
			fetch(URI_TEXT, {
				method: 'POST',
				body: fetchBody,
				headers: HEADERS_TEXT
			}).then(response => {
				if (response.ok) {
					alert('Форма успешно отправлена!')
					location.reload()
				}
			})
		} else {
			fetch(URI_DOC, {
				method: 'POST',
				body: fetchBody,
				headers: HEADERS_DOC
			}).then(response => {
				if (response.ok) {
					alert('Форма успешно отправлена!')
					location.reload()
				}
			})
		}

	}

	sendData(formData)
}

export const onSubmit = (e) => {
	e.preventDefault()
	const allInputs = e.target.querySelectorAll('input, textarea')
	const formValidate = () => {
		const validationArray = []
		allInputs.forEach(input => {
			validationArray.push(validate(input))
		})
		return validationArray.includes(false) ? false : true
	}

	if (formValidate()) {
		submitForm(e.target)
	} else {
		alert('Форма не отправлена. Пожалуйста, проверьте все поля!')
	}
}