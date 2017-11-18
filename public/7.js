webpackJsonp([7],{

/***/ 137:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(177)
}
var normalizeComponent = __webpack_require__(31)
/* script */
var __vue_script__ = __webpack_require__(179)
/* template */
var __vue_template__ = __webpack_require__(180)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-85ef4954"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\Home.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-85ef4954", Component.options)
  } else {
    hotAPI.reload("data-v-85ef4954", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 145:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(146)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 146:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(178);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(145)("0a46689a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-85ef4954\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Home.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-85ef4954\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Home.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.wrapper[data-v-85ef4954] {\n  width: 100%;\n}\n.wrapper-header .ivu-menu-horizontal[data-v-85ef4954] {\n  height: 80px;\n  line-height: 80px;\n}\n.wrapper-header .wrapper-header-nav[data-v-85ef4954] {\n  height: 80px;\n  width: 90%;\n  margin: 0 auto;\n}\n.wrapper-header .wrapper-header-nav .wrapper-header-nav-logo[data-v-85ef4954] {\n    margin-top: 15px;\n    height: 50px;\n    float: left;\n}\n.wrapper-header .wrapper-header-nav .wrapper-header-nav-logo img[data-v-85ef4954] {\n      height: 100%;\n}\n.wrapper-header .wrapper-header-nav .wrapper-header-nav-user[data-v-85ef4954] {\n    float: right;\n    margin-left: 50px;\n}\n.wrapper-header .wrapper-header-nav .wrapper-header-nav-list[data-v-85ef4954] {\n    height: inherit;\n    float: right;\n}\n.wrapper-container[data-v-85ef4954] {\n  background: #fff;\n  width: 90%;\n  margin: 30px auto 20px;\n  border-radius: 6px;\n  -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);\n          box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);\n}\n", ""]);

// exports


/***/ }),

/***/ 179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var _this = this;

    var validateOriPass = function validateOriPass(rule, value, callback) {
      if (value.length < 5) {
        callback(new Error('密码长度不能小于5位'));
      } else {
        callback();
      }
    };
    var validateNewPass = function validateNewPass(rule, value, callback) {
      if (value.length < 5) {
        callback(new Error('新密码长度不能小于5位'));
      } else {
        if (_this.passFormItem.newpass !== '') {
          _this.$refs.passFormItem.validateField('confirm');
        }
        callback();
      }
    };
    var validateConfirm = function validateConfirm(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== _this.passFormItem.newpass) {
        callback(new Error('两次输入不一致'));
      } else {
        callback();
      }
    };
    return {
      modalShow: false,
      passFormItem: {
        oripass: '',
        newpass: '',
        confirm: ''
      },
      passValidate: {
        oripass: [{ validator: validateOriPass, trigger: 'blur' }],
        newpass: [{ validator: validateNewPass, trigger: 'blur' }],
        confirm: [{ validator: validateConfirm, trigger: 'blur' }]
      }
    };
  },
  mounted: function mounted() {
    this.$router.push({ path: '/homepage' });
  },

  methods: {
    handleSubmit: function handleSubmit(name) {
      var _this2 = this;

      this.$refs[name].validate(function (valid) {
        if (valid) {
          _this2.$http.post('/modifypass', _this2.passFormItem).then(function (response) {
            // 请求成功
            if (response.data.status === 200) {
              _this2.$Notice.success({
                title: '密码修改成功，请重新登录'
              });
              _this2.logout();
            } else if (response.data.status === 400) {
              _this2.$refs.passFormItem.resetFields();
              _this2.$Notice.error({
                title: '密码错误修改失败, 请重试',
                duration: 3
              });
            }
          }, function (response) {
            // 请求失败
            _this2.$Message.error(_this2.$store.state.responseErrorMsg);
          });
        } else {
          _this2.$Message.error('表单验证失败!');
        }
      });
    },
    handleReset: function handleReset(name) {
      this.$refs[name].resetFields();
    },
    routeTo: function routeTo(e) {
      // 跳转
      this.$router.push({ path: '/' + e });
    },
    userTodo: function userTodo(name) {
      if (name == 'modifypass') {
        this.passFormItem = {
          oripass: '',
          newpass: '',
          confirm: ''
        };
        this.modalShow = true;
      }
      if (name == 'logout') this.logout();
    },
    logout: function logout() {
      var _this3 = this;

      this.$http.post('/logout', { _token: window.Laravel.csrfToken }).then(function (response) {
        _this3.$store.commit('logoutSuccess');
        _this3.$router.push({ path: '/' });
      }, function (response) {});
    }
  }
});

