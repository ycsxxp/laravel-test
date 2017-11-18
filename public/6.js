webpackJsonp([6],{

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(151)
}
var normalizeComponent = __webpack_require__(31)
/* script */
var __vue_script__ = __webpack_require__(153)
/* template */
var __vue_template__ = __webpack_require__(154)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-384052eb"
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
Component.options.__file = "resources\\assets\\js\\components\\Index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-384052eb", Component.options)
  } else {
    hotAPI.reload("data-v-384052eb", Component.options)
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

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(152);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(145)("0db75884", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-384052eb\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Index.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-384052eb\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.layout[data-v-384052eb]{\n  border: 1px solid #d7dde4;\n  background: #f5f7f9;\n  position: relative;\n  border-radius: 4px;\n  overflow: auto;\n  height: 100%;\n}\n.layout-breadcrumb[data-v-384052eb]{\n  padding: 10px 15px 0;\n}\n.layout-content[data-v-384052eb]{\n  min-height: 200px;\n  margin: 15px;\n  overflow: auto;\n  background: #fff;\n  border-radius: 4px;\n}\n.layout-content-main[data-v-384052eb]{\n  padding: 10px;\n}\n.layout-copy[data-v-384052eb]{\n  bottom: 0;\n  width: 100%;\n  text-align: center;\n  padding: 10px 0 20px;\n  color: #9ea7b4;\n}\n.layout-menu-left[data-v-384052eb]{\n  /*background: #1c2438;*/\n  background: #495060;\n}\n.layout-header[data-v-384052eb]{\n  height: 60px;\n  background: #fff;\n  -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.1);\n          box-shadow: 0 1px 1px rgba(0,0,0,.1);\n  padding-right: 50px;\n}\n.layout-logo-left[data-v-384052eb]{\n  width: 90%;\n  height: 30px;\n  background: #5b6270;\n  border-radius: 3px;\n  margin: 15px auto;\n}\n.layout-ceiling-main a[data-v-384052eb]{\n  color: #9ba7b5;\n}\n.layout-hide-text .layout-text[data-v-384052eb]{\n  display: none;\n}\n.ivu-col[data-v-384052eb]{\n  overflow: auto;\n  -webkit-transition: width .2s ease-in-out;\n  transition: width .2s ease-in-out;\n}\n.rowDiv[data-v-384052eb] {\n  height: 100%;\n}\n.ivu-icon-ios-arrow-down[data-v-384052eb]:before{\n  content: \"\";\n}\n.userIconDrop[data-v-384052eb] {\n  float: right;\n}\n.userIcon[data-v-384052eb] {\n  margin-top: 9px;\n  height: 41px;\n}\n", ""]);

// exports


/***/ }),

/***/ 153:
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
    return {
      breadCrumb: [],
      spanLeft: 4,
      spanRight: 20,
      menuArr: [{
        id: '1',
        name: '1',
        title: '内容管理',
        icon: 'ios-paper',
        child: [{
          id: '1',
          name: 'article',
          title: '文章管理'
        }, {
          id: '2',
          name: 'category',
          title: '分类管理'
        }, {
          id: '3',
          name: 'test',
          title: '评论管理'
        }]
      }, {
        id: '2',
        name: '2',
        title: '用户管理',
        icon: 'ios-people',
        child: [{
          id: '1',
          name: 'user',
          title: '用户列表'
        }, {
          id: '2',
          name: 'useractive',
          title: '活跃用户'
        }]
      }]
    };
  },
  mounted: function mounted() {
    // 获取面包屑显示
    this.$store.commit('setBreadCrumb', { 'clickName': this.menuArr[0].child[0].name, 'menuArr': this.menuArr, 'breadCrumb': this.breadCrumb });
    this.breadCrumb = this.$store.state.breadCrumb;
    this.$router.push({ path: '/' + this.menuArr[0].child[0].name });
  },

  computed: {
    iconSize: function iconSize() {
      return this.spanLeft === 4 ? 14 : 24;
    }
  },
  methods: {
    toggleClick: function toggleClick() {
      if (this.spanLeft === 4) {
        this.spanLeft = 2;
        this.spanRight = 22;
      } else {
        this.spanLeft = 4;
        this.spanRight = 20;
      }
    },
    userTodo: function userTodo(name) {
      if (name = 'logout') this.logout();
    },
    routeTo: function routeTo(e) {
      // 获取面包屑显示
      this.$store.commit('setBreadCrumb', { 'clickName': e, 'menuArr': this.menuArr, 'breadCrumb': this.breadCrumb });
      this.breadCrumb = this.$store.state.breadCrumb;
      // 跳转
      this.$router.push({ path: '/' + e });
    },
    logout: function logout() {
      var _this = this;

      this.$http.post('/logout', { _token: window.Laravel.csrfToken }).then(function (response) {
        _this.$store.commit('logoutSuccess');
        _this.$router.push({ path: '/' });
      }, function (response) {});
    }
  }
});

