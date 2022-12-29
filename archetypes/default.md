---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
tags: ["p5js"]
description: "{{ replace .Name "-" " " | title }}"
---

{{< p5container "works/NAME/" >}}

{{< code-external "works/NAME/script.js" "js" >}}
