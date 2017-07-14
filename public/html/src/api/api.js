import axios from 'axios';
import qs from 'qs';

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

let base = 'http://172.16.220.39:18080/api';
//let base='http://wjlblog.duapp.com/api';
export const requestLogin = params => { return axios.post(`${base}/login`, qs.stringify( params)).then(res => res.data); };

export const getBlogListPage = params => {return axios.post(`${base}/blog/list`, qs.stringify( params))};

export const AddBlog = params => {return axios.post(`${base}/blog/add`, qs.stringify( params))};

export const editBlog = params => {return axios.post(`${base}/blog/edit`, qs.stringify( params))};

export const removeBlog = params => { return axios.post(`${base}/blog/delete`, qs.stringify( params)) };

export const getToken = params => { return axios.post(`${base}/blog/getToken`, qs.stringify( params)) };


//博客分类
export const blogTypeList = params => {return axios.post(`${base}/blogType/list`, qs.stringify( params))};

export const addBlogType = params => {return axios.post(`${base}/blogType/add`, qs.stringify( params))};

export const editBlogType = params => {return axios.post(`${base}/blogType/edit`, qs.stringify( params))};

export const removeBlogType = params => { return axios.post(`${base}/blogType/delete`, qs.stringify( params)) };

