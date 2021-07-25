import Tempo from './modules/Tempo.js'

const webgl = document.getElementById('webgl')
const glContext = webgl.getContext('webgl', {
	powerPreference: 'high-performance'
})

const colors = ['#FFE7E5', '#FFBDAF', '#E65F5C', '#E8FFEE', '#36EFB1', '#32D789', '#E8F4FF', '#6EE4FF', '#41C0EC', '#72FFF9', '#67E6E0', '#387D7A']

const copyItems = []
copyItems.push({
	yOffset: 50,
	opacity: 0
})
copyItems.push({
	yOffset: 50,
	opacity: 0
})
copyItems.push({
	yOffset: 50,
	opacity: 0
})

const imageItems = []
imageItems.push({
	scale: 1,
	rotateY: 0,
	rotateX: 0,
	translateX: 0,
	translateZ: 0
})
imageItems.push({
	scale: 1,
	rotateY: 0,
	rotateX: 0,
	translateX: 0,
	translateZ: 0
})
imageItems.push({
	scale: 1,
	rotateY: 0,
	rotateX: 0,
	translateX: 0,
	translateZ: 0
})

const gradient = {
	position: 50,
	angle: 45,
	scale: 1,
	offset: 0
}



const copyItemsElements = document.querySelectorAll('.copy-item')
const imageElements = document.querySelectorAll('.image-item')

const imageWrapper = document.querySelector('.images')
const root = document.documentElement



let scrollProgress = 0

const update = () => {
	imageWrapper.style.transform = `rotateY(${imageItems[0].rotateY}deg) rotateX(${imageItems[0].rotateX}deg)`
	imageElements.forEach((item, index) => {
		item.style.transform = `translateZ(${imageItems[index].translateZ}px) translateX(${imageItems[index].translateX}px) scale(${imageItems[index].scale})`
	})
	copyItemsElements.forEach((item, index) => {
		item.style.opacity = copyItems[index].opacity
		item.style.transform = `translateY(${copyItems[index].yOffset}px)`
	})
	root.style.setProperty('--gradient-position', `${gradient.position}%`)
	root.style.setProperty('--gradient-angle', `${gradient.angle}deg`)
	root.style.setProperty('--gradient-scale', gradient.scale)
	root.style.setProperty('--gradient-offset', `${gradient.offset}px`)
	requestAnimationFrame(update)
	composition.setProgress(scrollProgress)
}
requestAnimationFrame(update)

let composition = new Tempo.composition()
copyItems.forEach((item, index) => {
	composition.to(item, { yOffset: -50 }, { 
		duration: 1, 
		ease: 'linear'
	})
	composition.to(item, { opacity: 1 }, {
		duration: 0.25,
		ease: 'linear'
	}, 0 + index)
	composition.to(item, { opacity: 0 }, {
		duration: 0.25,
		ease: 'linear'
	}, 0.75 + index)
})
composition.from(imageItems, { scale: 0 }, { duration: 1, ease: 'easeOutExpo' }, 0)
composition.to(imageItems[0], { translateX: -320, translateZ: -250 }, { duration: 1, ease: 'easeOutBack' }, 1)
composition.to(imageItems[1], { translateX: 320, translateZ: -250 }, { duration: 1, ease: 'easeOutBack' }, 1)
composition.to(imageItems[0], { translateX: -280 }, { duration: 1, ease: 'easeOutSine' }, 2)
composition.to(imageItems[1], { translateX: 280 }, { duration: 1, ease: 'easeOutSine' }, 2)
composition.to(imageItems, { rotateY: 30, rotateX: 30 }, { duration: 1, ease: 'easeOutSine' }, 2)
composition.to(gradient, { position: 25, angle: 30, offset: 4 }, { duration: 1, ease: 'easeOutSine' }, 2)
composition.to(imageItems[2], { translateZ: 80}, { duration: 1, ease: 'easeOutSine' }, 2)


const stickyElement = document.querySelector('.sticky-element')
const observer = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			window.addEventListener('scroll', scrollListener)
		} else {
			window.removeEventListener('scroll', scrollListener)
		}
	})
}, { threshold: 1 })
observer.observe(stickyElement)

const scrollMultiplier = 1
const content = document.querySelector('.sticky-wrapper')
content.style.height = `${(scrollMultiplier * composition.duration) + window.innerHeight}px`
const scrollHeight = (scrollMultiplier * composition.duration)

const scrollListener = (event) => {
	const scrollDistance = event.target.scrollingElement.scrollTop
	const scrollPosition = scrollDistance - content.offsetTop
	scrollProgress = Math.min(Math.max(scrollPosition / scrollHeight, 0), 1)
}