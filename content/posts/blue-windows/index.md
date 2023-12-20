---
title: "Blue windows"
date: 2023-12-21T06:00:00+09:00
tags: ["p5js"]
description: "Blue windows"
---

{{< p5container "works/blue-windows/" >}}

[前回]({{< ref "/posts/contained-lines" >}})頑張って計算して描画した斜線だが、`createGraphics`で小さな領域を作ってそこで多めに線を描画してしまえば、わざわざ交点の計算をやらなくても良いことに気づいた。

{{< code-external "works/blue-windows/script.js" "js" >}}
