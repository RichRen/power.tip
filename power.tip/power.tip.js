/*
修改：2015年10月22日
修改loading消失时间
*/

(function () {
    $.extend($, {
        power: {}
    });
    function factory($) {
        $.extend($.power, {
            tip: function (tip_text, tip_type, options) {

                $.power.closeTip();

                defaults = {
                    model: tip_type == "loading" ? true : false,    /*是否显示遮挡层 loading 默认显示，其他默认不显示 */
                    top: null,                  /* 窗口离顶部的距离,可以是百分比或像素(如 100) 默认值屏幕中间 */
                    timeout: 2600,               /* 窗口显示多少毫秒后自动关闭,如果设置为0,则不自动关闭 */
                    closed: function () { }
                };

                options = $.extend({}, defaults, options);

                //页面大小参数
                var doc_height = $(document).height();
                var doc_width = $(document).width();
                var win_height = $(window).height();
                var win_width = $(window).width();

                var $tipBlock = undefined;
                if (options.model) {
                    //遮挡层
                    $tipBlock = $("<div>").addClass("power_tip");
                    $tipBlock.css("position", "absolute")
                        .css("top", 0).css("left", 0)
                        .css("background-color", "#AFAFAF")
                        .css("width", doc_width).css("height", doc_height).css("z-index", 99900000)
                        .css("opacity", "0.3");

                    $("body").append($tipBlock);
                    //遮挡层end
                }

                //主体内容
                var $tipContext = $("<div>").addClass("power_tip context").css("position", "fixed").css("min-width", 200).hide();

                //消息框类型
                switch (tip_type) {
                    case "warning":
                        $tipContext.addClass("alert alert-warning alert-dismissable");
                        break;
                    case "loading":
                        $tipContext.addClass("alert alert-loading");
                        break;
                    default:
                        $tipContext.addClass("alert alert-info alert-dismissable");
                        break;
                }

                //关闭事件
                var timeout = undefined;
                function close_tip() {
                    window.clearInterval(timeout);
                    var fadeOutArg = tip_type == "loading" ? 100 : 700;
                    console.log(fadeOutArg)
                    $tipContext.fadeOut(fadeOutArg, function () {
                        $(this).remove();

                        if ($tipBlock)
                            $tipBlock.remove();

                        options.closed.call(this);
                    })
                }

                options.data_close_tip = close_tip;
                //关闭事件end

                //关闭按钮
                var $tipClose = $('<button type="button" class="tip_close" data-dismiss="alert" aria-hidden="true">×</button>');
                $tipClose.click(close_tip);

                if (tip_type != "loading") {
                    $tipContext.append($tipClose);
                }

                $tipContext.append('<strong>' + tip_text + '</strong>');
                $("body").append($tipContext);
                //主体内容end

                if (!$.power.data_tip_index)
                    $.power.data_tip_index = 9900001;

                $tipContext.css("top", options.top ? options.top : (win_height / 2 - 100))
                    .css("left", win_width / 2 - ($tipContext.width() / 2))
                    .fadeIn(500)
                    .css("z-index", 99900001);

                $tipContext.data("options", options);

                if (tip_type != "loading" && options.timeout) {
                    timeout = setTimeout(function () { close_tip(); }, options.timeout);
                }
            },
            closeTip: function () {
                $(".power_tip.context").each(function (index, e) {
                    var ops = $(e).data("options");

                    if ($(e).html() && ops.data_close_tip) {
                        ops.data_close_tip();
                    }
                })
            }
        });

    };

    if (typeof define === "function" && define.amd) {
        // AMD加载
        define("jquery.power.tip", ["jquery"], function ($) {
            factory($);
            return $.power.tip;
        });
    }
    else {
        factory($);
    }

})();