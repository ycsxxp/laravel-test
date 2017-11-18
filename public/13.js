webpackJsonp([13],{

/***/ 134:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(163)
}
var normalizeComponent = __webpack_require__(31)
/* script */
var __vue_script__ = __webpack_require__(165)
/* template */
var __vue_template__ = __webpack_require__(166)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-f0388696"
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
Component.options.__file = "resources\\assets\\js\\AdminPage\\Category\\Form.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-f0388696", Component.options)
  } else {
    hotAPI.reload("data-v-f0388696", Component.options)
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

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(164);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(145)("a143a2cc", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f0388696\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/sass-loader/lib/loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Form.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-f0388696\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/sass-loader/lib/loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Form.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 164:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, "\n.addUserForm[data-v-f0388696] {\n  width: 350px;\n  padding: 20px 0 20px 0;\n}\n.option-2[data-v-f0388696] {\n  padding-left: 40px;\n}\n.option-3[data-v-f0388696] {\n  padding-left: 60px;\n}\n.option-4[data-v-f0388696] {\n  padding-left: 80px;\n}\n.option-5[data-v-f0388696] {\n  padding-left: 100px;\n}\n.option-6[data-v-f0388696] {\n  padding-left: 120px;\n}\n.option-7[data-v-f0388696] {\n  padding-left: 140px;\n}\n.option-8[data-v-f0388696] {\n  padding-left: 160px;\n}\n.option-9[data-v-f0388696] {\n  padding-left: 180px;\n}\n.option-10[data-v-f0388696] {\n  padding-left: 200px;\n}\n", ""]);

// exports


/***/ }),

/***/ 165:
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

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      type: this.$route.params.type,
      apiurl: '',
      categoryInfo: {
        title: '',
        parent: '0',
        order: ''
      },
      categoryList: {},
      categoryValidate: {
        title: [{ required: true, message: '分类名不能为空', trigger: 'blur' }],
        order: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    };
  },
  created: function created() {
    if (this.type == 'edit') {
      this.categoryInfo = this.$store.state.data.categoryFormData.row;
    }
    this.getCatoryForSelect();
  },

  methods: {
    getCatoryForSelect: function getCatoryForSelect() {
      var _this = this;

      var payload = {
        _token: window.Laravel.csrfToken
      };
      this.$http.post('/getCategory', payload).then(function (response) {
        // 请求成功
        _this.categoryList = response.data;
      }, function (response) {
        // 请求失败
        _this.$Message.error(_this.$store.state.responseErrorMsg);
      });
    },
    handleSubmit: function handleSubmit(name) {
      var _this2 = this;

      this.$refs[name].validate(function (valid) {
        if (valid) {
          _this2.categoryInfo._token = window.Laravel.csrfToken;
          if (_this2.type == 'add') {
            _this2.apiurl = '/addCategory';
          } else {
            _this2.apiurl = '/updateuser';
          }
          _this2.$http.post(_this2.apiurl, _this2.categoryInfo).then(function (response) {
            _this2.$Message.success('添加成功!');
            _this2.$router.push({ path: '/category' });
          }, function (response) {
            _this2.$Message.error(_this2.$store.state.responseErrorMsg);
          });
        } else {
          _this2.$Message.error('表单验证失败!');
        }
      });
    },
    handleReset: function handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
});

/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "addUserForm" },
    [
      _c(
        "Form",
        {
          ref: "categoryInfo",
          attrs: {
            model: _vm.categoryInfo,
            "label-width": 80,
            rules: _vm.categoryValidate
          }
        },
        [
          _c(
            "Form-item",
            { attrs: { label: "分类名", prop: "title" } },
            [
              _c("Input", {
                attrs: { type: "text", placeholder: "请输入分类名" },
                model: {
                  value: _vm.categoryInfo.title,
                  callback: function($$v) {
                    _vm.$set(_vm.categoryInfo, "title", $$v)
                  },
                  expression: "categoryInfo.title"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "Form-item",
            { attrs: { label: "父分类", prop: "parent" } },
            [
              _c(
                "Select",
                {
                  model: {
                    value: _vm.categoryInfo.parent,
                    callback: function($$v) {
                      _vm.$set(_vm.categoryInfo, "parent", $$v)
                    },
                    expression: "categoryInfo.parent"
                  }
                },
                [
                  _c("Option", { attrs: { value: "0" } }, [_vm._v("顶级分类")]),
                  _vm._v(" "),
                  _vm._l(_vm.categoryList, function(item, index) {
                    return _c(
                      "Option",
                      {
                        key: index,
                        class: "option-" + item.c_level,
                        attrs: { value: item.id }
                      },
                      [_vm._v(_vm._s(item.c_title) + "\n        ")]
                    )
                  })
                ],
                2
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "Form-item",
            { attrs: { label: "顺序", prop: "order" } },
            [
              _c("Input", {
                attrs: { placeholder: "请输入" },
                model: {
                  value: _vm.categoryInfo.order,
                  callback: function($$v) {
                    _vm.$set(_vm.categoryInfo, "order", $$v)
                  },
                  expression: "categoryInfo.order"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "Form-item",
            [
              _c(
                "Button",
                {
                  attrs: { type: "primary" },
                  on: {
                    click: function($event) {
                      _vm.handleSubmit("categoryInfo")
                    }
                  }
                },
                [_vm._v("提交")]
              ),
              _vm._v(" "),
              _c(
                "Button",
                {
                  staticStyle: { "margin-left": "8px" },
                  attrs: { type: "ghost" },
                  on: {
                    click: function($event) {
                      _vm.handleReset("categoryInfo")
                    }
                  }
                },
                [_vm._v("重置")]
              )
            ],
            1
          )
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
    require("vue-hot-reload-api")      .rerender("data-v-f0388696", module.exports)
  }
}

/***/ })

});