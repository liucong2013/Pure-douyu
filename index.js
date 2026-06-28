// ==UserScript==
// @name         Pure Douyu 斗鱼纯净版
// @namespace    PureDouyu
// @version      0.1.9
// @description  净化斗鱼网页版，屏蔽广告/无用模块，提供清爽流畅的观看体验。 *部分代码参考了douyuEx
// @author       DreamNya
// @match        https://www.douyu.com/beta/*
// @match        https://www.douyu.com/topic/*
// @include      /https:\/\/www.douyu.com\/\d+/
// @icon         https://www.douyu.com/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @noframes
// ==/UserScript==

// @grant unsafeWindow 能够防止网页原生API被斗鱼污染、顺便兼容未来可能加入的GM_xmlhttpRequest
// unsafeWindow.console = console;

const removeList = [
    "iframe",
    "#yuba-bottom-region", // 直播下方鱼吧
    "#js-room-activity", // 右侧超级粉丝团悬浮广告
    "#player-marvel-controller~div[class^='watermark']", //房间号水印
    ".bc-wrapper", // 暴雪战网绑定入口
    ".wm-general", // 推广横幅
    ".DfsRankGivingActBanner", // 钻粉横幅
    ".DfsRankDiscountActBanner", // 钻粉横幅
    "#js-player-main div[class^='activeContainer']", // 房间信息右侧横幅
    "#js-player-barrage > div.Barrage > div.FishShopTip", // 主播推荐商品
];

const blackList = [
    ".ToolbarCardModule.ToollBarCardModule", // 播放器下方互动玩法
    ".interactEntry", // 互动玩法展开按钮
    ".InteractItem", // 互动玩法按钮
    "#js-player-controlbar div[class^='right-'] > i:has(path[d='M18 8H8v16h16V14'])", // 播放器问题反馈按钮
    "#js-player-controlbar div[class^='right-'] > div.msrceen-14bd72", // 播放器小屏观看按钮
    "#js-player-controlbar div[class^='right-'] > div:has(path[d='M24 14.357V7H6v18h7.143'])", // 播放器画中画按钮
    ".react-draggable", // 所有可拖动广告
    ".NewGiftBarrageBanner", // 右侧礼物横幅
    ".VideoBarrageBanner", // 播放区礼物横幅
    "div:has(>.customBarrage)", // 超级弹幕头
    ".Header-menu-game", // header 游戏
    ".Header-menu-match", // header 赛事
    ".Header-download-wrap", // header 下载
    ".Header-broadcast-wrap", // header 开播
    ".Header-createcenter-wrap", // header 创作中心
    ".Header-taskentry-wrap", // header 任务
    "#room-html5-player img[class^='user-icon-']", // 贵族头像
    "#room-html5-player img[class^='noble-icon-']", // 贵族头像框
    "#room-html5-player img[class^='super-user-icon-']", // 超级弹幕头像
    "#room-html5-player img[class^='super-noble-icon-']", // 超级弹幕头像框
    "#room-html5-player img[class^='super-tail-']", // 超级弹幕尾巴
    "#room-html5-player img[class^='vip-icon-']", // 钻粉弹幕尾巴图标
    "#room-html5-player img[class^='vipIcon-']", // 钻粉弹幕尾巴图标
    "#room-html5-player [class^='super-text-'] img", // 超级弹幕图标
    "#room-html5-player img[class^='headpic-']", // 普通弹幕图标
    ".dy-Modal-mask", // 模态框蒙版
    "#js-layout-fixed-buff", // 半悬浮广告
    ...removeList,
];

const giftBarList = [
    "#js-toolbar-interact", // 同行互动玩法区域
    "#js-toolbar-interact .ToolbarCardModule.ToollBarCardModule", // 同行互动玩法按钮
    "#js-toolbar-interact .interactEntry", // 同行互动玩法展开入口
    "#js-giftList-area", // 礼物栏根节点
    ".ToolbarGiftArea", // 礼物栏容器
    ".ToolbarGiftArea-container", // 礼物栏内容容器
    ".ToolbarGiftArea-giftShowList", // 播放器下方付费礼物
    ".ToolbarGiftArea-arrowMoreEnter", // 付费礼物展开按钮
    ".GiftInfoPanel", // 礼物信息面板
    ".InteractiveGiftPanel", // 互动礼物面板
    "button:has(+#js-player-toolbar)", // 全屏展开礼物按钮
];

const giftBarRowList = [
    ".PlayerToolbar-ContentRow:has(#js-giftList-area)", // 礼物栏所在的整行
];

const giftBarSkinList = [
    "[class^='interactive__']:has(#js-player-toolbar)", // 礼物栏外层皮肤背景
    "[class*=' interactive__']:has(#js-player-toolbar)",
    "[class^='toolbar__']:has(#js-player-toolbar)", // toolbar 外层容器
    "[class*=' toolbar__']:has(#js-player-toolbar)",
];

const whiteList = [
    ".InteractItem[dataname='粉丝钓鱼']",
    ".InteractItem[dataname='互动预言']",
    ".InteractItem[dataname='互动抽奖']",
    ".guessDealerPopup > .react-draggable", // 我要预言
    ".high_energy_barrage > .react-draggable", // 高能弹幕
];

