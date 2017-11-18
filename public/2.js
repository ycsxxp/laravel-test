webpackJsonp([2],{

/***/ 138:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(181)
}
var normalizeComponent = __webpack_require__(31)
/* script */
var __vue_script__ = __webpack_require__(183)
/* template */
var __vue_template__ = __webpack_require__(184)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0df30b8d"
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
Component.options.__file = "resources\\assets\\js\\HomePage\\Homepage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0df30b8d", Component.options)
  } else {
    hotAPI.reload("data-v-0df30b8d", Component.options)
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

/***/ 148:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(31)
/* script */
var __vue_script__ = __webpack_require__(149)
/* template */
var __vue_template__ = __webpack_require__(150)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
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
Component.options.__file = "resources\\assets\\js\\HomePage\\Catalog.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4d7c914a", Component.options)
  } else {
    hotAPI.reload("data-v-4d7c914a", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 149:
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

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      orderArticleList: {
        visitList: {},
        likeList: {}
      }
    };
  },

  // 对传进来的 recent, hot 参数监听 父组件修改后 同步修改到子组件
  watch: {
    recent: function recent(val) {
      this.visitList = val; //新增result的watch，监听变更并同步到myResult上
    },
    hot: function hot(val) {
      this.likeList = val; //新增result的watch，监听变更并同步到myResult上
    }
  },
  mounted: function mounted() {
    this.getOrderArticleList();
  },

  computed: {
    // 过滤器
    hotArticleInfo: function hotArticleInfo() {
      return _.orderBy(this.orderArticleList.likeList, 'like_count', 'desc').slice(0, 5);
    },
    recentArticleInfo: function recentArticleInfo() {
      return _.orderBy(this.orderArticleList.visitList, 'visit_count', 'desc').slice(0, 5);
    }
  },
  methods: {
    getOrderArticleList: function getOrderArticleList() {
      var _this = this;

      var payload = {
        _token: window.Laravel.csrfToken
      };
      this.$http.post('/getOrderArticleList', payload).then(function (response) {
        // 请求成功 得到排序后的列表
        _this.orderArticleList.likeList = response.data.order_by_like;
        _this.orderArticleList.visitList = response.data.order_by_visit;
      }, function (response) {
        // 请求失败
        _this.$Message.error(_this.$store.state.responseErrorMsg);
      });
    },
    showDetail: function showDetail(id) {
      this.$router.push({ path: '/detail/' + id });
    }
  }
});

/***/ }),

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("section", { staticClass: "remen-section" }, [
      _vm._m(0),
      _vm._v(" "),
      _c(
        "ul",
        { staticClass: "remen-list" },
        _vm._l(_vm.hotArticleInfo, function(article) {
          return _c("li", [
            _c(
              "a",
              {
                on: {
                  click: function($event) {
                    _vm.showDetail(article.id)
                  }
                }
              },
              [_vm._v(_vm._s(article.title))]
            )
          ])
        })
      )
    ]),
    _vm._v(" "),
    _c("section", { staticClass: "recent-section" }, [
      _vm._m(1),
      _vm._v(" "),
      _c(
        "ul",
        { staticClass: "recent-list" },
        _vm._l(_vm.recentArticleInfo, function(article) {
          return _c("li", [
            _c(
              "a",
              {
                on: {
                  click: function($event) {
                    _vm.showDetail(article.id)
                  }
                }
              },
              [_vm._v(_vm._s(article.title))]
            )
          ])
        })
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "title" }, [_c("h2", [_vm._v("热门文章")])])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "title" }, [_c("h2", [_vm._v("推荐文章")])])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4d7c914a", module.exports)
  }
}

