import * as functions from './modules/functions.js'
import { validate, onSubmit } from './scripts/formsHandler.js'
import { onPhoneInput } from './scripts/inputMasks.js'
import * as popups from './scripts/popups.js'
import Swiper, { Navigation } from 'swiper'
import 'swiper/css/bundle'

functions.isWebp()

document.addEventListener('DOMContentLoaded', () => {
	const preloader = document.querySelector('.preloader')
	preloader.classList.add('hide')
	document.body.style.overflow = 'auto'
	showMainScreen()
	createOnscrollAnimation()
})
const showMainScreen = () => {
	const mainSection = document.querySelector('.main__content')
	const animatedElements = [
		mainSection.querySelectorAll('li'),
		mainSection.querySelector('.main__button'),
		mainSection.querySelector('.main__picture'),
		mainSection.querySelector('.main__mousemove_lock'),

	]
	animatedElements.forEach((element, i) => {
		if (element[Symbol.iterator]) {
			element.forEach((item, index) => {
				item.style.transitionDelay = `.${index}s`
				item.classList.add('appeared')
				return
			})
		} else {
			element.style.transitionDelay = `.${i * 2}s`
			element.classList.add('appeared')
		}
	})
}

// ========== Problem determination section + data ========================

// polls constants
const pollsSection = document.querySelector('.polls')
const situationForm = pollsSection.querySelector('.polls__situation')
const allSituationForms = Array.from(situationForm.querySelectorAll('.situation-form')).map(form => form.id)
const progressDone = document.getElementById('progress-done')
const progressLeft = document.getElementById('progress-left')

// polls variables
let currentFormIndex = 0
let currentForm = allSituationForms[currentFormIndex]
let viewportWidth = window.innerWidth
let containerWidth = situationForm.clientWidth

// nav buttons
const nextButton = pollsSection.querySelector('#next-form')
const prevButton = pollsSection.querySelector('#prev-form')
const submitButton = pollsSection.querySelector('button')

// function declarations
const setRelevantWidth = () => {
	containerWidth = situationForm.clientWidth
	situationForm.scrollTo({
		left: containerWidth * currentFormIndex
	})
	viewportWidth = window.innerWidth
}
const nextSlide = () => {
	situationForm.scrollTo({
		left: containerWidth * (currentFormIndex + 1),
		behavior: 'smooth'
	})
	currentFormIndex++
	currentForm = allSituationForms[currentFormIndex]
	progressDone.style.width = `${currentFormIndex / (allSituationForms.length - 1) * 100}%`
	progressLeft.style.width = `${100 - currentFormIndex / (allSituationForms.length - 1) * 100}%`
	if (currentFormIndex === allSituationForms.length - 1) {
		nextButton.classList.remove('active')
		submitButton.classList.add('active')
	}
}
const prevSlide = () => {
	situationForm.scrollTo({
		left: containerWidth * (currentFormIndex - 1),
		behavior: 'smooth',
	})
	currentFormIndex--
	currentForm = allSituationForms[currentFormIndex]
	progressDone.style.width = `${currentFormIndex / (allSituationForms.length - 1) * 100}%`
	progressLeft.style.width = `${100 - currentFormIndex / (allSituationForms.length - 1) * 100}%`
}

// listeners
nextButton.addEventListener('click', e => {
	e.preventDefault()
	if (nextButton.classList.contains('submit-form')) {
		submitButton.classList.add('active')
	}
	if (currentFormIndex < allSituationForms.length - 1) {
		nextSlide()
	}
})
prevButton.addEventListener('click', e => {
	e.preventDefault()
	if (currentFormIndex > 0) {
		prevSlide()
		if (currentFormIndex === allSituationForms.length - 2) {
			nextButton.classList.add('active')
			submitButton.classList.remove('active')
		}
	}
})
window.addEventListener('resize', () => {
	setRelevantWidth()
})
// ========================================================================

// ================== Swiper initialization + settings ====================
const swiper = new Swiper('.swiper', {
	modules: [Navigation],
	loop: true,
	centeredSlides: true,

	autoplay: {
		delay: 4000,
		disableOnInteraction: true,
	},

	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	breakpoints: {
		426: {
			slidesPerView: 3,
			spaceBetween: 40,
			autoplay: {
				disableOnInteraction: false,
			}
		},
		768: {
			slidesPerView: 3,
			spaceBetween: 100,
			autoplay: {
				disableOnInteraction: false,
			}
		},
	}
})
// ========================================================================

