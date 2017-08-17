import { Message } from 'element-ui';
import axios from 'axios'

export const getXsrfToken = () => {
  var cookies = document.cookie.split(';')
  var token = ''

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].split('=')
    if (cookie[0] === 'XSRF-TOKEN') {
      token = decodeURIComponent(cookie[1])
    }
  }

  return token;
}

export const Request = (method, url, data) => {
  var body = data;
  var params = '';
  if(method === 'GET'){
    params = data;
    body = ''
  }

  return axios({
    headers: {
      'X-XSRF-TOKEN': getXsrfToken()
    },
    method: method,
    url: url,
    params: params,
    data: body,
    responseType: 'json'
  }).then(resp => {
    if (resp && resp.data && resp.data.result) {
      return Promise.resolve(resp.data)
    } else {
      Message.error('服务出错：' + resp.data.error)
      return Promise.reject(resp.data.error)
    }
  }, error => {
    Message.error('服务出错：' + error)
    return Promise.reject(error)
  })
}