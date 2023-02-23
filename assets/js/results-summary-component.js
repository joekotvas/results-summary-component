class App {
    constructor() {
        this.ui = {
            overallScoreEl: document.querySelector('#overall-score'),
            categoriesContainerEl: document.querySelector('#categories-container'),
            descriptionTitleEl: document.querySelector('.performance-description-title'),
            descriptionEl: document.querySelector('.performance-description'),
            loadingPaneEl: document.querySelector('.loading-pane')
        }

        this.data = null

        this.render()
        
        document.body.classList.remove('init')
    }
    
    async getData() {
        try {
            const response = await fetch('assets/data/data.json')
            if (response.ok) return response.json()
            throw new Error('Could not load data')
        } catch (error) {
            console.error(error)
            return false
        }
    }

    async render() {
        this.data = await this.getData()
        return this.data ? this.renderResult() : this.renderError()
    }
    
    renderError() {
        this.ui.loadingPaneEl.innerHTML = `
        <h2>We're Sorry</h2>
        <strong>We could not load your data. Please try again later.</strong>`
    }

    getOverallScore() {
        if (!this.data) return null;
        let sum = this.data.map(item => item.score).reduce((acc, cur) => acc += cur)
        return Math.round(sum / this.data.length)
    }

    update(el, content) {
        if (!el) return console.warn('No element to update');
        if (!content) return el.innerHTML = 'N/A';
        el.innerHTML = content
    }

    getResultItemHTML(item) {
        const { category, score, icon } = item
        const categoryId = category.toLowerCase()
        return `
        <section class="${categoryId} result">
            <img src="${icon}" width="20" height="20" alt="">
            <h3>${category}</h3>
            <p>
                <output>${score}</output> / 100
            </p>
        </section>`
    }

    renderResult() {
        const { ui, data } = this
        const { overallScoreEl, categoriesContainerEl, descriptionTitleEl, descriptionEl } = ui

        this.update(overallScoreEl, this.getOverallScore())

        // Not provided in the data, so I'm just hardcoding it here
        this.update(descriptionTitleEl, 'Great')
        this.update(descriptionEl, 'Your performance exceeds 65% of the people conducting the test here!')

        let resultHTML = data.map(item => this.getResultItemHTML(item)).join('')
        this.update(categoriesContainerEl, resultHTML)

        setTimeout(() => 
            document.body.classList.remove('loading'), 
            2000
        )
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const resultsSummaryApp = new App()
})