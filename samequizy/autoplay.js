// ==UserScript==
// @name           samequizy.pl - Autoplay off
// @name:en        samequizy.pl - Autoplay off
// @namespace      samequizy.pl utils
// @match          https://samequizy.pl/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=samequizy.pl
// @grant          none
// @version        3.0.0
// @author         eye-wave
// @license GPL    3.0
// @description    wyłącza automatyczne załączanie nowego quizu
// @description:en Disables the automatic loading of new quizzes on samequizy.pl.
// ==/UserScript==

document.querySelector(".next-related")?.remove()