const otherCSS = `
    /* 互动玩法按钮 */
    .InteractItem {
        margin: 0 !important;
        padding: 0 !important;
    }

    /* 播放器顶部白边 */
    #root {
        margin: 0 !important;
    }

    /* 播放器底部白边 */
    #js-player-main > div:first-child:before {
        padding-top: 120px !important;
    }

    /* 超级弹幕背景 */
    #room-html5-player div[class^='super-text-'] {
        color: rgb(255, 255, 255) !important;
        background-image: none !important;
    }

    /* 贵族弹幕背景 */
    #room-html5-player div:has(> img[class^='user-icon-']) {
        background: none !important;

        > [class^='text-'] {
            color: rgb(255, 255, 255) !important;
        }
    }

    /* 贵族弹幕背景 */
    #room-html5-player div:has(> img[class^='super-user-icon-']) {
        background: none !important;

        > [class^='super-text-'] {
            color: rgb(255, 255, 255) !important;
        }
    }

    /* 钻粉弹幕背景 */
    #room-html5-player div.barrage-gradient {
        border: none !important;
    }

    /* 钻粉弹幕边框 */
    #room-html5-player div[class^='text-']:has(~ img[class^='vipIcon-']) {
        border: none !important;
    }

    /* +1 回复 收藏*/
    div.labelfisrt-407af4 {
    margin-left: 18px !important;
    margin-right: 18px !important;
}
`;

const PURE_DOUYU_SWITCH_STORAGE = "PureDouyu.featureSwitches.v1";
const PURE_DOUYU_BLOCK_STYLE_ID = "pure-douyu-block-style";
const PURE_DOUYU_GIFT_BAR_STYLE_ID = "pure-douyu-gift-bar-style";
const PURE_DOUYU_CONTROL_STYLE_ID = "pure-douyu-control-style";

const featureSwitches = {
    blockAds: {
        label: "屏蔽广告/无用模块",
        description: "隐藏广告、无用入口和弹幕装饰。",
    },
    hideGiftBar: {
        label: "不显示礼物栏",
        description: "隐藏播放器下方礼物栏、互动玩法和皮肤背景。",
    },
    disableP2P: {
        label: "禁用 P2P 上传",
        description: "拦截 WebRTC P2P 上传连接。",
    },
    documentVisibility: {
        label: "防止页面冻结",
        description: "让页面保持可见状态，减少切后台暂停。",
    },
    highestQuality: {
        label: "自动最高画质",
        description: "播放器出现后自动选择第一个画质。",
    },
    fullscreen: {
        label: "自动全屏",
        description: "开播后尝试进入网页全屏/浏览器全屏。",
    },
    commentEnhancer: {
        label: "+1/回复增强",
        description: "给弹幕评论补充快速 +1 和回复操作。",
    },
    noNewViwer: {
        label: "禁止显示新观众",
        description: "阻止新观众提示继续追加内容。",
    },
    removeElements: {
        label: "移除高耗能元素",
        description: "定时清理 iframe、横幅和悬浮广告节点。",
    },
};

const controlCSS = `
    #pure-douyu-control-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 44px;
        height: 24px;
        margin: 0 6px;
        padding: 0 10px;
        border: 1px solid rgba(255, 126, 0, 0.55);
        border-radius: 999px;
        color: #ff7e00;
        background: rgba(20, 20, 20, 0.88);
        font-size: 12px;
        line-height: 24px;
        cursor: pointer;
        user-select: none;
        z-index: 2147483647;
    }

    #pure-douyu-control-button:hover {
        color: #fff;
        background: #ff7e00;
    }

    #pure-douyu-control-button.pure-douyu-control-button-fixed {
        position: fixed;
        right: 22px;
        bottom: 88px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
    }

    #pure-douyu-control-panel {
        position: fixed;
        width: 318px;
        max-width: calc(100vw - 24px);
        padding: 14px;
        border: 1px solid rgba(255, 126, 0, 0.28);
        border-radius: 14px;
        color: #2f261c;
        background: rgba(255, 250, 243, 0.98);
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.25);
        font-size: 13px;
        z-index: 2147483647;
    }

    #pure-douyu-control-panel[hidden] {
        display: none !important;
    }

    .pure-douyu-panel-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 15px;
        font-weight: 700;
    }

    .pure-douyu-panel-close {
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 50%;
        color: #66594b;
        background: rgba(0, 0, 0, 0.06);
        cursor: pointer;
    }

    .pure-douyu-switch-list {
        display: grid;
        gap: 8px;
    }

    .pure-douyu-switch-row {
        display: grid;
        grid-template-columns: 1fr 42px;
        gap: 12px;
        align-items: center;
        padding: 9px 10px;
        border-radius: 10px;
        background: rgba(255, 126, 0, 0.08);
        cursor: pointer;
    }

    .pure-douyu-switch-row strong {
        display: block;
        color: #282018;
        font-size: 13px;
        line-height: 18px;
    }

    .pure-douyu-switch-row small {
        display: block;
        margin-top: 2px;
        color: #786b5d;
        font-size: 11px;
        line-height: 15px;
    }

    .pure-douyu-switch-control {
        position: relative;
        display: inline-flex;
        width: 42px;
        height: 22px;
    }

    .pure-douyu-switch {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    .pure-douyu-slider {
        position: relative;
        width: 42px;
        height: 22px;
        border-radius: 999px;
        background: #d4c7b9;
        transition: background 0.16s ease;
    }

    .pure-douyu-slider::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.22);
        transition: transform 0.16s ease;
    }

    .pure-douyu-switch:checked + .pure-douyu-slider {
        background: #ff7e00;
    }

    .pure-douyu-switch:checked + .pure-douyu-slider::after {
        transform: translateX(20px);
    }
`;

