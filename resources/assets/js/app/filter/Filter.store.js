import {Request} from '../../Utils/Utils';

export default {
  state: {
    list: [],
    pageQuery: {
      page: 1,
      pageSize: 20,
      desc: 'desc',
      order: 'updated_at',
      manufacturer: '',
      model: '',
      version: '',
      url: ''
    }
  },

  actions: {
    filter_get ({dispatch, state, commit}, payload) {
      commit('filter_param', payload)
      return Request('GET', '/security/filter/get', state.pageQuery).then(data => {
        commit('filter_get', data);
      })
    },

    filter_add ({dispatch, state, commit}, payload) {
      return Request('POST', '/security/filter/add', payload).then(data => {
        dispatch('filter_get', {page: 1, name: ''});
        return Promise.resolve()
      })
    },

    filter_update ({dispatch, state, commit}, payload) {
      return Request('POST', '/security/filter/update', payload).then(data => {
        dispatch('filter_get', {});
        return Promise.resolve(payload)
      })
    },

    filter_change ({dispatch, state, commit}, payload) {
      return Request('POST', '/security/filter/change', payload);
    },

    filter_delete ({dispatch, state, commit}, payload) {
      return Request('POST', '/security/filter/delete', payload).then(() => {
        dispatch('filter_get', {page: state.list.length > 1 ? state.pageQuery.page : state.pageQuery.page - 1 % state.pageQuery.page});
        return Promise.resolve()
      })
    },
  },

  mutations: {
    filter_get (state, payload) {
      state.list = payload.data;
      state.pageQuery.total = payload.total;
    },
    filter_param (state, payload) {
      Object.assign(state.pageQuery, payload)
    }
  }
}
