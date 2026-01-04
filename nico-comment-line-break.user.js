// ==UserScript==
// @name        nico-comment-line-break
// @description Insert a newline in the Niconico Douga comment field with Shift + Enter.
// @description:ja ニコニコ動画のコメント欄で Shift + Enter で改行できるようにします。
// @version     1.0.0
// @author      KOTO28
// @namespace   https://github.com/KOTO28
// @match       *://www.nicovideo.jp/watch/*
// @grant       none
// @homepageURL https://github.com/KOTO28/nico-comment-line-break/
// @downloadURL https://raw.githubusercontent.com/KOTO28/nico-comment-line-break/main/nico-comment-line-break.user.js
// ==/UserScript==

(function () {
  "use strict";

  let intervalId;

  function main() {
    let commentTextarea;
    document.querySelectorAll("textarea").forEach(function (textarea) {
      // コメント入力欄か判別
      if (textarea.placeholder === "コメントを入力") {
        commentTextarea = textarea;
      }
    });
    if (!commentTextarea) {
      console.warn("Comment textarea not found.");
      return;
    }
    // 取得成功
    clearInterval(intervalId);

    console.log("Comment textarea found:", commentTextarea);
    commentTextarea.addEventListener("keydown", function (e) {
      // console.log(`Key pressed: ${e.key}`);
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault(); // デフォルトの動作を防止
        // カーソル位置に改行を挿入
        const insertText = "\n";

        const start = commentTextarea.selectionStart;
        const end = commentTextarea.selectionEnd;
        const value = commentTextarea.value;

        commentTextarea.value = value.substring(0, start) + insertText + value.substring(end);

        // カーソルを挿入文字の直後に移動
        const newPos = start + insertText.length;
        commentTextarea.focus();
        commentTextarea.setSelectionRange(newPos, newPos);
        // テキストエリアのイベントをトリガー
        const event = new Event("input", { bubbles: true });
        commentTextarea.dispatchEvent(event);
      }
    });
  }

  window.onload = function () {
    // 定期的に実行
    intervalId = setInterval(function () {
      main();
    }, 1000);
    // フルスクリーンモードの変更を監視
    document.addEventListener("fullscreenchange", function () {
      setTimeout(() => {
        main();
      }, 100);
    });
  };
})();
