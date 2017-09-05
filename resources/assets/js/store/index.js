import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		loginStatus: localStorage.getItem("loginStatus") == "true" ? true : false ,
		// loginStatus: false ,
		// loginUserInfo: JSON.parse(localStorage.getItem("loginUserInfo")),
		loginUserInfo: localStorage.getItem("loginUserInfo") == "" ? "" : JSON.parse(localStorage.getItem("loginUserInfo")),
		responseErrorMsg: '',
		breadCrumb: [],
		data: {
			userFormData: [],
			categoryFormData: []
		},
		pageConfig: {
			currentPage: 1,
			pageSize: 5	
		}
	},
	mutations: {
		loginSuccess (state, payload) {
			state.loginStatus = true
			localStorage.setItem("loginStatus", "true")

			state.loginUserInfo = payload
			localStorage.setItem("loginUserInfo", JSON.stringify(payload))
		},
		logoutSuccess(state) {
			state.loginStatus = false
			localStorage.setItem("loginStatus", "false")

			state.loginUserInfo = ""
			localStorage.setItem("loginUserInfo", "")
		},
		setErrorResponseMsg(state, msg) {
			state.responseErrorMsg = msg
		},
		setBreadCrumb(state, payload) {
			// state.ceshibread = ['ceshi','success']
			state.breadCrumb = []
      payload.menuArr.map(
        function(item){
          if(item.name == payload.clickName) {
            // console.log(payload.clickName)
          }else if(item.child != null) {
            item.child.map(
              function(child) {
                if(child.name == payload.clickName) {
                  this.push({'title': item.title}, {'title': child.title ,'name': child.name});
                }
              },this
            )
          }
        },
        state.breadCrumb
      );
		},
		addBreadCrumb(state, payload) {
			let flag
			state.breadCrumb.forEach(function(item){
				if(item.title!=payload.title) {
					flag = true
				}else {
					flag = false
				}
			})
			if(flag) {
				state.breadCrumb.push(payload)
			}
			// state.breadCrumb.push(title)
		},

		setPageConfig(state, payload) {
			state.pageConfig.currentPage = payload.page
			state.pageConfig.pageSize = payload.size
		}
	}
})