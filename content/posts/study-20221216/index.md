---
title: "Study-20221216"
date: 2022-12-16T21:24:45+09:00
draft: true
---

滲み感を出す練習 + コッホ曲線（をランダムにしたもの）の練習。

半透明の色を塗り重ねれば実現できることは、以下のサイトから学んだ：
[HOW TO HACK A PAINTING](https://sawfish-parrot-k5ex.squarespace.com/essays?offset=1605103200480)。
`blendMode`をいじってみると，重ね塗りの感じが変わって面白い。

図形は，試しに多角形にコッホ曲線を発生させることで実現した．
実際、コード中の`t1, t2, t3`をそれぞれ`1/3, 1/2, 2/3`にするとコッホ曲線になる。
よく見ると元となる多角形（左から三角形，四角形，五角形）が浮き上がっており，これはこれで良い．


{{< p5container "works/study-20221216/" >}}

{{< code-external "works/study-20221216/script.js" "js">}}
