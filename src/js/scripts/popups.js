import { getFormTrigger } from "./formsHandler.js"
const popupLinks = document.querySelectorAll('.popup-link')
const body = document.querySelector('body')
const closePopupButton = document.querySelectorAll('.close-popup')
const windowWrapper = document.querySelector('.wrapper')
const animationDuration = 300

if (popupLinks.length) {
	popupLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault()
			getFormTrigger(e.target)
			const relatedPopup = document.getElementById(link.getAttribute('href').replace('#', ''))
			openPopup(relatedPopup)
		})
	})
}
if (closePopupButton.length) {
	closePopupButton.forEach(button => {
		button.addEventListener('click', e => {
			e.preventDefault()
		})
	})
}

const openPopup = (popup) => {
	const activePopup = document.querySelector('.popup.open')
	if (activePopup) {
		closePopup(activePopup, false)
	} else {
		bodyLock()
	}
	body.style.overflow = 'hidden'
	popup.classList.add('open')
	popup.addEventListener('click', e => {
		if (!e.target.closest('.popup__content')) {
			closePopup(popup)
		}
	})
}
const closePopup = (popup, doUnlock = true) => {
	popup.classList.remove('open')
	if (doUnlock) {
		setTimeout(() => {
			body.style.paddingRight = 0
			body.style.overflow = 'auto'
		}, animationDuration)
	}
}
const bodyLock = () => {
	const paddingValue = window.innerWidth - windowWrapper.clientWidth
	body.style.paddingRight = `${paddingValue}px`
}