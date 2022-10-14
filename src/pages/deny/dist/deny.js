"use strict";
exports.__esModule = true;
require("./deny.less");
var umi_1 = require("umi");
var react_1 = require("react");
var DenyPage = function (props) {
    var location = props.location, accountInfo = props.accountInfo, dispatch = props.dispatch, children = props.children;
    return (react_1["default"].createElement("div", { className: "flex" },
        react_1["default"].createElement("img", { src: "https://img.hzanchu.com/acimg/707f7a7cdd1b8e922ffcbfe572b303a9.png" }),
        "\u60A8\u6682\u65F6\u6CA1\u6709\u6743\u9650\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458\u5206\u914D\u6743\u9650\uFF01"));
};
exports["default"] = umi_1.connect(function (_a) {
    var baseModel = _a.baseModel;
    return ({ baseModel: baseModel });
})(DenyPage);
