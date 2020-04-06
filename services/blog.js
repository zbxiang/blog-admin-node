const db = require('../db')
const Blog = require('../models/Blog')
const { debug } = require('../utils/constant') 

function exists(blog) {
    const { category, title } = blog
    const sql = `select * from blog where category='${category}' and title='${title}'`
    return db.queryOne(sql)
}

function insertBlog(blog) {
    return new Promise(async (resolve, reject) => {
        try {
            if (blog instanceof Blog) {
                const result = await exists(blog)
                if (result) {
                    reject(new Error('新增博客已存在'))
                } else {
                    await db.insert(blog.toDb(), 'blog')
                    resolve()
                }
            } else {
                reject(new Error('新增博客失败'))
            }
        } catch (e) {
            reject(e)
        }
    })
}

function updateBlog(blog) {
    return new Promise(async (resolve, reject) => {
        try {
            if (blog instanceof Blog) {
                const result = await getBlog(blog.id)
                if (result) {
                    const model = blog.toDb()
                    await db.update(model, 'blog', `where id='${blog.id}'`)
                    resolve()
                }
            }else {
                reject(new Error('编辑的博客对象不合法'))
            }
        } catch (e) {
            reject(e)
        }
    })
}

function getBlog(id) {
    return new Promise(async (resolve, reject) => {
        const blogSql = `select * from blog where id='${id}'`
        const blog = await db.queryOne(blogSql)
        if (blog) {
            resolve(blog)
        } else {
            reject(new Error('博客不存在'))
        }
    })
}

async function setCategory(categoryText) {
    return new Promise(async (resolve, reject) => {
        try {
            if (categoryText) {
                function isCategory() {
                    const sql = `select * from category_list where categoryText='${categoryText}'`
                    return db.querySql(sql)
                }
                let result = await isCategory()
                if (!result.length > 0) {
                    sql = `INSERT INTO category_list (category, categoryText) VALUES (null, '${categoryText}')`
                    await db.querySql(sql)
                }
                result = await isCategory()
                const categoryList = []
                result.forEach(item => {
                    categoryList.push({
                        label: item.categoryText,
                        value: item.category,
                    })
                })
                resolve(categoryList)
            } else {
                reject(e)
            }
        } catch (e) {
            reject(e)
        }
    })
}

async function getCategory() {
    const sql = `select * from category`
    const result = await db.querySql(sql)
    const categoryList = []
    result.forEach(item => {
        categoryList.push({
            label: item.categoryText,
            value: item.category,
        })
    })
    return categoryList
}

async function removeCategory(id) {
    if (id) {
        const remoremoveCategorySql = `delete from category where category='${id}'`
        await db.querySql(remoremoveCategorySql)
    }
}

async function listBlog(query) {
    debug && console.log(query)
    const {
        category,
        title,
        sort,
        page = 1,
        pageSize = 20
    } = query
    console.log('分类你名称：'+category)
    const offset = (page - 1) * pageSize
    let blogSql = 'select * from blog'
    let where = 'where'
    title && (where = db.andLike(where, 'title', title))
    category && (where = db.andLike(where, 'category', category))
    if (where !== 'where') {
        blogSql = `${blogSql} ${where}`
    }
    if (sort) {
        const symbol = sort[0]
        const column = sort.slice(1, sort.length)
        const order = symbol === '+' ? 'asc' : 'desc'
        blogSql = `${blogSql} order by \`${column}\` ${order}`
    }
    let countSql = `select count(*) as count from blog`
    if (where !== 'where') {
        countSql = `${countSql} ${where}`
    }
    const count = await db.querySql(countSql)
    blogSql = `${blogSql} limit ${pageSize} offset ${offset}`
    const list = await db.querySql(blogSql)
    return { list, count: count[0].count, page, pageSize }
}

function deleteBlog(id) {
    return new Promise(async (resolve, reject) => {
        let blog = await getBlog(id)
        if (blog) {
            const sql = `delete from blog where id='${id}'`
            db.querySql(sql).then(() => {
                resolve()
            })
        } else {
            reject(new Error('博客不存在'))
        }
    })
}

module.exports = {
    insertBlog,
    updateBlog,
    getBlog,
    setCategory,
    getCategory,
    removeCategory,
    listBlog,
    deleteBlog
}