/***/ }),

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(182);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(145)("453554c7", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0df30b8d\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Homepage.vue", function() {
     var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0df30b8d\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../node_modules/sass-loader/lib/loader.js!../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Homepage.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.content[data-v-0df30b8d] {\n  width: 100%;\n  min-height: 720px;\n}\n.content .content_left[data-v-0df30b8d] {\n    width: 70%;\n    float: left;\n    padding-top: 20px;\n}\n.content .content_left .article_section[data-v-0df30b8d] {\n      width: 70%;\n      margin: 0 auto;\n      margin-bottom: 20px;\n      padding: 10px 15px 10px 15px;\n      border-style: solid;\n      border-width: 1px;\n}\n.content .content_left .article_section .title[data-v-0df30b8d] {\n        height: 30px;\n        margin: 0 0 10px 0;\n}\n.content .content_left .article_section .cover[data-v-0df30b8d] {\n        width: 100%;\n}\n.content .content_left .article_section .cover img[data-v-0df30b8d] {\n          width: auto;\n          height: auto;\n          max-width: 100%;\n          max-height: 100%;\n}\n.content .content_left .article_section .summary[data-v-0df30b8d] {\n        margin: 0px 0 10px 0;\n        height: 89px;\n        overflow: hidden;\n}\n.content .content_left .article_section .infoDiv[data-v-0df30b8d] {\n        position: relative;\n}\n.content .content_left .article_section .infoDiv .visit_span[data-v-0df30b8d] {\n          position: absolute;\n          bottom: 0px;\n          margin-left: 20px;\n}\n.content .content_left .article_section .infoDiv .time_span[data-v-0df30b8d] {\n          position: absolute;\n          bottom: 0px;\n          right: 20px;\n}\n.content .content_left .pagination[data-v-0df30b8d] {\n      float: right;\n      margin: 20px 120px 30px 0px;\n}\n.content .content-right[data-v-0df30b8d] {\n    width: 30%;\n    float: left;\n}\n.content .content-right .remen-section[data-v-0df30b8d] {\n      padding: 20px 15px 15px 20px;\n}\n.content .content-right .remen-section .remen-list[data-v-0df30b8d] {\n        margin: 20px 0 0 20px;\n}\n.content .content-right .recent-section[data-v-0df30b8d] {\n      padding: 20px 15px 15px 20px;\n}\n.content .content-right .recent-section .recent-list[data-v-0df30b8d] {\n        margin: 20px 0 0 20px;\n}\n", ""]);

// exports


/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Catalog_vue__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Catalog_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Catalog_vue__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      articleInfo: {},
      hotArticleList: {},
      recentArticleList: {},
      articleDetail: {},
      paginationInit: {
        total: 1,
        page: this.$store.state.pageConfig.currentPage,
        size: this.$store.state.pageConfig.pageSize,
        sizeOpt: [5, 10, 15, 20]
      }
    };
  },

  components: {
    Catalog: __WEBPACK_IMPORTED_MODULE_0__Catalog_vue___default.a
  },
  created: function created() {
    this.getArticle();
  },

  methods: {
    getArticle: function getArticle() {
      var _this = this;

      var payload = {
        size: this.paginationInit.size,
        page: this.paginationInit.page
      };
      this.$http.post('/getArticle', payload).then(function (response) {
        _this.articleInfo = response.data.articles;
        _this.paginationInit.total = response.data.total;
        _this.hotArticleList = _this.articleInfo;
        _this.recentArticleList = _this.articleInfo;
      }, function (response) {
        _this.$Message.error(_this.$store.state.responseErrorMsg);
      });
    },
    showDetail: function showDetail(id) {
      this.$router.push({ path: '/detail/' + id });
      // // 保持打开时定位在文章顶部
      // this.$nextTick(function () {
      //   document.body.scrollTop = 0
      //   document.documentElement.scrollTop = 0
      // })
    },
    changePage: function changePage(page) {
      var payload = {
        page: page,
        size: this.paginationInit.size
      };
      this.$store.commit('setPageConfig', payload);
      this.paginationInit.page = page;
      this.getArticle();
    },
    setPageSize: function setPageSize(size) {
      var payload = {
        page: this.paginationInit.page,
        size: size
      };
      this.$store.commit('setPageConfig', payload);
      this.paginationInit.size = size;
      this.getArticle();
    }
  }
});

/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "Row",
    { staticClass: "content" },
    [
      _c(
        "Col",
        { staticClass: "content_left" },
        [
          _vm._l(_vm.articleInfo, function(article) {
            return _c("section", { staticClass: "article_section" }, [
              _c("div", { staticClass: "title" }, [
                _c("h2", [_vm._v(_vm._s(article.title))])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "cover" }),
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
          }),
          _vm._v(" "),
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
        ],
        2
      ),
      _vm._v(" "),
      _c("Col", { staticClass: "content-right" }, [_c("catalog")], 1)
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
    require("vue-hot-reload-api")      .rerender("data-v-0df30b8d", module.exports)
  }
}

/***/ })

});