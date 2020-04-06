const { return2Br } = require('../utils')

class Blog {
    constructor(data) {
        if (data) {
            this.createBlogFromData(data)
        }
    }

    createBlogFromData(data) {
        this.id = data.id
        this.subtitle = data.subtitle
        this.category = data.category
        this.categoryText = data.categoryText
        this.title = data.title
        this.contents = data.contents
        this.createDt = new Date().getTime()
        this.updateDt = new Date().getTime()
        this.updateType = data.updateType
        this.parse()
    }

    parse() {
        if ( this.contents ){
            this.contents = return2Br(this.contents.toString())
        }
    }

    toDb() {
        return {
            category: this.category,
            categoryText: this.categoryText,
            title: this.title,
            subtitle: this.subtitle,
            contents: this.contents,
            createDt: this.createDt,
            updateDt: this.updateDt,
            updateType: this.updateType
        }
    }
}

module.exports = Blog
