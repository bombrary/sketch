---
title: "Crystal"
date: 2022-12-18T20:18:27+09:00
tags: ["p5js"]
description: Crystal
---

{{< p5container "works/crystal/" >}}

凸多角形の描画は以下のサイトを参考にした：[Generating Random Convex Polygons](https://cglab.ca/~sander/misc/ConvexGeneration/convex.html)．今回作ったコードでは，`convexPolygonRandom`関数が凸多角形の頂点を生成する役目を担っている．

{{< code-external "works/crystal/script.js" "js" >}}