/*
let times = 0;
// 将拓展子按钮移动直接显示
const timer = setInterval(() => {
    const toolbar = document.querySelector("#js-toolbar-interact");
    const toolbarExpand = document.querySelector(".InteractEntryPanelRecent > .InteractEntryPanelList");

    if (times++ > 10) {
        clearInterval(timer);
        return;
    }
    if (toolbar && toolbarExpand.childElementCount > 20) {
        clearInterval(timer);
        //document.querySelectorAll(".ToolbarCardModule.ToollBarCardModule").forEach((node) => node.remove());
        toolbar.append(...toolbarExpand.childNodes);
    }
}, 5000);
*/

// document-start时立即运行
const featureStart = {
    // 屏蔽各种广告元素
    blockAds: {
        on: function () {
            if (document.getElementById(PURE_DOUYU_BLOCK_STYLE_ID)) {
                return;
            }

            const style = document.createElement("style");
            style.id = PURE_DOUYU_BLOCK_STYLE_ID;
            style.textContent = `
                ${blackList.join(",")} {
                    display:none!important
                }
                ${whiteList.join(",")} {
                    display:flex!important
                }
                ${otherCSS}
            `;

            (document.head || document.documentElement).appendChild(style);
        },
        off: function () {
            document.getElementById(PURE_DOUYU_BLOCK_STYLE_ID)?.remove();
        },
    },
    // 不显示礼物栏
    hideGiftBar: {
        active: false,
        syncTimer: void 0,
        originalStyles: new WeakMap(),
        on: function () {
            this.active = true;
            this.ensureStyle();
            this.applyLayout();
            this.startSync();
        },
        off: function () {
            this.active = false;
            this.stopSync();
            document.getElementById(PURE_DOUYU_GIFT_BAR_STYLE_ID)?.remove();
            this.restoreLayout();
            this.dispatchResize();
        },
        ensureStyle: function () {
            if (document.getElementById(PURE_DOUYU_GIFT_BAR_STYLE_ID)) {
                return;
            }

            const style = document.createElement("style");
            style.id = PURE_DOUYU_GIFT_BAR_STYLE_ID;
            style.textContent = `
                ${giftBarRowList.join(",")} {
                    visibility:hidden!important;
                    pointer-events:none!important;
                }

                ${giftBarList.join(",")} {
                    display:none!important;
                    width:0!important;
                    height:0!important;
                    min-width:0!important;
                    min-height:0!important;
                    flex:0 0 0!important;
                    flex-basis:0!important;
                    margin:0!important;
                    padding:0!important;
                    border:0!important;
                    overflow:hidden!important;
                }

                ${giftBarSkinList.join(",")} {
                    background:none!important;
                    background-image:none!important;
                    min-height:0!important;
                    margin:0!important;
                    padding:0!important;
                    border:0!important;
                }

                .PELact,
                .pushTower-wrapper-gf1HG,
                .PkView-9f6a2c,
                .MorePk,
                .RandomPKBar,
                .LiveRoomLoopVideo,
                .LiveRoomDianzan,
                .maiMaitView-68e80c,
                .PkView {
                    display:none!important;
                }
            `;

            (document.head || document.documentElement).appendChild(style);
        },
        startSync: function () {
            if (this.syncTimer) {
                return;
            }

            this.syncTimer = setInterval(() => {
                if (!this.active || !FeatureSwitch.isEnabled("hideGiftBar")) {
                    this.stopSync();
                    return;
                }

                this.applyLayout();
            }, 1000);
        },
        stopSync: function () {
            if (!this.syncTimer) {
                return;
            }

            clearInterval(this.syncTimer);
            this.syncTimer = void 0;
        },
        applyLayout: function () {
            let changed = false;
            const row = this.getGiftToolbarRow();
            const video = this.getVideoNode();
            const toolbar = document.getElementById("js-player-toolbar");
            const toolbarSkin = toolbar?.parentElement;

            changed = this.setStyles(row, { visibility: "hidden" }) || changed;
            changed = this.setStyles(video, { bottom: "0", zIndex: "25" }) || changed;
            changed = this.setStyles(toolbar, { zIndex: "30" }) || changed;

            if (document.getElementsByClassName("live-next-body")[0]) {
                changed = this.setStyles(toolbarSkin, { zIndex: "20" }) || changed;
            }

            if (changed) {
                this.dispatchResize();
            }
        },
        restoreLayout: function () {
            this.restoreStyles(this.getGiftToolbarRow());
            this.restoreStyles(this.getVideoNode());

            const toolbar = document.getElementById("js-player-toolbar");
            this.restoreStyles(toolbar);
            this.restoreStyles(toolbar?.parentElement);
        },
        getGiftToolbarRow: function () {
            const rows = [...document.getElementsByClassName("PlayerToolbar-ContentRow")];
            return rows.find((row) => row.querySelector("#js-giftList-area")) || rows[0] || null;
        },
        getVideoNode: function () {
            return document.querySelector(".layout-Player-video") || document.querySelector(".stream__T55I3");
        },
        setStyles: function (node, styles) {
            if (!node) {
                return false;
            }

            if (!this.originalStyles.has(node)) {
                const original = {};
                Object.keys(styles).forEach((key) => {
                    original[key] = node.style[key] || "";
                });
                this.originalStyles.set(node, original);
            }

            let changed = false;
            Object.entries(styles).forEach(([key, value]) => {
                if (node.style[key] == value) {
                    return;
                }
                node.style[key] = value;
                changed = true;
            });

            return changed;
        },
        restoreStyles: function (node) {
            if (!node || !this.originalStyles.has(node)) {
                return;
            }

            const original = this.originalStyles.get(node);
            Object.entries(original).forEach(([key, value]) => {
                node.style[key] = value;
            });
            this.originalStyles.delete(node);
        },
        dispatchResize: function () {
            try {
                window.dispatchEvent(new Event("resize"));
            } catch (err) {
                console.error("[PureDouyu] dispatch resize failed", err);
            }
        },
    },
    // 禁用P2P上传
    disableP2P: {
        P2Plist: ["RTCPeerConnection", "webkitRTCPeerConnection", "mozRTCPeerConnection", "msRTCPeerConnection"],
        originals: new Map(),
        proxied: new Set(),
        on: function () {
            unsafeWindow.testHook = unsafeWindow.testHook || {};
            this.P2Plist.forEach((fuc) => {
                if (!unsafeWindow[fuc] || this.proxied.has(fuc)) {
                    return;
                }

                const original = unsafeWindow[fuc];
                this.originals.set(fuc, original);
                unsafeWindow[fuc] = new Proxy(original, {
                    construct: function (target, args, newTarget) {
                        if (!FeatureSwitch.isEnabled("disableP2P")) {
                            return Reflect.construct(target, args, newTarget);
                        }
                        console.log(`[disableP2P] construct  ${fuc}`, ...args);
                        throw new Error(`[disableP2P] construct  ${fuc}`);
                    },
                    apply: function (target, thisArg, args) {
                        if (!FeatureSwitch.isEnabled("disableP2P")) {
                            return Reflect.apply(target, thisArg, args);
                        }
                        console.log(`[disableP2P] apply  ${fuc}`, ...args);
                        throw new Error(`[disableP2P] apply ${fuc}`);
                    },
                });
                this.proxied.add(fuc);
            });
        },
        off: function () {
            this.originals.forEach((original, fuc) => {
                unsafeWindow[fuc] = original;
            });
            this.proxied.clear();
        },
    },
    // 防止页面冻结
    documentVisibility: {
        originals: {},
        visibilityHandler: null,
        on: function () {
            ["hidden", "visibilityState", "webkitVisibilityState"].forEach((name) => {
                if (!Object.prototype.hasOwnProperty.call(this.originals, name)) {
                    this.originals[name] = Object.getOwnPropertyDescriptor(document, name);
                }
            });
            if (!Object.prototype.hasOwnProperty.call(this.originals, "hasFocus")) {
                this.originals.hasFocus = document.hasFocus;
            }

            const defineVisible = (name, value) => {
                try {
                    Object.defineProperty(document, name, { value, writable: false, configurable: true });
                } catch (err) {
                    console.error(`[documentVisibility] define ${name} failed`, err);
                }
            };

            defineVisible("hidden", false);
            defineVisible("visibilityState", "visible");
            defineVisible("webkitVisibilityState", "visible");
            document.hasFocus = () => true;

            if (!this.visibilityHandler) {
                this.visibilityHandler = (e) => {
                    if (FeatureSwitch.isEnabled("documentVisibility")) {
                        e.stopImmediatePropagation();
                    }
                };
                document.addEventListener("visibilitychange", this.visibilityHandler, true);
            }

            document.dispatchEvent(new Event("visibilitychange"));
        },
        off: function () {
            ["hidden", "visibilityState", "webkitVisibilityState"].forEach((name) => {
                try {
                    if (this.originals[name]) {
                        Object.defineProperty(document, name, this.originals[name]);
                    } else {
                        delete document[name];
                    }
                } catch (err) {
                    console.error(`[documentVisibility] restore ${name} failed`, err);
                }
            });

            if (this.originals.hasFocus) {
                document.hasFocus = this.originals.hasFocus;
            }

            if (this.visibilityHandler) {
                document.removeEventListener("visibilitychange", this.visibilityHandler, true);
                this.visibilityHandler = null;
            }
        },
    },
};