/***/ }),

/***/ 154:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "layout", class: { "layout-hide-text": _vm.spanLeft < 4 } },
    [
      _c(
        "Row",
        { attrs: { type: "flex", "class-name": "rowDiv", justify: "center" } },
        [
          _c(
            "i-col",
            { staticClass: "layout-menu-left", attrs: { span: _vm.spanLeft } },
            [
              _c("div", { staticClass: "layout-logo-left" }),
              _vm._v(" "),
              _c(
                "Menu",
                {
                  attrs: {
                    mode: "vertical",
                    theme: "dark",
                    width: "auto",
                    "active-name": "article",
                    "open-names": ["1"],
                    accordion: ""
                  },
                  on: { "on-select": _vm.routeTo }
                },
                _vm._l(_vm.menuArr, function(menu) {
                  return _c(
                    "Submenu",
                    { key: menu.id, attrs: { name: menu.name } },
                    [
                      _c(
                        "template",
                        { slot: "title" },
                        [
                          _c("Icon", {
                            attrs: { type: menu.icon, size: _vm.iconSize }
                          }),
                          _vm._v(" "),
                          _c("span", { staticClass: "layout-text" }, [
                            _vm._v(_vm._s(menu.title))
                          ])
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _vm._l(menu.child, function(submenu) {
                        return _c(
                          "Menu-item",
                          { key: submenu.id, attrs: { name: submenu.name } },
                          [_vm._v(_vm._s(submenu.title))]
                        )
                      })
                    ],
                    2
                  )
                })
              )
            ],
            1
          ),
          _vm._v(" "),
          _c("i-col", { attrs: { span: _vm.spanRight } }, [
            _c(
              "div",
              { staticClass: "layout-header" },
              [
                _c(
                  "Dropdown",
                  {
                    staticClass: "userIconDrop",
                    attrs: { trigger: "hover" },
                    on: { "on-click": _vm.userTodo }
                  },
                  [
                    _c(
                      "div",
                      {
                        style: {
                          float: "left",
                          marginRight: "10px",
                          lineHeight: "60px"
                        }
                      },
                      [
                        _vm._v(
                          "Hi, " + _vm._s(this.$store.state.loginUserInfo.name)
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "Button",
                      {
                        staticClass: "userIcon",
                        attrs: { type: "info", shape: "circle" }
                      },
                      [_c("Icon", { attrs: { type: "person" } })],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "Dropdown-menu",
                      { attrs: { slot: "list" }, slot: "list" },
                      [
                        _c("Dropdown-item", { attrs: { name: "logout" } }, [
                          _vm._v("退出")
                        ])
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
              { staticClass: "layout-breadcrumb" },
              [
                _c(
                  "Breadcrumb",
                  [
                    _c("Breadcrumb-item", { attrs: { href: "#" } }, [
                      _vm._v("首页")
                    ]),
                    _vm._v(" "),
                    _vm._l(_vm.breadCrumb, function(item, index) {
                      return _c(
                        "Breadcrumb-item",
                        { key: index, attrs: { href: "#" } },
                        [_vm._v(_vm._s(item.title))]
                      )
                    })
                  ],
                  2
                )
              ],
              1
            ),
            _vm._v(" "),
            _c("div", { staticClass: "layout-content" }, [
              _c(
                "div",
                { staticClass: "layout-content-main" },
                [
                  _c(
                    "transition",
                    { attrs: { mode: "out-in" } },
                    [_c("router-view")],
                    1
                  )
                ],
                1
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "layout-copy" }, [
              _vm._v("\n        2011-2016 © TalkingData\n      ")
            ])
          ])
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-384052eb", module.exports)
  }
}

/***/ })

});