// =========================== Contact button =============================
const bigContactButton = document.querySelector('.main__button')
const smallContactButton = document.querySelector('.contact-master')

const bigButtonObserver = new IntersectionObserver(entries => {
	smallContactButton.classList.toggle('active', !entries[0].isIntersecting)

}, {
	threshold: 0.5,
})
bigButtonObserver.observe(bigContactButton)

// ========================================================================

// ========================= onScroll animation ===========================

const createOnscrollAnimation = () => {
	// *all except main section
	const allLists = Array.from(document.querySelectorAll('ul'))
		.filter(item => item.className.includes('main') === false)
		.filter(item => item.classList.contains('contact-us__links') === false)
		.filter(item => item.classList.contains('footer__list') === false)

	const allTitles = Array.from(document.querySelectorAll('.title, .thin-title'))
		.filter(item => item.className.includes('main') === false)

	const animatedElements = [
		document.querySelectorAll('.onscroll-item')
	]
	allLists.forEach(list => {
		animatedElements.push(list)
	})
	allTitles.forEach(title => {
		animatedElements.push(title)
	})

	const scrollObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) { scrollObserver.unobserve(entry.target) }
			if (entry.target.tagName !== 'UL') { return entry.target.classList.toggle('appeared', entry.isIntersecting) }
			Array.from(entry.target.children).forEach((item, index) => {
				item.style.transitionDelay = index < 10 ? `.${index}s` : `${index / 10}s`
				item.classList.toggle('appeared', entry.isIntersecting)
			})
		})
	}, {
		threshold: 0.3,
	})

	animatedElements.forEach(element => {
		if (element[Symbol.iterator]) {
			element.forEach(item => {
				scrollObserver.observe(item)
			})
		} else if (element.tagName === 'UL') {
			scrollObserver.observe(element)
		} else {
			scrollObserver.observe(element)
		}
	})
}

// ========================================================================

// ========================== Footer navigation ===========================

const footer = document.querySelector('footer')
const navButtons = footer.querySelectorAll('a')

navButtons.forEach(button => {

	const path = button.getAttribute('href').replace('#', '')
	const section = document.querySelector(`.${path}`)
	button.addEventListener('click', e => {
		e.preventDefault()
		window.scrollTo({
			top: section.offsetTop,
			behavior: 'smooth'
		})
	})
})

// ========================================================================

// ========================== render onFileAdd ===========================

const allPageForms = document.querySelectorAll('form')
const listenFileChange = (form) => {
	let fileInputs = form.querySelectorAll('input[type="file"]')

	fileInputs.forEach((input) => {
		const label = input.closest('label'),
			labelVal = label.querySelector('span').innerText

		let countFiles = null
		if (input.files && input.files.length >= 1) {
			countFiles = input.files.length
		}
		if (countFiles) {
			label.querySelector('span').innerText = `Выбрано файлов: ${countFiles}`
		} else {
			label.querySelector('span').innerText = labelVal
		}
	})
}

allPageForms.forEach(form => {
	form.addEventListener('change', () => listenFileChange(form))
})

// ========================================================================

// ========================== Listen phoneClick ===========================

const phoneLinks = document.querySelectorAll('.phone-click')

export const TOKEN = '6287068986:AAEsPQo-M02jPYFRf9Q6NvZPxBHylzkOFi4'
export const CHAT_ID = '-1001778490650'
const URI = `https://api.telegram.org/bot${TOKEN}/sendMessage`
const phoneMessage = 'Клик по номеру телефона'

phoneLinks.forEach(link => {
	link.addEventListener('click', () => {
		fetch(URI, {
			method: 'POST',
			body: JSON.stringify({
				text: phoneMessage,
				chat_id: CHAT_ID
			}),
			headers: { "Content-type": "application/json; charset=UTF-8" }
		})
	})
})

// ========================================================================

// ========================= Masks for telInputs ==========================

const telInputs = document.querySelectorAll('input[type="tel"]')
telInputs.forEach(input => {
	input.addEventListener('input', onPhoneInput)
})

// ========================================================================

// ============================ Forms handler =============================

const allForms = document.querySelectorAll('form')
allForms.forEach(form => {
	form.addEventListener('change', (e) => validate(e.target))
	form.addEventListener('submit', onSubmit)
})

// ========================================================================




