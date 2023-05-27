import {nextTick, onBeforeUnmount, onMounted} from "vue";

const useRevealObserver = () => {

    const callback = (entries: any[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active')
            } else {
                entry.target.classList.remove('active')
            }
        })
    }

    const observer: IntersectionObserver = new IntersectionObserver(callback)

    onMounted(async () => {
        await nextTick()
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el)
        })
    })

    onBeforeUnmount(() => {
        observer.disconnect()
    })
}

export {
    useRevealObserver
}