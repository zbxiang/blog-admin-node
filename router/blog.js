const express = require('express')
const { decoded } = require('../utils')
const boom = require('boom')
const Blog  = require('../models/Blog')
const blogService = require('../services/blog')
const Result = require('../models/Result')

const router = express.Router()

router.post('/create',function(req, res, next) {
    const decode = decoded(req)
    if (decode && decode.username) {
        req.body.username = decode.username
    }
    let categoryText = req.body.categoryText
    blogService.setCategory(categoryText).then((categoryList) => {
        return {
            category: categoryList[0].value,
            categoryText: categoryList[0].label
        }
    }).then((data) => {
        const blogData = Object.assign(data, req.body)
        return new Blog(blogData)
    }).then((data) => {
        const blogData = Object.assign(data, req.body)
        return new Blog(blogData)
    }).then((blog) => {
        return blogService.insertBlog(blog)
    }).then((result) => {
        new Result('添加博客成功').success(res)
    })
    .catch(err => {
        next(boom.badImplementation(err))
    })
})

router.post('/update', function(req, res, next) {
    const decode = decoded(req)
    if (decode && decode.username) {
        req.body.username = decode.username
    }
    let categoryText = req.body.categoryText
    blogService.setCategory(categoryText).then((categoryList) => {
        return {
            category: categoryList[0].value,
            categoryText: categoryList[0].label
        }
    }).then((data) => {
        const blogData = Object.assign(data, req.body)
        return new Blog(blogData)
    }).then((data) => {
        const blogData = Object.assign(data, req.body)
        return new Blog(blogData)
    }).then((blog) => {
        return blogService.updateBlog(blog)
    }).then((result) => {
        new Result('更新博客成功').success(res)
    })
    .catch(err => {
        next(boom.badImplementation(err))
    })
})

router.get('/get', function(req, res, next) {
    const { id } = req.query
    if (!id) {
        next(boom.badRequest(new Error('参数Id不能为空')))
    } else {
        blogService.getBlog(id).then(blog => {
            new Result(blog, '获取博客信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
})

router.get('/category', function(req, res, next) {
    blogService.getCategory().then(category => {
        new Result(category, '获取分类成功').success(res)
    }).catch(err => {
        next(boom.badImplementation(err))
    })
})

router.get('/list', function(req, res, next) {
    console.log(req.query)
    blogService.listBlog(req.query)
      .then(({list, count, page, pageSize}) => {
          new Result({list, count, page: +page, pageSize: +pageSize }, '博客列表成功').success(res)
      }).catch(err => {
          next(boom.badImplementation(err))
      })
})

router.get('/delete', function(req, res, next) {
    const { id } = req.query
    if (!id) {
        next(boom.badRequest(new Error('参数id不能为空')))
    } else {
        blogService.deleteBlog(id).then(() => {
            new Result('删除博客信息成功').success(res)
        }).catch(err => {
            next(boom.badImplementation(err))
        })
    }
})

module.exports = router