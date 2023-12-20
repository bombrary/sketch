---
title: "Deep sea"
date: 2023-12-22T00:00:00+09:00
tags: ["p5js"]
description: "Deep sea"
---

{{< p5container "works/deep-sea/" >}}

[globalCompositeOperation](https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation)を使って斜線領域を円形にくり抜く。[blendMode](https://p5js.org/reference/#/p5/blendMode)はこの機能をラップして実装されているが（[参考ソース](https://github.com/processing/p5.js/blob/a1748ee61a9f5703b2fe715073fe59496ba7325f/src/core/p5.Renderer2D.js#L359)）、すべての機能を使いたい場合は`globalCompositeOperation`を直接呼び出す必要がある。入りうる値については[Compositing and Blending Level 2](https://drafts.fxtf.org/compositing/#destination-in)が詳しい。

{{< code-external "works/deep-sea/script.js" "js" >}}
