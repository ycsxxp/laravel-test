webpackJsonp([9],{

/***/ 139:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(185)
}
var normalizeComponent = __webpack_require__(31)
/* script */
var __vue_script__ = __webpack_require__(187)
/* template */
var __vue_template__ = __webpack_require__(188)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7af21ec6"
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
Component.options.__file = "resources\\assets\\js\\HomePage\\Category.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7af21ec6", Component.options)
  } else {
    hotAPI.reload("data-v-7af21ec6", Component.options)
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

/***/ 185:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(186);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(145)("7a48c80e", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7af21ec6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Category.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7af21ec6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Category.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.content[data-v-7af21ec6] {\n  width: 100%;\n  height: 100%;\n}\n.content .backBtn[data-v-7af21ec6] {\n    width: 100px;\n    position: absolute;\n    float: right;\n    margin-left: 690px;\n    margin-top: 30px;\n}\n.content .content_left[data-v-7af21ec6] {\n    color: #495060;\n    width: 20%;\n    height: 100%;\n    float: left;\n}\n.content .content_left .cate_nav[data-v-7af21ec6] {\n      height: 100%;\n      padding-top: 20px;\n}\n.content .content_left .cate_nav li[data-v-7af21ec6] {\n        padding-top: 8px;\n        padding-bottom: 8px;\n}\n.content .content_left .cate_nav .li-level-1[data-v-7af21ec6] {\n        padding-left: 20px;\n        font-size: 14px;\n}\n.content .content_left .cate_nav .li-level-2[data-v-7af21ec6] {\n        padding-left: 40px;\n        font-size: 12px;\n}\n.content .content_left .cate_nav .li-level-3[data-v-7af21ec6] {\n        padding-left: 60px;\n        font-size: 10px;\n}\n.content .content_left .cate_nav .li-level-4[data-v-7af21ec6] {\n        padding-left: 80px;\n        font-size: 8px;\n}\n.content .content_left .cate_nav .li-level-5[data-v-7af21ec6] {\n        padding-left: 100px;\n        font-size: 6px;\n}\n.content .content_left .cate_nav .li-level-6[data-v-7af21ec6] {\n        padding-left: 120px;\n        font-size: 4px;\n}\n.content .content_left .cate_nav .li-level-7[data-v-7af21ec6] {\n        padding-left: 140px;\n        font-size: 2px;\n}\n.content .content_left .cate_nav .li-level-8[data-v-7af21ec6] {\n        padding-left: 160px;\n        font-size: 0px;\n}\n.content .content_left .cate_nav .li-level-9[data-v-7af21ec6] {\n        padding-left: 180px;\n        font-size: -2px;\n}\n.content .content_left .cate_nav .li-level-10[data-v-7af21ec6] {\n        padding-left: 200px;\n        font-size: -4px;\n}\n.content .content_right[data-v-7af21ec6] {\n    width: 80%;\n    float: left;\n    padding-top: 50px;\n}\n.content .content_right .article_section[data-v-7af21ec6] {\n      width: 90%;\n      margin: 0 auto;\n      margin-bottom: 20px;\n      padding: 10px 15px 10px 15px;\n      border-style: solid;\n      border-width: 1px;\n}\n.content .content_right .article_section .title[data-v-7af21ec6] {\n        height: 30px;\n        margin: 0 0 10px 0;\n}\n.content .content_right .article_section .summary[data-v-7af21ec6] {\n        margin: 0px 0 10px 0;\n        height: 89px;\n        overflow: hidden;\n}\n.content .content_right .article_section .infoDiv[data-v-7af21ec6] {\n        position: relative;\n}\n.content .content_right .article_section .infoDiv .visit_span[data-v-7af21ec6] {\n          position: absolute;\n          bottom: 0px;\n          margin-left: 20px;\n}\n.content .content_right .article_section .infoDiv .time_span[data-v-7af21ec6] {\n          position: absolute;\n          bottom: 0px;\n          right: 20px;\n}\n.content .content_right .pagination[data-v-7af21ec6] {\n      float: right;\n      margin: 20px 120px 30px 0px;\n}\n.content .content_right[data-v-7af21ec6]:after {\n    content: \"\";\n    display: block;\n    width: 1px;\n    background: #d7dde4;\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: -1px;\n}\n", ""]);

// exports


/***/ }),

/***/ 187:
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

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      activeId: '1',
      categoryInfo: {
        title: '',
        parent: '0',
        order: ''
      },
      categoryList: {},
      articleList: {}
    };
  },

  computed: {},
  mounted: function mounted() {
    this.getCatory();
    this.getArticleByCategory(this.activeId);
  },

  methods: {
    showDetail: function showDetail(id) {
      this.$router.push({ path: '/detail/' + id });
      // 保持打开时定位在文章顶部
      this.$nextTick(function () {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      });
    },
    getCatory: function getCatory() {
      var _this = this;

      var payload = {
        // _token: window.Laravel.csrfToken
      };
      this.$http.post('/getCategory', payload).then(function (response) {
        // 请求成功
        _this.categoryList = response.data;
      }, function (response) {
        // 请求失败
        _this.$Message.error(_this.$store.state.responseErrorMsg);
      });
    },
    getArticleByCategory: function getArticleByCategory(id) {
      var _this2 = this;

      this.activeId = id;
      var payload = {
        id: id
        // _token: window.Laravel.csrfToken
      };
      this.$http.post('/getArticleByCategory', payload).then(function (response) {
        // 请求成功
        _this2.articleList = response.data;
      }, function (response) {
        // 请求失败
        _this2.$Message.error(_this2.$store.state.responseErrorMsg);
      });
    }
  }
});