// document-end时等网页初始化完毕后再执行
const featureEnd = {
    // 自动最高画质
    highestQuality: {
        selector: "#js-player-controlbar input[readonly][value^='画质'] ~ ul > li:first-child",
        on: function () {
            WaitFor.Element(this.selector)
                .then((node) => {
                    if (FeatureSwitch.isEnabled("highestQuality")) {
                        node.click();
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        off: function () {},
    },
    // 自动全屏 *存在浏览器限制 video元素必须触发用户交互事件才能全屏
    fullscreen: {
        selectorVideo: "video",
        selector: "#js-player-controlbar div[class^='right']",
        videoHandlers: new WeakMap(),
        on: function () {
            WaitFor.Element(this.selectorVideo).then((video) => {
                if (this.videoHandlers.has(video)) {
                    return;
                }

                const handlePlay = () => {
                    this.videoHandlers.delete(video);
                    if (!FeatureSwitch.isEnabled("fullscreen")) {
                        return;
                    }
                    WaitFor.Element(this.selector)
                        .then((node) => {
                            if (FeatureSwitch.isEnabled("fullscreen")) {
                                this.callbacks.online(node);
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                };

                this.videoHandlers.set(video, handlePlay);
                video.addEventListener("play", handlePlay, { once: true });
                if (!video.paused) {
                    handlePlay();
                }
            });
        },
        off: function () {
            WaitFor.Element(this.selectorVideo)
                .then((video) => {
                    const handlePlay = this.videoHandlers.get(video);
                    if (handlePlay) {
                        video.removeEventListener("play", handlePlay);
                        this.videoHandlers.delete(video);
                    }
                })
                .catch(() => {});
        },
        callbacks: {
            // 直播中 → 自动全屏
            online: function (node) {
                if (!FeatureSwitch.isEnabled("fullscreen")) {
                    return;
                }
                // 非全屏状态下自动全屏
                // fixed→非全屏 small→网页全屏 large→全屏 *部分直播间非全屏为small
                if (!document.querySelector("#js-player-main").parentElement.className.includes("large")) {
                    const fullscreenButton = node.querySelector(":scope > i:last-child");
                    //const fullscreenButton = node.querySelector(":scope > i:nth-last-child(2)");
                    fullscreenButton.click();

                    let flag = false;
                    document.addEventListener(
                        "click",
                        (event) => {
                            if (
                                !flag &&
                                event.target != fullscreenButton &&
                                event.target != fullscreenButton.previousElementSibling &&
                                navigator.userActivation.hasBeenActive
                            ) {
                                console.log(navigator.userActivation);
                                document.documentElement.requestFullscreen();
                            }
                        },
                        { once: true }
                    );
                    document.addEventListener(
                        "keydown",
                        () => {
                            flag = true;
                        },
                        { once: true }
                    );
                }
            },
        },
    },
    // (快速) +1按钮 & 回复
    commentEnhancer: {
        selector: "#comment-dzjy-container",
        node: void 0,
        commentNode: void 0,
        comment: void 0,
        observer: void 0,
        observerChecker: void 0,
        contextMenuHandler: void 0,
        clickHandler: void 0,
        active: false,
        callback: function (comment, reply = false, fast = false) {
            if (!FeatureSwitch.isEnabled("commentEnhancer")) {
                return;
            }
            const danmu = comment.data.text;
            const user = comment.data.extraData.sendName;
            // console.log(danmu, user);
            if (danmu) {
                document.querySelector("div.ChatSend-txt").innerText = reply ? `@${user}：${danmu}` : danmu;
                if (fast) {
                    document.querySelector("button.ChatSend-button").click();
                }
            } else {
                throw new Error(`Invaild danmu: ${danmu}; user: ${user}`);
            }
        },
        baseHtml :`<div id="reply-plus-btn" class="labelfisrt-407af4 pure-douyu-comment-extra">回复+1</div><p class="sugun-e3fbf6 pure-douyu-comment-extra">|</p><div id="plus1-btn" class="labelfisrt-407af4 pure-douyu-comment-extra">+1</div><p class="sugun-e3fbf6 pure-douyu-comment-extra">|</p>`,
        replyHtml: `<div id="reply-btn" class="labelfisrt-407af4 pure-douyu-comment-extra">回复</div><p class="sugun-e3fbf6 pure-douyu-comment-extra">|</p>`,
        hasReply: false,
        getHtml: function () {
            return this.baseHtml + (this.hasReply ? this.replyHtml : "");
        },
       render: function () {
    if (
        !FeatureSwitch.isEnabled("commentEnhancer") ||
        !this.commentNode ||
        !this.node
    ) {
        return;
    }

    const commentWrap =
        this.commentNode.querySelector(":scope > div");

    if (!commentWrap?.comment) {
        return;
    }

    this.comment = commentWrap.comment;

    const parentNode =
        this.node.querySelector(".btnsInner-03a19c");

    if (!parentNode) {
        return;
    }

    // 删除旧插件按钮
    parentNode
        .querySelectorAll(".pure-douyu-comment-extra")
        .forEach(node => node.remove());

    // 删除收藏
    this.comment.__c_c?.nextElementSibling?.remove();
    this.comment.__c_c?.remove();

    // 删除原 +1
    const originPlus1 = this.comment.__jia_yi;

    if (originPlus1) {
        originPlus1.nextElementSibling?.remove();
        originPlus1.remove();
    }

    // 原回复按钮
    const originReply = this.comment.__h_f;

    if (!originReply) {
        return;
    }

    originReply.insertAdjacentHTML(
        "afterend",
        `
        <p class="sugun-e3fbf6 pure-douyu-comment-extra">|</p>

        <div
            id="reply-plus-btn"
            class="labelfisrt-407af4 pure-douyu-comment-extra"
        >
            回复+1
        </div>

        <p class="sugun-e3fbf6 pure-douyu-comment-extra">|</p>

        <div
            id="plus1-btn"
            class="labelfisrt-407af4 pure-douyu-comment-extra"
        >
            +1
        </div>
        `
    );
},
        on: function () {
            if (this.active) {
                return;
            }
            this.active = true;
            WaitFor.Element(this.selector)
                .then((node) => {
                    if (!FeatureSwitch.isEnabled("commentEnhancer")) {
                        return;
                    }
                    this.node = node;
                    this.observer = new MutationObserver((mutations) => {
                        if (!mutations?.[0]?.addedNodes?.length) {
                            return;
                        }
                        this.render();
                    });
                    this.observerChecker = new MutationObserver((mutations) => {
                        if (!mutations?.[0]?.addedNodes?.length) {
                            return;
                        }
                        this.observerChecker?.disconnect();
                        if (!this.active || !FeatureSwitch.isEnabled("commentEnhancer")) {
                            return;
                        }
                        this.commentNode = document.querySelector("#comment-higher-container");

                        if (!this.contextMenuHandler) {
                           this.contextMenuHandler = (event) => {
    if (!FeatureSwitch.isEnabled("commentEnhancer")) {
        return;
    }

    const comment = this.comment;

    if (!comment) {
        return;
    }

    if (event.target === comment.__h_f) {
        event.preventDefault();
        event.stopPropagation();

        this.callback(comment, true, true);
        return;
    }

    switch (event.target?.id) {
        case "reply-plus-btn":
            event.preventDefault();
            event.stopPropagation();

            this.callback(comment, true, true);
            break;

        case "plus1-btn":
            event.preventDefault();
            event.stopPropagation();

            this.callback(comment, false, true);
            break;
    }
};
                        }

                        if (!this.clickHandler) {
                            this.clickHandler = (event) => {
    if (!FeatureSwitch.isEnabled("commentEnhancer")) {
        return;
    }

    const comment = this.comment;

    if (!comment) {
        return;
    }

    switch (event.target?.id) {
        case "reply-plus-btn":
            this.callback(comment, true, true);
            break;

        case "plus1-btn":
            this.callback(comment, false, true);
            break;
    }
};
                        }

                        // 委托回复/+1右击事件
                        node.addEventListener("contextmenu", this.contextMenuHandler);

                        // 委托回复/+1点击事件
                        node.addEventListener("click", this.clickHandler);

                        const comment = this.commentNode.querySelector(":scope > div")?.comment;
                        if (!comment) {
                            return;
                        }
                        if (!comment.__h_f) {
                            this.hasReply = true;
                        }
                        this.hasReply = false;
                        this.render();
                        this.observer.observe(node, { childList: true });
                    });
                    this.observerChecker.observe(node, { childList: true });
                })
                .catch((err) => {
                    this.active = false;
                    console.error(err);
                });
        },
        off: function () {
            this.active = false;
            this.observer?.disconnect();
            this.observerChecker?.disconnect();
            if (this.node) {
                if (this.contextMenuHandler) {
                    this.node.removeEventListener("contextmenu", this.contextMenuHandler);
                }
                if (this.clickHandler) {
                    this.node.removeEventListener("click", this.clickHandler);
                }
                this.node.querySelectorAll(".pure-douyu-comment-extra").forEach((node) => node.remove());
            }
            this.observer = void 0;
            this.observerChecker = void 0;
        },
    },
    // 禁止显示新观众
    noNewViwer: {
        selector: "#js-barrage-extendList",
        node: void 0,
        originals: new WeakMap(),
        on: function () {
            WaitFor.Element(this.selector)
                .then((node) => {
                    if (!FeatureSwitch.isEnabled("noNewViwer")) {
                        return;
                    }
                    this.node = node;
                    if (!this.originals.has(node)) {
                        this.originals.set(node, {
                            appendChild: node.appendChild,
                            replaceChild: node.replaceChild,
                        });
                    }
                    node.appendChild = () => {};
                    node.replaceChild = () => {};
                    node.textContent = "";
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        off: function () {
            if (!this.node) {
                return;
            }

            const originals = this.originals.get(this.node);
            if (originals) {
                this.node.appendChild = originals.appendChild;
                this.node.replaceChild = originals.replaceChild;
            }
        },
    },
    // 移除高耗能元素
    removeElements: {
        timer: void 0,
        on: function () {
            if (this.timer) {
                return;
            }
            let times = 0;
            this.timer = setInterval(() => {
                if (!FeatureSwitch.isEnabled("removeElements")) {
                    clearInterval(this.timer);
                    this.timer = void 0;
                    return;
                }
                removeList.forEach((selector) => document.querySelector(selector)?.remove());
                if (++times > 5) {
                    clearInterval(this.timer);
                    this.timer = void 0;
                }
            }, 5000);
        },
        off: function () {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = void 0;
            }
        },
    },
};

const FeatureSwitch = {
    state: {},
    button: void 0,
    panel: void 0,
    anchorTimer: void 0,

    init: function () {
        this.state = this.load();
        Object.keys(featureSwitches).forEach((key) => {
            if (typeof this.state[key] != "boolean") {
                this.state[key] = true;
            }
        });
        this.save();
    },

    load: function () {
        try {
            const raw = localStorage.getItem(PURE_DOUYU_SWITCH_STORAGE);
            const data = raw ? JSON.parse(raw) : {};
            return data && typeof data == "object" ? data : {};
        } catch (err) {
            console.error("[PureDouyu] load feature switches failed", err);
            return {};
        }
    },

    save: function () {
        try {
            localStorage.setItem(PURE_DOUYU_SWITCH_STORAGE, JSON.stringify(this.state));
        } catch (err) {
            console.error("[PureDouyu] save feature switches failed", err);
        }
    },

    isEnabled: function (key) {
        return this.state[key] !== false;
    },

    setEnabled: function (key, enabled) {
        if (!featureSwitches[key]) {
            return;
        }

        this.state[key] = Boolean(enabled);
        this.save();
        this.applyFeatureState(key, this.state[key]);
        this.renderSwitchList();
    },

    applyFeatureState: function (key, enabled) {
        const feature = featureStart[key] || featureEnd[key];
        if (!feature) {
            return;
        }

        if (enabled) {
            feature.on?.();
        } else {
            feature.off?.();
        }
    },

    runStartFeatures: function () {
        Object.entries(featureStart).forEach(([key, feature]) => { if (this.isEnabled(key)) { feature.on(); } });
    },

    runEndFeatures: function () {
        Object.entries(featureEnd).forEach(([key, feature]) => { if (this.isEnabled(key)) { feature.on(); } });
    },

    ensureUI: function () {
        this.ensureControlStyle();
        this.ensureButton();
        this.ensurePanel();
        this.mountButton();
    },

    ensureControlStyle: function () {
        if (document.getElementById(PURE_DOUYU_CONTROL_STYLE_ID)) {
            return;
        }

        const style = document.createElement("style");
        style.id = PURE_DOUYU_CONTROL_STYLE_ID;
        style.textContent = controlCSS;
        (document.head || document.documentElement).appendChild(style);
    },

    ensureButton: function () {
        if (this.button) {
            return;
        }

        this.button = document.createElement("div");
        this.button.id = "pure-douyu-control-button";
        this.button.textContent = "净化";
        this.button.title = "Pure Douyu 功能开关";
        this.button.addEventListener("click", (event) => {
            event.stopPropagation();
            this.togglePanel();
        });
    },

    ensurePanel: function () {
        if (this.panel) {
            this.renderSwitchList();
            return;
        }

        this.panel = document.createElement("div");
        this.panel.id = "pure-douyu-control-panel";
        this.panel.hidden = true;
        this.panel.innerHTML = `
            <div class="pure-douyu-panel-title">
                <span>Pure Douyu 功能开关</span>
                <button class="pure-douyu-panel-close" type="button">x</button>
            </div>
            <div class="pure-douyu-switch-list"></div>
        `;
        this.panel.querySelector(".pure-douyu-panel-close").addEventListener("click", () => {
            this.panel.hidden = true;
        });
        this.panel.querySelector(".pure-douyu-switch-list").addEventListener("change", (event) => {
            const target = event.target;
            if (target?.classList?.contains("pure-douyu-switch")) {
                this.setEnabled(target.dataset.feature, target.checked);
            }
        });
        document.addEventListener("click", (event) => {
            if (
                this.panel.hidden ||
                this.panel.contains(event.target) ||
                this.button == event.target ||
                this.button?.contains(event.target)
            ) {
                return;
            }
            this.panel.hidden = true;
        });
        document.body.appendChild(this.panel);
        this.renderSwitchList();
    },

    renderSwitchList: function () {
        if (!this.panel) {
            return;
        }

        const list = this.panel.querySelector(".pure-douyu-switch-list");
        list.textContent = "";
        Object.entries(featureSwitches).forEach(([key, meta]) => {
            const row = document.createElement("label");
            row.className = "pure-douyu-switch-row";

            const text = document.createElement("span");
            const label = document.createElement("strong");
            label.textContent = meta.label;
            const description = document.createElement("small");
            description.textContent = meta.description;
            text.append(label, description);

            const control = document.createElement("span");
            control.className = "pure-douyu-switch-control";
            const checkbox = document.createElement("input");
            checkbox.className = "pure-douyu-switch";
            checkbox.type = "checkbox";
            checkbox.dataset.feature = key;
            checkbox.checked = this.isEnabled(key);
            const slider = document.createElement("span");
            slider.className = "pure-douyu-slider";
            control.append(checkbox, slider);

            row.append(text, control);
            list.appendChild(row);
        });
    },

    togglePanel: function () {
        this.panel.hidden = !this.panel.hidden;
        if (!this.panel.hidden) {
            this.positionPanel();
        }
    },

    positionPanel: function () {
        const rect = this.button.getBoundingClientRect();
        const panelWidth = this.panel.offsetWidth;
        const panelHeight = this.panel.offsetHeight;
        const left = Math.max(12, Math.min(rect.left, window.innerWidth - panelWidth - 12));
        let top = rect.bottom + 8;

        if (top + panelHeight > window.innerHeight - 12) {
            top = Math.max(12, rect.top - panelHeight - 8);
        }

        this.panel.style.left = `${left}px`;
        this.panel.style.top = `${top}px`;
    },

    mountButton: function () {
        if (this.button.isConnected) {
            return;
        }

        const placeNextToBackpack = () => {
            const backpack = this.findBackpackNode();
            if (!backpack?.parentElement) {
                return false;
            }

            this.button.classList.remove("pure-douyu-control-button-fixed");
            backpack.insertAdjacentElement("afterend", this.button);
            return true;
        };

        if (placeNextToBackpack()) {
            return;
        }

        let times = 0;
        this.anchorTimer = setInterval(() => {
            if (placeNextToBackpack()) {
                clearInterval(this.anchorTimer);
                this.anchorTimer = void 0;
                return;
            }

            if (++times <= 30) {
                return;
            }

            clearInterval(this.anchorTimer);
            this.anchorTimer = void 0;
            const toolbar = document.querySelector("#js-player-toolbar") || document.querySelector(".ToolbarGiftArea");
            if (toolbar) {
                toolbar.appendChild(this.button);
            } else {
                this.button.classList.add("pure-douyu-control-button-fixed");
                document.body.appendChild(this.button);
            }
        }, 1000);
    },

    findBackpackNode: function () {
        const selectors = [
            "#js-player-toolbar [title*='背包']",
            "#js-player-toolbar [aria-label*='背包']",
            "#js-player-toolbar [dataname='背包']",
            "#js-player-toolbar [class*='Backpack']",
            "#js-player-toolbar [class*='backpack']",
            ".ToolbarGiftArea [title*='背包']",
            ".ToolbarGiftArea [aria-label*='背包']",
            ".ToolbarGiftArea [dataname='背包']",
            ".ToolbarGiftArea [class*='Backpack']",
            ".ToolbarGiftArea [class*='backpack']",
        ];

        for (const selector of selectors) {
            const node = document.querySelector(selector);
            if (node) {
                return this.pickBackpackAnchor(node);
            }
        }

        const root = document.querySelector("#js-player-toolbar") || document.querySelector(".ToolbarGiftArea");
        if (!root) {
            return null;
        }

        const textNode = [...root.querySelectorAll("button,a,div,span")].find((node) => node.textContent?.trim() == "背包");
        return this.pickBackpackAnchor(textNode);
    },

    pickBackpackAnchor: function (node) {
        if (!node) {
            return null;
        }

        return node.closest("button,a,[role='button'],[class*='Backpack'],[class*='backpack']") || node;
    },
};

const WaitFor = {
    // 默认超时
    timeout: 15000,
    // 上下文记录 <Root, { observer, tasks }>
    contexts: new Map(),
    // 只要命中任意selector 则立即返回结果
    _waitEngine: function (selectors, root, timeout) {
        // 合并选择器 快速命中
        const fastMatch = root.querySelector(selectors.join(", "));
        if (fastMatch) {
            return Promise.resolve(fastMatch);
        }

        // 初始化上下文
        let ctx = this.contexts.get(root);
        if (!ctx) {
            ctx = {
                tasks: new Map(),
                observer: new MutationObserver((mutations) => this._handleMutations(mutations, root)),
            };
            ctx.observer.observe(root, { childList: true, subtree: true });
            this.contexts.set(root, ctx);
        }

        return new Promise((resolve, reject) => {
            const cleanup = () => {
                selectors.forEach((selector) => {
                    const queue = ctx.tasks.get(selector);
                    if (queue) {
                        const idx = queue.findIndex((w) => w == waiter);
                        if (idx > -1) {
                            queue.splice(idx, 1);
                        }
                        if (queue.length == 0) {
                            ctx.tasks.delete(selector);
                        }
                    }
                });
                if (ctx.tasks.size == 0) {
                    ctx.observer.disconnect();
                    this.contexts.delete(root);
                }
            };

            const timerId = setTimeout(() => {
                cleanup();
                reject(new Error(`timeout: [${selectors.join(", ")}]`));
            }, timeout);

            const onSuccess = (node) => {
                clearTimeout(timerId);
                cleanup();
                resolve(node);
            };

            const waiter = { resolve: onSuccess };

            selectors.forEach((selector) => {
                if (!ctx.tasks.has(selector)) ctx.tasks.set(selector, []);
                ctx.tasks.get(selector).push(waiter);
            });
        });
    },

    // Mutation 事件分发器
    _handleMutations: function (mutations, root) {
        const ctx = this.contexts.get(root);
        if (!ctx || !ctx.tasks.size) {
            return;
        }

        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof Element)) {
                    continue;
                }

                for (const [selector, waiters] of ctx.tasks) {
                    let match = null;
                    try {
                        if (node.matches(selector)) {
                            match = node;
                        } else {
                            match = node.querySelector(selector);
                        }
                    } catch (e) {
                        console.error(`WaitFor selector error: "${selector}"`, e);
                        ctx.tasks.delete(selector);
                        continue;
                    }

                    if (match) {
                        // 浅拷贝，避免resolve修改数组导致遍历问题
                        for (const { resolve } of [...waiters]) {
                            resolve(match);
                        }
                    }
                }
            }
        }
    },

    Body: function () {
        return new Promise((resolve) => {
            if (document.body) {
                resolve();
            } else {
                document.addEventListener("DOMContentLoaded", () => {
                    resolve();
                });
            }
        });
    },

    /**
     * 等待单个元素
     * @param {string} selector 选择器
     * @param {Element} [root=document.body] 根节点
     * @param {number} [timeout=this.timeout] timeout 超时时间
     * @returns {Promise<Element>}
     */
    Element: function (selector, root = document.body, timeout = this.timeout) {
        return this._waitEngine([selector], root, timeout).catch(() => {
            throw new Error(`WaitFor.Element timeout (${timeout}ms): ${selector}`);
        });
    },

    /**
     * 等待多个元素
     * @param {string[]} selectors 选择器数组
     * @param {Element} [root=document.body] 根节点
     * @param {number} [timeout=this.timeout] timeout 超时时间
     * @param {boolean} race 竞速模式 (true=任意命中即返回，false=全部命中才返回)
     * @returns {Promise<Element | Element[]>}
     */
    Elements: function (selectors, root = document.body, timeout = this.timeout, race = false) {
        if (race) {
            return this._waitEngine(selectors, root, timeout).catch((err) => {
                throw new Error(`WaitFor.Elements(Race) ${err.message}`);
            });
        }

        const tasks = selectors.map((selector) =>
            this.Element(selector, root, timeout)
                .then((node) => ({ status: "fulfilled", selector, node }))
                .catch((error) => ({ status: "rejected", selector, error }))
        );

        return Promise.all(tasks).then((results) => {
            const failed = results.filter((r) => r.status == "rejected");
            if (failed.length) {
                const messages = failed
                    .map((f) => {
                        const msg = f.error && f.error.message ? f.error.message : "Unknown error";
                        return `${f.selector}: ${msg}`;
                    })
                    .join("\n - ");

                throw new Error(`WaitFor.Elements(All) timeout (${timeout}ms).\n Failed selectors:\n - ${messages}`);
            }
            return results.map((r) => r.node);
        });
    },
};

unsafeWindow.WaitFor = WaitFor;

FeatureSwitch.init();
FeatureSwitch.runStartFeatures();
await WaitFor.Body();
FeatureSwitch.ensureUI();
FeatureSwitch.runEndFeatures();
