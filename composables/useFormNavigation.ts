export function useFormNavigation() {
    const handleEnterKey = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement
        const tagName = target.tagName.toLowerCase()

        if (tagName === 'textarea') {
            return
        }

        if (tagName === 'button') {
            return
        }

        event.preventDefault()

        const form = target.closest('form')
        if (!form) return

        const focusableElements = Array.from(
            form.querySelectorAll<HTMLElement>(
                'input:not([type="hidden"]):not([type="file"]):not([disabled]):not([readonly]), ' +
                'select:not([disabled]), ' +
                'textarea:not([disabled])'
            )
        ).filter(el => {
            const style = window.getComputedStyle(el)
            return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null
        })

        const currentIndex = focusableElements.indexOf(target as HTMLElement)

        if (currentIndex === -1) return

        const nextIndex = currentIndex + 1
        if (nextIndex < focusableElements.length) {
            const nextElement = focusableElements[nextIndex]
            if (nextElement) {
                nextElement.focus()

                if (nextElement.tagName.toLowerCase() === 'input' ||
                    nextElement.tagName.toLowerCase() === 'textarea') {
                    (nextElement as HTMLInputElement).select?.()
                }
            }
        } else {
            target.blur()
        }
    }

    const onFormEnter = (event: KeyboardEvent) => {
        handleEnterKey(event)
    }

    return {
        handleEnterKey,
        onFormEnter
    }
}