/***/ }),

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "Row",
    { staticClass: "content" },
    [
      _c("Col", { staticClass: "content_left" }, [
        _c(
          "ul",
          { staticClass: "ivu-menu ivu-menu-light ivu-menu-vertical cate_nav" },
          _vm._l(_vm.categoryList, function(item, index) {
            return _c(
              "li",
              {
                class: [
                  "ivu-menu-item",
                  {
                    "ivu-menu-item-active ivu-menu-item-selected":
                      _vm.activeId == item.id
                  },
                  "li-level-" + item.c_level
                ],
                on: {
                  click: function($event) {
                    _vm.getArticleByCategory(item.id)
                  }
                }
              },
              [
                _vm._v(
                  "\n          " +
                    _vm._s(item.c_title) +
                    " 【" +
                    _vm._s(item.articles_count) +
                    "】\n      "
                )
              ]
            )
          })
        )
      ]),
      _vm._v(" "),
      _c(
        "Col",
        { staticClass: "content_right" },
        _vm._l(_vm.articleList, function(article, index) {
          return _c("section", { staticClass: "article_section" }, [
            _c("div", { staticClass: "title" }, [
              _c("h2", [_vm._v(_vm._s(article.title))])
            ]),
            _vm._v(" "),
            _c("div", {
              staticClass: "summary",
              domProps: { innerHTML: _vm._s(article.content) }
            }),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "infoDiv" },
              [
                _c(
                  "Button",
                  {
                    staticClass: "readmore",
                    attrs: { type: "info" },
                    on: {
                      click: function($event) {
                        _vm.showDetail(article.id)
                      }
                    }
                  },
                  [_vm._v("详细")]
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "visit_span" },
                  [
                    _c("Icon", { attrs: { type: "ios-eye", color: "" } }),
                    _vm._v(" 访问量 " + _vm._s(article.visit_count))
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "time_span" },
                  [
                    _c("Icon", { attrs: { type: "ios-clock" } }),
                    _vm._v(" " + _vm._s(article.created_at))
                  ],
                  1
                )
              ],
              1
            )
          ])
        })
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
    require("vue-hot-reload-api")      .rerender("data-v-7af21ec6", module.exports)
  }
}

/***/ })

});