webpackJsonp([8],{

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(197)
}
var normalizeComponent = __webpack_require__(31)
/* script */
var __vue_script__ = __webpack_require__(199)
/* template */
var __vue_template__ = __webpack_require__(200)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2a510698"
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
Component.options.__file = "resources\\assets\\js\\HomePage\\Mine\\List.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2a510698", Component.options)
  } else {
    hotAPI.reload("data-v-2a510698", Component.options)
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

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(198);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(145)("5bd47d5a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2a510698\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/sass-loader/lib/loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./List.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-2a510698\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/sass-loader/lib/loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./List.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.content[data-v-2a510698] {\n  width: 100%;\n  height: 100%;\n  padding: 40px 80px 40px 80px;\n}\n.rowHeader[data-v-2a510698] {\n  margin-bottom: 20px;\n}\n.rowTable[data-v-2a510698] {\n  margin-bottom: 30px;\n}\n.control-bar[data-v-2a510698] {\n  text-align: right;\n}\n", ""]);

// exports


/***/ }),

/***/ 199:
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

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    var _this = this;

    return {
      paginationInit: {
        total: 1,
        page: 1,
        size: 5,
        sizeOpt: [5, 10, 15, 20]
      },
      value2: '',
      articleColumns: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '文章标题',
        key: 'title'
      }, {
        title: '摘要',
        key: 'title'
      }, {
        title: '发布人',
        key: 'username'
      }, {
        title: '共同编辑',
        key: 'share'
      }, {
        title: '操作',
        key: 'action',
        render: function render(createElement, params) {
          if (params.row.user_id === _this.$store.state.loginUserInfo.id) {
            return createElement('div', [createElement('Button', {
              props: { type: 'primary', size: 'small' },
              style: { marginRight: '5px' },
              on: {
                click: function click() {
                  _this.edit(params);
                }
              }
            }, '编辑'), createElement('Poptip', {
              props: { confirm: true, title: "确认删除这条内容吗?" },
              on: {
                'on-ok': function onOk() {
                  _this.delete(params);
                }
              } }, [createElement('Button', {
              props: { type: 'error', size: 'small' }
            }, '删除')])]);
          } else {
            return createElement('div', [createElement('Button', {
              props: { type: 'primary', size: 'small' },
              style: { marginRight: '5px' },
              on: {
                click: function click() {
                  _this.edit(params);
                }
              }
            }, '编辑')]);
          }
        }
      }],
      articleList: []
    };
  },
  mounted: function mounted() {
    this.get();
  },

  methods: {
    get: function get() {
      var _this2 = this;

      var payload = {
        size: this.paginationInit.size,
        page: this.paginationInit.page
        // _token: window.Laravel.csrfToken
      };
      this.$http.post('/getArticleByUser', payload).then(function (response) {
        // 请求成功
        _this2.paginationInit.total = response.data.total;
        _this2.articleList = response.data.articles;
      }, function (response) {
        // 请求失败
        _this2.$Message.error(_this2.$store.state.responseErrorMsg);
      });
    },
    edit: function edit(params) {
      // 文章id
      var id = params.row.id;
      this.$router.push({ path: '/mine/edit/' + id });
    },
    delete: function _delete(params) {
      var _this3 = this;

      var payload = {
        // _token: window.Laravel.csrfToken,
        id: params.row.id,
        user_id: params.row.user_id,
        size: this.paginationInit.size,
        page: this.paginationInit.page
      };
      this.$http.post('/deleteArticle', payload).then(function (response) {
        // 请求成功
        var articles = response.data.articles;
        // 处理得到的数据
        for (var i = 0; i < articles.length; i++) {
          var item = articles[i];
          for (var key in item) {
            if (key == 'username') {
              item['username'] = item['username'].name;
            }
          }
        }
        _this3.articleList = articles;

        _this3.$Notice.success({
          title: '删除成功',
          duration: 3
        });
      }, function (response) {
        // 请求失败
        _this3.$Message.error(_this3.$store.state.responseErrorMsg);
      });
    },
    changePage: function changePage(page) {
      var payload = {
        page: page,
        size: this.paginationInit.size
      };
      this.paginationInit.page = page;
      this.get();
    },
    setPageSize: function setPageSize(size) {
      var payload = {
        page: this.paginationInit.page,
        size: size
      };
      this.paginationInit.size = size;
      this.get();
    }
  }
});

/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "content" },
    [
      _c(
        "Row",
        { staticClass: "rowHeader", attrs: { type: "flex", justify: "end" } },
        [
          _c("Col", { attrs: { span: "8" } }, [
            _c(
              "div",
              { staticClass: "control-bar" },
              [
                _c("Input", {
                  staticStyle: { width: "150px" },
                  attrs: { placeholder: "请输入..." },
                  model: {
                    value: _vm.value2,
                    callback: function($$v) {
                      _vm.value2 = $$v
                    },
                    expression: "value2"
                  }
                }),
                _vm._v(" "),
                _c("Button", {
                  attrs: {
                    type: "primary",
                    icon: "ios-search",
                    shape: "circle"
                  }
                })
              ],
              1
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "Row",
        { staticClass: "rowTable" },
        [
          _c("Table", {
            attrs: {
              border: "",
              stripe: "",
              columns: _vm.articleColumns,
              data: _vm.articleList
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c("Row", [
        _c(
          "div",
          { staticClass: "pagination" },
          [
            _c("Page", {
              attrs: {
                total: _vm.paginationInit.total,
                placement: "top",
                size: "small",
                "show-elevator": "",
                "show-sizer": "",
                current: _vm.paginationInit.page,
                "page-size": _vm.paginationInit.size,
                "page-size-opts": _vm.paginationInit.sizeOpt
              },
              on: {
                "on-change": _vm.changePage,
                "on-page-size-change": _vm.setPageSize
              }
            })
          ],
          1
        )
      ])
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
    require("vue-hot-reload-api")      .rerender("data-v-2a510698", module.exports)
  }
}

/***/ })

});