/***/ }),

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "wrapper" }, [
    _c(
      "div",
      { staticClass: "wrapper-header" },
      [
        _c(
          "Menu",
          {
            attrs: {
              mode: "horizontal",
              theme: "light",
              "active-name": "homepage"
            },
            on: { "on-select": _vm.routeTo }
          },
          [
            _c("div", { staticClass: "wrapper-header-nav" }, [
              _c(
                "a",
                {
                  staticClass: "wrapper-header-nav-logo",
                  attrs: { href: "/" }
                },
                [_c("img", { attrs: { src: "images/logo.png" } })]
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "wrapper-header-nav-user" },
                [
                  _c(
                    "Dropdown",
                    {
                      attrs: { trigger: "hover" },
                      on: { "on-click": _vm.userTodo }
                    },
                    [
                      _c(
                        "div",
                        { style: { float: "left", marginRight: "10px" } },
                        [
                          _vm._v(
                            "Hi, " +
                              _vm._s(this.$store.state.loginUserInfo.name)
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c("Button", {
                        attrs: {
                          type: "info",
                          shape: "circle",
                          icon: "ios-person"
                        }
                      }),
                      _vm._v(" "),
                      _c(
                        "DropdownMenu",
                        { attrs: { slot: "list" }, slot: "list" },
                        [
                          _c(
                            "DropdownItem",
                            { attrs: { name: "modifypass" } },
                            [_vm._v("修改密码")]
                          ),
                          _vm._v(" "),
                          _c(
                            "DropdownItem",
                            { attrs: { divided: "", name: "logout" } },
                            [_vm._v("退出")]
                          )
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "Modal",
                    {
                      attrs: {
                        title: "修改登录密码",
                        width: "380",
                        "mask-closable": false
                      },
                      model: {
                        value: _vm.modalShow,
                        callback: function($$v) {
                          _vm.modalShow = $$v
                        },
                        expression: "modalShow"
                      }
                    },
                    [
                      _c(
                        "Form",
                        {
                          ref: "passFormItem",
                          attrs: {
                            model: _vm.passFormItem,
                            "label-width": 60,
                            rules: _vm.passValidate
                          }
                        },
                        [
                          _c(
                            "FormItem",
                            { attrs: { label: "当前密码", prop: "oripass" } },
                            [
                              _c("Input", {
                                attrs: {
                                  type: "password",
                                  placeholder: "请输入当前密码"
                                },
                                model: {
                                  value: _vm.passFormItem.oripass,
                                  callback: function($$v) {
                                    _vm.$set(_vm.passFormItem, "oripass", $$v)
                                  },
                                  expression: "passFormItem.oripass"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "FormItem",
                            { attrs: { label: "新密码", prop: "newpass" } },
                            [
                              _c("Input", {
                                attrs: {
                                  type: "password",
                                  placeholder: "请输入新密码"
                                },
                                model: {
                                  value: _vm.passFormItem.newpass,
                                  callback: function($$v) {
                                    _vm.$set(_vm.passFormItem, "newpass", $$v)
                                  },
                                  expression: "passFormItem.newpass"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "FormItem",
                            { attrs: { label: "再次确认", prop: "confirm" } },
                            [
                              _c("Input", {
                                attrs: {
                                  type: "password",
                                  placeholder: "请再次输入新密码"
                                },
                                model: {
                                  value: _vm.passFormItem.confirm,
                                  callback: function($$v) {
                                    _vm.$set(_vm.passFormItem, "confirm", $$v)
                                  },
                                  expression: "passFormItem.confirm"
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { attrs: { slot: "footer" }, slot: "footer" },
                        [
                          _c(
                            "Button",
                            {
                              staticStyle: { "margin-left": "8px" },
                              attrs: { type: "ghost" },
                              on: {
                                click: function($event) {
                                  _vm.handleReset("passFormItem")
                                }
                              }
                            },
                            [_vm._v("重置")]
                          ),
                          _vm._v(" "),
                          _c(
                            "Button",
                            {
                              attrs: { type: "primary" },
                              on: {
                                click: function($event) {
                                  _vm.handleSubmit("passFormItem")
                                }
                              }
                            },
                            [_vm._v("提交")]
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "wrapper-header-nav-list" },
                [
                  _c("Menu-item", { attrs: { name: "homepage" } }, [
                    _vm._v("\n            首页\n          ")
                  ]),
                  _vm._v(" "),
                  _c("Menu-item", { attrs: { name: "cate" } }, [
                    _vm._v("\n            文章分类\n          ")
                  ]),
                  _vm._v(" "),
                  _c("Menu-item", { attrs: { name: "writer" } }, [
                    _vm._v("\n            发布文章\n          ")
                  ]),
                  _vm._v(" "),
                  _c("Menu-item", { attrs: { name: "mine" } }, [
                    _vm._v("\n            我的\n          ")
                  ])
                ],
                1
              )
            ])
          ]
        )
      ],
      1
    ),
    _vm._v(" "),
    _c("div", { staticClass: "wrapper-container" }, [_c("router-view")], 1)
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-85ef4954", module.exports)
  }
}

/***/ })

});