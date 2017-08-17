import Vue from 'vue'
import Vuex from 'vuex'
import {Message, Loading} from 'element-ui';
import {getXsrfToken, Request} from './../Utils/Utils';

import filter from '../app/filter/Filter.store'

Vue.use(Vuex);
const state = {
  valid: 1,
  pageList: [],
  pageID: null,
  editDialogVisible: false,
  action: {
    data: [],
    option: {
      request: {
        page: 1,
        pageSize: 20,
        desc: 'desc',
        order: 'id',
      },
      total: 0
    },
  },
  role: [],
}
var switchSate = 0;
const mutations = {
  getPageList: function (state) {
    $.getJSON('/zhuti/page/get', {valid: state.valid},
      function (response) {
        if (response.result) {
          state.pageList = response.data;
        }
      }
    );
  },
  selectPage: function (state, pageID) {
    var options = {
      target: '.DisplayPanel'
    };
    var loadingInstance = Loading.service(options);
    state.pageID = pageID;
    var option = {page_id: pageID, sort: 'seat', desc: 'asc'};
    if (state.valid == 1) {
      option.valid = 1;
    }
    $.getJSON('/zhuti/page/component', option, function (response) {
      loadingInstance.close();
      if (response.result) {
        state.PageComponentList = response.data;
      }
    });
  },
  openEditDialog: function (state, componentSelection) {
    state.componentSelection = componentSelection;
    state.editDialogVisible = true;
    mutations.getComponentResource(state, componentSelection.id);
  },
  closeEditDialog: function (state) {
    state.editDialogVisible = false;
    if (!switchSate) {
      switchSate = 1;
      mutations.selectPage(state, state.pageID);
      setTimeout(function () {
        switchSate = 0;
      }, 500);
    }
  },
  addResource: function (state, resource) {
    if (!state.componentSelection.id) {
      Message.error('未选中组件');
      return;
    }
    resource.page_comp_id = state.componentSelection.id;
    $.ajax({
      url: '/zhuti/pageComponent/addResource',
      type: 'POST',
      data: resource,
      success: function (result) {
        if (result.result) {
          mutations.getComponentResource(state, state.componentSelection.id);
          Message.success('保存成功');
        }
        else {
          Message.error(result.error);
        }
      },
      headers: {
        'X-XSRF-TOKEN': getXsrfToken()
      },
      dataType: 'json'
    });
  },

  deleteResource: function (state, componentResourceID) {
    var data = {
      id: componentResourceID
    };
    $.ajax({
      url: '/zhuti/pageComponent/deleteResource',
      type: 'POST',
      data: data,
      success: function (result) {
        mutations.getComponentResource(state, state.componentSelection.id);
        Message.success('删除成功');
      },
      headers: {
        'X-XSRF-TOKEN': getXsrfToken()
      },
      dataType: 'json'
    });
  },
  getRole(state){
    Request('GET', '/zhuti/auth', {}).then((response) => {
      if (response.result) {
        state.role = response.role;
      }
    });
  }
}

const actions = {
  common_addMarkResource ({dispatch, state, commit}, payload) {
    return Request('POST', '/zhuti/mark/resource/add', payload).then(data => {
      return Promise.resolve(data)
    })
  },

  common_addPriceTag ({dispatch, state, commit}, payload) {
    return Request('POST', '/zhuti/priceTag/add', payload).then(data => {
      return Promise.resolve(data)
    })
  }

}

const getters = {}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    filter
  }
})
